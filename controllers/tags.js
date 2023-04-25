const Tag = require("../models/Tags");
const slugify = require("slugify");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

// CREATE TAGS
const createTag = async (req, res) => {
  const { tag_title } = req.body;
  try {
    const slug = slugify(tag_title).toLowerCase();
    const tag = new Tag({ tag_title, slug });
    const newTag = await tag.save();

    res.status(StatusCodes.CREATED).json({ newTag });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({
      msg: "This tag was not created",
    });
  }
};

// GET ALL TAGS
const listTags = async (req, res) => {
  try {
    const tags = await Tag.find({});
    if (typeof tags !== "undefined" && tags.length > 0) {
      res.status(StatusCodes.OK).json({ tags, count: tags.length });
    } else {
      throw new NotFoundError("There are no tags currently listed");
    }
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({
      msg: err.message,
    });
  }
};

// FIND ONE TAG
const getTagById = async (req, res) => {
  try {
    const {
      body: { tag_title },
      body: { slug },
      params: { id: tagId },
    } = req;
    const tag = await Tag.findById({
      _id: tagId,
      tag_title: tag_title,
      slug: slug,
    });
    res.status(StatusCodes.OK).json({ tag });
    console.log(tag);
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({
      msg: err.message,
    });
  }
};

// EDIT TAG
const updateTag = async (req, res) => {
  try {
    const {
      body: { tag_title },
      params: { id: tagId },
    } = req;

    if (tag_title === "") {
      throw new BadRequestError("Tag field cannot be empty");
    }
    const slug = slugify(tag_title).toLowerCase();
    const tag = await Tag.findOneAndUpdate(
      { _id: tagId },
      { tag_title: tag_title, slug: slug },
      req.body,
      { new: true, runValidators: true }
    );

    if (!tag) {
      throw new NotFoundError(`No tag with the id ${tagId} was found`);
    }
    res.status(StatusCodes.OK).json({
      msg: "Tag was successfully edited",
    });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: err.message });
  }
};

// DELETE TAG
const deleteTag = async (req, res) => {
  try {
    const {
      params: { id: tagId },
    } = req;
    await Tag.findByIdAndRemove({ _id: tagId });
    res.status(StatusCodes.OK).json({
      message: "Tag has been successfully removed from the list.",
    });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({
      msg: err.message,
    });
  }
};

module.exports = {
  createTag,
  listTags,
  getTagById,
  updateTag,
  deleteTag,
};
