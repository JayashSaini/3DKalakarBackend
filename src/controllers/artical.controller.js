const { ApiResponse } = require("../utils/apiResponse.js");
const { ApiError } = require("../utils/apiError.js");
const { Artical } = require("../models/artical.model.js");
const { Category } = require("../models/category.model.js");
const {
  uploadOnCloudinary,
  deleteImageonCloudinary,
} = require("../utils/cloudinary.js");
const { getMongoosePaginationOptions } = require("../utils/helper.js");
const mongoose = require("mongoose");

const getAllArtical = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const articalAggregate = Artical.aggregate([{ $match: {} }]);

    const articals = await Artical.aggregatePaginate(
      articalAggregate,
      getMongoosePaginationOptions({
        page,
        limit,
        customLabels: {
          totalDocs: "totalArticals",
          docs: "articals",
        },
      })
    );

    return res
      .status(200)
      .json(new ApiResponse(200, articals, "Products fetched successfully"));
  } catch (error) {
    next(error);
  }
};

const createArtical = async (req, res, next) => {
  try {
    const { title, description, category, heading } = req.body;

    const categoryToBeAdded = await Category.findById(category);

    if (!categoryToBeAdded) {
      throw new ApiError(404, "Category does not exist");
    }

    // Check if user has uploaded a main image
    if (!req.files?.mainImage || !req.files?.mainImage.length) {
      throw new ApiError(400, "Main image is required");
    }

    const mainImageLocalPath = req.files?.mainImage[0]?.path;
    const mainImage = await uploadOnCloudinary(mainImageLocalPath);

    const artical = await Artical.create({
      title,
      description,
      heading,
      mainImage: {
        url: mainImage.url,
        public_id: mainImage.public_id,
      },
      category,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, artical, "Artical created successfully"));
  } catch (error) {
    next(error);
  }
};

const updateArtical = async (req, res, next) => {
  try {
    const { articalId } = req.params;
    const { title, description, category, heading } = req.body;

    const artical = await Artical.findById(articalId);

    // Check the artical existence
    if (!artical) {
      throw new ApiError(404, "Artical does not exist");
    }

    let mainImage;
    if (req.files?.mainImage?.length) {
      const mainImageLocalPath = req.files?.mainImage[0]?.path;
      mainImage = await uploadOnCloudinary(mainImageLocalPath);
    } else {
      mainImage = artical.mainImage;
    }

    const updatedArtical = await Artical.findByIdAndUpdate(
      articalId,
      {
        $set: {
          title,
          description,
          heading,
          category,
          mainImage,
        },
      },
      {
        new: true,
      }
    );

    // Once the artical is updated. Do some cleanup
    if (artical.mainImage.url !== mainImage.url) {
      // If user is uploading new main image remove the previous one because we don't need that anymore
      await deleteImageonCloudinary(artical.mainImage.public_id);
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedArtical, "Artical updated successfully")
      );
  } catch (error) {
    next(error);
  }
};

const getArticalById = async (req, res, next) => {
  try {
    const { articalId } = req.params;
    const artical = await Artical.findById(articalId);

    if (!artical) {
      throw new ApiError(404, "Artical does not exist");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, artical, "Artical fetched successfully"));
  } catch (error) {
    next(error);
  }
};

const getArticalByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const category = await Category.findById(categoryId).select("name _id");

    if (!category) {
      throw new ApiError(404, "Category does not exist");
    }

    const articalAggregate = Artical.aggregate([
      {
        // match the products with provided category
        $match: {
          category: new mongoose.Types.ObjectId(categoryId),
        },
      },
    ]);

    const artical = await Artical.aggregatePaginate(
      articalAggregate,
      getMongoosePaginationOptions({
        page,
        limit,
        customLabels: {
          totalDocs: "totalArticals",
          docs: "articals",
        },
      })
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { ...artical, category },
          "Category artical fetched successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

const removeArticalSubImage = async (req, res, next) => {
  try {
    const { articalId, subImageId } = req.params;

    const artical = await Artical.findById(articalId);

    // check for artical existence
    if (!artical) {
      throw new ApiError(404, "Artical does not exist");
    }

    const updatedArtical = await Artical.findByIdAndUpdate(
      articalId,
      {
        $pull: {
          // pull an item from subImages with _id equals to subImageId
          subImages: {
            _id: new mongoose.Types.ObjectId(subImageId),
          },
        },
      },
      { new: true }
    );

    // retrieve the file object which is being removed
    const removedSubImage = artical.subImages?.find((image) => {
      return image._id.toString() === subImageId;
    });

    if (removedSubImage) {
      await deleteImageonCloudinary(removedSubImage.public_id);
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedArtical, "Sub image removed successfully")
      );
  } catch (error) {
    next(error);
  }
};

const addAndUpdateSubImages = async (req, res, next) => {
  try {
    const { articalId } = req.params;
    const { prompt } = req.body;

    const subImageLocalPath = req.files?.subImage[0]?.path;
    const subImage = await uploadOnCloudinary(subImageLocalPath);

    const updatedArtical = await Artical.findByIdAndUpdate(
      articalId,
      {
        $push: {
          subImages: {
            url: subImage.url,
            public_id: subImage.public_id,
            prompt,
          },
        },
      },
      {
        new: true,
      }
    );
    const artical = await Artical.findById(articalId);
    return res
      .status(200)
      .json(new ApiResponse(200, artical, "Sub images add successfully"));
  } catch (error) {
    next(error);
  }
};

const deleteArtical = async (req, res, next) => {
  try {
    const { articalId } = req.params;

    const artical = await Artical.findOneAndDelete({
      _id: articalId,
    });

    if (!artical) {
      throw new ApiError(404, "Artical does not exist");
    }

    const articalImages = [artical.mainImage, ...artical.subImages];

    articalImages.forEach(async (image) => {
      await deleteImageonCloudinary(image.public_id);
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { deleteArtical: artical },
          "Artical deleted successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllArtical,
  createArtical,
  updateArtical,
  getArticalById,
  deleteArtical,
  removeArticalSubImage,
  getArticalByCategory,
  addAndUpdateSubImages,
};
