const { Router } = require("express");
const router = Router();

const { validate } = require("../validators/validate.js");

const {
  categoryRequestBodyValidator,
} = require("../validators/category.validators.js");

const {
  createCategory,
  getCategoryById,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller.js");

const {
  mongoIdPathVariableValidator,
} = require("../validators/mongodb.validators.js");

router
  .route("/")
  .post(categoryRequestBodyValidator(), validate, createCategory)
  .get(getAllCategories);

router
  .route("/:categoryId")
  .get(mongoIdPathVariableValidator("categoryId"), validate, getCategoryById)
  .delete(mongoIdPathVariableValidator("categoryId"), validate, deleteCategory)
  .patch(
    categoryRequestBodyValidator(),
    mongoIdPathVariableValidator("categoryId"),
    validate,
    updateCategory
  );

module.exports = router;
