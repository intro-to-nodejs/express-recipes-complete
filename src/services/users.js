require("dotenv").config();
const bcrypt = require("bcrypt");
const fs = require("fs").promises;
const jwt = require("jsonwebtoken");
const path = require("path");

const { JWT_SECRET } = process.env;
const usersFilePath = path.join(__dirname, "../../db/users.json");

const authenticate = async ({ id, email, password }) => {
  const user = await find({ email });
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!user || !isPasswordValid) {
    throw new Error("Unable to login");
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: 24 * 60 * 60,
  });

  return { token };
};

const create = async ({ email, name, password }) => {
  const users = JSON.parse(await fs.readFile(usersFilePath));
  const user = await find({ email });

  if (user) {
    throw new Error("Email already exists!");
  }

  const newUser = {
    id: users.length + 1, // Not a robust database incrementor; don't use in production
    email,
    name,
    password: await bcrypt.hash(password, 10),
  };

  const token = jwt.sign({ id: newUser.id }, JWT_SECRET, {
    expiresIn: 24 * 60 * 60,
  });

  users.push(newUser);

  await fs.writeFile(usersFilePath, JSON.stringify(users));

  return { token };
};

const find = async ({ id, email }) => {
  const data = await fs.readFile(usersFilePath);
  const users = JSON.parse(data);

  const existingUser = users.find(
    (user) => user.id === id || user.email === email
  );

  return existingUser;
};

module.exports = {
  authenticate,
  create,
  find,
};
