import express from "express";
import cors from "cors";
import "dotenv/config";

import routes from "./routes/book.routes.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/books", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
