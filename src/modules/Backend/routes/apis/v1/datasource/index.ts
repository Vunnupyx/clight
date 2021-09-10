import express from "express";

const router = express.Router();

router.get("/", async (request: any, response) => {
  return response.status(200).json({});
});

export default router;
