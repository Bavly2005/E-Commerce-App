import categoryRoute from "./categoryRoutes.js";
import subCategoryRoute from "./subCategoryRoutes.js";
import brandRoute from "./brandRoutes.js";
import productRoute from "./productRoutes.js";
import userRoute from "./userRoutes.js";
import authRoute from "./authRoutes.js";
import reviewRoute from "./reviewRoutes.js";
import wishlistRoute from "./wishlistRoutes.js";
import addressRoute from "./addressRoutes.js";
import couponRoute from "./couponRoutes.js";
import cartRoute from "./cartRoutes.js";
import orderRoute from "./orderRoutes.js";

const mountRoutes = (app) => {
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/subcategories", subCategoryRoute);
  app.use("/api/v1/brands", brandRoute);
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/reviews", reviewRoute);
  app.use("/api/v1/wishlist", wishlistRoute);
  app.use("/api/v1/addresses", addressRoute);
  app.use("/api/v1/coupons", couponRoute);
  app.use("/api/v1/cart", cartRoute);
  app.use("/api/v1/order", orderRoute);
};

export default mountRoutes;
