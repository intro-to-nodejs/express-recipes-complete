const fs = require("fs").promises;
const path = require("path");

const recipesFilePath = path.join(__dirname, "../../db/recipes.json");

const getAll = async () => JSON.parse(await fs.readFile(recipesFilePath));
const get = async (id) => {
  const recipes = JSON.parse(await fs.readFile(recipesFilePath));
  const recipe = recipes.find((recipe) => recipe.id === parseInt(id));

  if (!recipe) {
    const err = new Error("Recipe not found");
    err.statusCode = 404;
    throw err;
  }

  return recipe;
};

const save = async (recipe) => {
  const recipes = JSON.parse(await fs.readFile(recipesFilePath));

  recipe.id = recipes.length + 1; // Not a robust incrementor mechanism; don't use in production!
  recipes.push(recipe);

  await fs.writeFile(recipesFilePath, JSON.stringify(recipes));

  return recipe;
};

const update = async (id, updated) => {
  const recipes = JSON.parse(await fs.readFile(recipesFilePath));
  const recipe = recipes.find((recipe) => recipe.id === parseInt(id));

  if (!recipe) {
    const err = new Error("Recipe not found");
    err.statusCode = 404;
    throw err;
  }

  updated.id = recipe.id;

  const updatedRecipes = recipes.map((recipe) => {
    return recipe.id === parseInt(id) ? updated : recipe;
  });

  await fs.writeFile(recipesFilePath, JSON.stringify(updatedRecipes));

  return updated;
};

const remove = async (id) => {
  const recipes = JSON.parse(await fs.readFile(recipesFilePath));
  const recipe = recipes.find((recipe) => recipe.id === parseInt(id));

  if (!recipe) {
    const err = new Error("Recipe not found");
    err.statusCode = 404;
    throw err;
  }

  const newRecipes = recipes
    .map((recipe) => {
      return recipe.id === parseInt(id) ? null : recipe;
    })
    .filter((recipe) => recipe !== null);

  await fs.writeFile(recipesFilePath, JSON.stringify(newRecipes));
};

module.exports = {
  getAll,
  get,
  save,
  update,
  remove,
};
