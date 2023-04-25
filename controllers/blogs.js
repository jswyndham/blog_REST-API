const Blog = require("../models/Blogs");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

// GET ALL BLOBS
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("postedBy", ["name"])
      .populate("categories", ["category_title"])
      .populate("tags", ["tag_title"])
      .sort("createdAt");

    if (typeof blogs !== "undefined" && blogs.length > 0) {
      res.status(StatusCodes.OK).json({ blogs, count: blogs.length });
    } else {
      throw new NotFoundError("There are no blogs available.");
    }
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: err.message });
  }
};

// GET BLOGS BY USER ID
const getBlogsByUser = async (req, res) => {
  try {
    const blogs = await Blog.find({ createdBy: req.user.userId })
      .populate("postedBy", ["name"])
      .sort("createdAt");

    if (typeof blogs !== "undefined" && blogs.length > 0) {
      res.status(StatusCodes.OK).json({ blogs, count: blogs.length });
    } else {
      throw new NotFoundError("No blogs have been created by this user.");
    }
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: err.message });
  }
};

// CREATE BLOG ARTICLE
const createBlog = async (req, res) => {
  try {
    const { title, article, photo, categories, tags } = req.body;

    // handle errors
    if (!title) {
      throw new BadRequestError("Title is required.");
    }

    if (!article || article.length < 500) {
      throw new BadRequestError(
        "Article content is too short. A minimum of 500 characters is required to upload the main article body."
      );
    }

    if (typeof categories !== "undefined" && categories.length > 0) {
      res.status(StatusCodes.OK);
    } else {
      throw new NotFoundError(
        "Please choose a category. At least one category must be included when submitting an article."
      );
    }

    if (typeof tags !== "undefined" && tags.length > 0) {
      res.status(StatusCodes.OK);
    } else {
      throw new NotFoundError(
        "Please choose a tag. At least one tag must be included when submitting an article."
      );
    }

    // handle article files (images)
    if (photo) {
      if (photo.size > 10000000) {
        throw new BadRequestError("Image should be less than 1mb in size.");
      }
      photo.data = fs.readFileSync(files.photo.filepath);
      photo.contentType = files.photo.mimetype;
    }

    // create a new article
    const blog = await Blog.create({
      title: title,
      article: article,
      photo: photo,
      categories: categories,
      tags: tags,
      postedBy: req.user.userId,
    });

    res.status(StatusCodes.CREATED).json({ blog });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: err.message });
  }
};

module.exports = { getAllBlogs, createBlog, getBlogsByUser };
