import express from "express";
import { patchReportContent } from "../controllers/reportController";
import { isAuthenticated } from "../middlewares/authMiddleware";

const reportRouter = express.Router();

reportRouter.patch("/patchReportContent", isAuthenticated, patchReportContent);

export default reportRouter;
