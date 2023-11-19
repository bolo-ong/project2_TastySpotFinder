import mongoose from "mongoose";
import { Request, Response } from "express";
import { crawlData } from "../utils/crawler";
import {
  Restaurant,
  RestaurantType,
  RestaurantList,
  RestaurantListType,
} from "../models";

export const postRestaurantList = async (req: Request, res: Response) => {
  try {
    const { title, description, crawlURL } = req.body;
    const id = new mongoose.Types.ObjectId(req.user?._id);

    const newRestaurantList: RestaurantListType = {
      title: title,
      description: description,
      crawlURL: crawlURL,
      like: 0,
      writer: id,
      comments: [],
    };

    const createdRestaurantList = await RestaurantList.create(
      newRestaurantList
    );
    const restaurantListId = createdRestaurantList._id;

    res.send(restaurantListId);
  } catch (err) {
    res.status(500);
  }
};

export const crawlRestaurant = async (req: Request, res: Response) => {
  try {
    const { crawlURL, restaurantListId } = req.body;
    const id = new mongoose.Types.ObjectId(restaurantListId);

    //크롤링을 통해 맛집 데이터 수집 후 Restaurant DB에 추가 또는 업데이트
    const restaurants: RestaurantType[] = await crawlData(crawlURL);
    if (restaurants) {
      const bulkOps = restaurants.map((restaurant) => ({
        updateOne: {
          filter: { name: restaurant.name },
          update: {
            $set: restaurant,
            $inc: { count: 1 },
            $push: { restaurantLists: id },
          },
          upsert: true,
        },
      }));

      await Restaurant.bulkWrite(bulkOps, { ordered: false });

      res.send("게시물 등록이 완료되었습니다.");
    } else {
      res.status(400);
    }
  } catch (err) {
    res.status(500);
  }
};

export const getRestaurant = async (req: Request, res: Response) => {};
