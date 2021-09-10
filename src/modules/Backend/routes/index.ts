import express from "express";
import swaggerUi from "swagger-ui-express";
import apiRoute from "./apis";

const swaggerDocument = require("./swagger.json");

const app = express();

app.use(express.json());

app.use("/", apiRoute);

const options = {};

app.use(
  "/apidocs",
  swaggerUi.serveFiles(swaggerDocument, options),
  swaggerUi.setup(swaggerDocument)
);

export default app;
