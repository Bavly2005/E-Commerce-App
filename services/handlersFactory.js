import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import ApiFeatures from "../utils/apiFeatures.js";

export const deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    document.remove();
    res.status(204).json();
  });

export const updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(
        new ApiError(`No document for this id: ${req.params.id}`, 404),
      );
    }
    document.save();
    res.status(200).json({ data: document });
  });

export const createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({ data: newDoc });
  });

export const getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    // 1) Bulid query
    let query = Model.findById(req.params.id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }
    // 1) Execute query
    const document = await query;
    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404),
      );
    }
    res.status(200).json({ data: document });
  });

export const getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.filterObject) {
      filter = req.filterObject;
    }
    // Bulid query
    const documentsCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .search(modelName)
      .paginate(documentsCounts);

    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res.status(200).json({
      results: documents.length,
      paginationResult,
      data: documents,
    });
  });
