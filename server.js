import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";

dotenv.config({ path: "config.env" });
import dbConnection from "./config/database.js";
import ApiError from "./utils/apiError.js";
import globalError from "./middlewares/errorMiddleware.js";

// Routes
import mountRoutes from "./routes/index.js";
import { webhookCheckout } from "./services/orderServices.js";

// Database
dbConnection();

// app express
const app = express();

// Enable other domains to access your application
app.use(cors());
app.options(cors());

// Compress all response
app.use(compression());

// Checkout webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout,
);

// Extended Query Parser
app.set("query parser", "extended");

// Midllewares
app.use(express.json({ limit: "20kb" }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// To apply data sanitization
app.use(mongoSanitize());
app.use(xss());

// Limit each IP to 100 requests per "windos" (here, per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minuts",
});

// Aplly the rate limiting middleware to all requests
app.use("/api", limiter);

// Middleware to protect against HTTP Parameter pollution attacks
app.use(
  hpp({
    whitelist: [
      "price",
      "sold",
      "quantity",
      "ratinsAverage",
      "ratingsQuantity",
    ],
  }),
);

// Mounts Route
mountRoutes(app);

app.all(/.*/, (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware
app.use(globalError);

const port = process.env.PORT || 8000;
app.get("/", (req, res) => res.send("Hello World!"));
const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);

// Handle rejections outside express
process.on("unhandledRejection", (err) => {
  console.log(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Shutting down.....");
    process.exit(1);
  });
});
