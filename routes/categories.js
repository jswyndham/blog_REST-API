const express = require("express");
const router = express.Router();
// const { requireSignin, adminMiddleware } = require("../controllers/auth");
const {
  createCategory,
  listCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");

// validators
// const { runValidation } = require("../validators");
// const { categoryCreateValidator } = require("../validators/category");

router.route("/").post(createCategory).get(listCategories);
router
  .route("/:id")
  .get(getCategoryById)
  .patch(updateCategory)
  .delete(deleteCategory);

module.exports = router;
