import express from "express";
import { postRestaurant } from "../controllers/restaurantController";

const restaurantRouter = express.Router();

restaurantRouter.post("/", postRestaurant);

export default restaurantRouter;
