require("dotenv").config();
const mongoose = require("mongoose");
const { Schema } = mongoose;
const slugify = require("slugify");
const textTrim = require("../helpers/blog");
const striptags = require("striptags");

const BlogSchema = Schema(
  {
    title: {
      type: String,
      trim: true,
      min: 3,
      max: 160,
      required: true,
    },
    slug: {
      type: {},
      required: true,
      index: true,
      unique: true,
    },
    article: {
      type: {},
      required: true,
      min: 200,
      max: 2000000,
    },
    excerpt: {
      type: String,
      max: 1000,
    },
    meta_title: {
      type: String,
    },
    meta_description: {
      type: {},
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    categories: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    tags: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Tag",
        required: true,
      },
    ],
    postedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

BlogSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
    this.meta_title = `${this.title} | ${process.env.APP_NAME}`;
  }

  if (this.article) {
    this.excerpt = textTrim(this.article, 320);
    this.meta_description = striptags(this.article.substring(0, 160));
  }
  next();
});

module.exports = mongoose.model("Blog", BlogSchema);
