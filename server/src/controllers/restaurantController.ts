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
          },
          upsert: true,
        },
      }));

      await Restaurant.bulkWrite(bulkOps, { ordered: false });

      //RestaurantList에 썸네일과, 크롤링한 식당들의 _id를 저장
      const restaurantIds = restaurants.map(
        (restaurant) => new mongoose.Types.ObjectId(restaurant._id)
      );

      id !== null &&
        (await RestaurantList.updateOne(
          { _id: id },
          {
            $set: {
              restaurants: restaurantIds,
              thumbnail: restaurants
                .map((restaurant) => restaurant.img[0])
                .filter((thumbnail) => thumbnail !== null),
            },
          }
        ));

      res.send("게시물 등록이 완료되었습니다.");
    } else {
      res.status(400);
    }
  } catch (err) {
    res.status(500);
  }
};

export const getRestaurantList = async (req: Request, res: Response) => {
  //처음에 8개의 데이터를 보내주고, 이후 4개씩 보내줌
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = page === 1 ? 8 : 4;
  const skipCount = page === 1 ? 0 : 4;

  try {
    const restaurantList = await RestaurantList.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize + skipCount)
      .limit(pageSize)
      .exec();

    res.status(200).json(restaurantList);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getRestaurant = async (req: Request, res: Response) => {
  //처음에 8개의 데이터를 보내주고, 이후 4개씩 보내줌
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = page === 1 ? 8 : 4;
  const skipCount = page === 1 ? 0 : 4;

  try {
    const restaurant = await Restaurant.find()

      .skip((page - 1) * pageSize + skipCount)
      .limit(pageSize)
      .exec();

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
