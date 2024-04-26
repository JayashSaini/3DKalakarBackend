const { Router } = require("express");
const router = Router();
const {
  createArticalValidator,
  updateArticalValidator,
  addAndUpdateSubImagesValidator,
} = require("../validators/artical.validators.js");
const { upload } = require("../middlewares/multer.middleware.js");
const { validate } = require("../validators/validate.js");
const {
  compressImages,
} = require("../middlewares/image-compress.middleware.js");
const {
  mongoIdPathVariableValidator,
} = require("../validators/mongodb.validators.js");
const {
  getAllArtical,
  createArtical,
  updateArtical,
  getArticalById,
  deleteArtical,
  removeArticalSubImage,
  getArticalByCategory,
  addAndUpdateSubImages,
} = require("../controllers/artical.controller.js");

router
  .route("/")
  .get(getAllArtical)
  .post(
    upload.fields([
      {
        name: "mainImage",
        maxCount: 1,
      },
    ]),
    createArticalValidator(),
    validate,
    compressImages,
    createArtical
  );

router
  .route("/:articalId")
  .get(mongoIdPathVariableValidator("articalId"), validate, getArticalById)
  .patch(
    upload.fields([
      {
        name: "mainImage",
        maxCount: 1,
      },
    ]),
    mongoIdPathVariableValidator("articalId"),
    updateArticalValidator(),
    validate,
    updateArtical
  )
  .delete(mongoIdPathVariableValidator("articalId"), validate, deleteArtical);

router
  .route("/category/:categoryId")
  .get(
    mongoIdPathVariableValidator("categoryId"),
    validate,
    getArticalByCategory
  );

router
  .route("/remove/subimage/:articalId/:subImageId")
  .patch(
    mongoIdPathVariableValidator("articalId"),
    mongoIdPathVariableValidator("subImageId"),
    validate,
    removeArticalSubImage
  );

// Sub Images routes
router.route("/subimage/:articalId").patch(
  upload.fields([
    {
      name: "subImage",
      maxCount: 1,
    },
  ]),
  addAndUpdateSubImagesValidator(),
  validate,
  addAndUpdateSubImages
);

module.exports = router;
