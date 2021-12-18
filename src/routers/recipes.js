const express = require("express");
const router = express.Router();

const { getAll, get, save, update, remove } = require("../controllers/recipes");
const auth = require("../middleware/auth");

router.route("/").get(getAll).post(auth.authenticate(), save);
router
  .route("/:id")
  .get(get)
  .put(auth.authenticate(), update)
  .delete(auth.authenticate(), remove);

module.exports = router;
