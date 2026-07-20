import multer from "multer";
import ApiError from "../utils/apiError.js";

const multerOptions = () => {
  // 1-DiskStorge engine
  // const multerStorge = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "uploads/categories");
  //   },
  //   filename: function (req, file, cb) {
  //     const ext = file.mimetype.split("/")[1];
  //     const fileName = `category-${uuidv4()}-${Date.now()}.${ext}`;
  //     cb(null, fileName);
  //   },
  // });

  // 2-MemoryStorge engine
  const multerStorge = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images allowed", 400), false);
    }
  };

  const upload = multer({ storage: multerStorge, fileFilter: multerFilter });
  return upload;
};

export const uploadSingleImage = (fieldName) =>
  multerOptions().single(fieldName);

export const uploadMixOfImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
