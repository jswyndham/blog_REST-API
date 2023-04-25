const express = require("express");
const router = express.Router();
const {
  getAllBlogs,
  createBlog,
  getBlogsByUser,
} = require("../controllers/blogs");
const {
  findSingleBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogs[id]");
const { authentication } = require("../middleware/authentication");

router.route("/").get(getAllBlogs).get(getBlogsByUser).post(createBlog);
router.route("/:slug").get(findSingleBlog).patch(updateBlog).delete(deleteBlog);

module.exports = router;
