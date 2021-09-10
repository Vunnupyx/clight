import express from "express";
import datasourceApiController from "./datasource";

const router = express.Router();
router.use("/datasource", datasourceApiController);

export default router;
