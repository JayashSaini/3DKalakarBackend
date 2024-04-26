const { body } = require("express-validator");
const { mongoIdRequestBodyValidator } = require("./mongodb.validators.js");

const createArticalValidator = () => {
  return [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("heading").trim().notEmpty().withMessage("Heading is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),

    ...mongoIdRequestBodyValidator("category"),
  ];
};

const updateArticalValidator = () => {
  return [
    body("title").optional().trim().notEmpty().withMessage("Title is required"),
    body("heading")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Heading is required"),
    body("description")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    ...mongoIdRequestBodyValidator("category"),
  ];
};

const addAndUpdateSubImagesValidator = () => {
  return [body("prompt").trim().notEmpty().withMessage("prompt is required")];
};
module.exports = {
  createArticalValidator,
  updateArticalValidator,
  addAndUpdateSubImagesValidator,
};
