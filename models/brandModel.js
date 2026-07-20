import { model, Schema } from "mongoose";

const brandSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, "Brand required"],
      unique: [true, "Brand must be unique"],
      minlength: [3, "Too short brand name"],
      maxlength: [32, "Too long b rand name"],
    },
    slug: { type: String, lowercase: true },
    image: String,
  },
  { timestamps: true },
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

// findOne, findAll and update
brandSchema.post("init", (doc) => {
  setImageURL(doc);
});

// create
brandSchema.post("save", (doc) => {
  setImageURL(doc);
});

// Model
const Brand = model("Brand", brandSchema);

export default Brand;
