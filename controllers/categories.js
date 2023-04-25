const Category = require("../models/Categories");
const slugify = require("slugify");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

// CREATE CATEGORIES
const createCategory = async (req, res) => {
  const { category_title } = req.body;
  try {
    const slug = slugify(category_title).toLowerCase();
    const category = new Category({ category_title, slug });
    const newCategory = await category.save();

    res.status(StatusCodes.CREATED).json({ newCategory });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({
      msg: "This category was not created",
    });
  }
};

// GET ALL CATEGORIES
const listCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    if (typeof categories !== "undefined" && categories.length > 0) {
      res.status(StatusCodes.OK).json({ categories, count: categories.length });
    } else {
      throw new NotFoundError("There are no categories currently listed");
    }
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({
      msg: err.message,
    });
  }
};

// FIND ONE CATEGORY
const getCategoryById = async (req, res) => {
  try {
    const {
      body: { category_title },
      body: { slug },
      params: { id: categoryId },
    } = req;
    const category = await Category.findById({
      _id: categoryId,
      category_title: category_title,
      slug: slug,
    });
    res.status(StatusCodes.OK).json({ category });
    console.log(category);
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({
      msg: err.message,
    });
  }
};

// EDIT CATEGORY
const updateCategory = async (req, res) => {
  try {
    const {
      body: { category_title },
      params: { id: categoryId },
    } = req;

    if (category_title === "") {
      throw new BadRequestError("Category field cannot be empty");
    }
    const slug = slugify(category_title).toLowerCase();
    const category = await Category.findOneAndUpdate(
      { _id: categoryId },
      { category_title: category_title, slug: slug },
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      throw new NotFoundError(
        `No category with the id ${categoryId} was found`
      );
    }
    res.status(StatusCodes.OK).json({
      msg: "Category was successfully edited",
    });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: err.message });
  }
};

// DELETE CATEGORY
const deleteCategory = async (req, res) => {
  try {
    const {
      params: { id: categoryId },
    } = req;
    await Category.findByIdAndRemove({ _id: categoryId });
    res.status(StatusCodes.OK).json({
      message: "Category has been successfully removed from the list.",
    });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({
      msg: err.message,
    });
  }
};

module.exports = {
  createCategory,
  listCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
