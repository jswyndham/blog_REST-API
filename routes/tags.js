const express = require("express");
const router = express.Router();
// const { requireSignin, adminMiddleware } = require("../controllers/auth");
const {
  createTag,
  listTags,
  getTagById,
  updateTag,
  deleteTag,
} = require("../controllers/tags");

// validators
// const { runValidation } = require("../validators");
// const { categoryCreateValidator } = require("../validators/category");

router.route("/").post(createTag).get(listTags);
router.route("/:id").get(getTagById).patch(updateTag).delete(deleteTag);

module.exports = router;
