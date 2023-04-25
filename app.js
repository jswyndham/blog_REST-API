require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss");
const rateLimit = require("express-rate-limit");

const connectDB = require("./db/connect");
const authRouter = require("./routes/auth");
const blogsRouter = require("./routes/blogs");
const categoriesRouter = require("./routes/categories");
const tagsRouter = require("./routes/tags");

const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authUser = require("./middleware/authentication");
const corsMiddleware = require("./middleware/cors-middleware");

const app = express();
const port = 5000;

// OPTIONS
const corsOptions = {
  allowedHeaders: ["Content-Type", "Authorization"],
};
const html = xss('<script>alert("xss");</script>');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// MIDDLEWARE
app.use(limiter);
app.use(express.json());
app.use(
  cors(corsOptions, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(helmet());

app.use(corsMiddleware);
app.use(errorHandlerMiddleware);
app.use(notFound);

// ROUTES
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/blogs", authUser, blogsRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/tags", tagsRouter);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI, console.log("Connected to DB..."));

    app.listen(port, console.log(`Listening on port ${port}...`));
  } catch (err) {
    console.log({ msg: err.message });
    console.log(html);
  }
};

start();
