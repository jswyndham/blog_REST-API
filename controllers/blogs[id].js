const Blog = require("../models/Blogs");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

// GET SINGLE BLOG
const findSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
    })
      .populate("postedBy", ["name"])
      .populate("categories", ["category_title"])
      .populate("tags", ["tag_title"]);
    if (!blog) {
      throw new NotFoundError(`No blog with that id ${slug} exists`);
    }
    res.status(StatusCodes.OK).json({ blog });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

// EDIT BLOG
const updateBlog = async (req, res) => {
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

    // overwrite and update blog
    const blog = await Blog.findOne({ slug: req.params.slug });
    blog.overwrite(req.body);
    await blog.save();

    res.status(StatusCodes.OK).json({ msg: "Blog was successfully edited" });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: err.message });
  }
};

// DELETE BLOG
const deleteBlog = async (req, res) => {
  try {
    const {
      user: { userId },
      params: { id: blogId },
    } = req;
    const blog = await Blog.findByIdAndRemove({
      _id: blogId,
      createdBy: userId,
    });
    if (!blog) {
      throw new NotFoundError(`No blog with that id ${blogId}`);
    }
    res.status(StatusCodes.OK).send({
      msg: `Blog listing was deleted.`,
    });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: err.message });
  }
};

module.exports = { findSingleBlog, updateBlog, deleteBlog };
