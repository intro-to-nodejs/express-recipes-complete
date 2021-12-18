const { create, authenticate } = require("../services/users");

const handleSignup = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const { token } = await create({ name, email, password });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

const handleLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { token } = await authenticate({ email, password });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleSignup,
  handleLogin,
};
