import mongoose, { PipelineStage } from "mongoose";
import { Request, Response } from "express";
import { crawlData, geocodeAddress } from "../utils";
import {
  User,
  Restaurant,
  RestaurantType,
  RestaurantList,
  RestaurantListType,
} from "../models";
import { shouldBlindComment } from "../utils";

export const deleteRestaurantList = async (req: Request, res: Response) => {
  const restaurantListId = req.body.restaurantListId;
  const userId = new mongoose.Types.ObjectId(req.user?._id);
  const userRole = req.user?.role;

  try {
    const existingRestaurantList = await RestaurantList.findById(
      restaurantListId
    ).populate("restaurants");

    if (!existingRestaurantList) {
      return res
        .status(404)
        .json({ message: "해당 식당 리스트를 찾을 수 없습니다." });
    }

    const isOwner = existingRestaurantList.writer.equals(userId);
    const canDeleteUser = userRole === "admin" || userRole === "moderator";

    if (!isOwner && !canDeleteUser) {
      return res.status(403).json({ message: "삭제할 권한이 없습니다." });
    }

    await User.findByIdAndUpdate(existingRestaurantList.writer, {
      $inc: {
        recommendedRestaurantListsCount: -1,
        recommendedRestaurantsCount: -(
          existingRestaurantList.restaurants?.length || 0
        ),
      },
    });

    await existingRestaurantList.deleteOne();
    res.status(200).json({ message: "성공적으로 삭제되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

export const postRestaurantList = async (req: Request, res: Response) => {
  try {
    const { link, title, description } = req.body;
    const userId = new mongoose.Types.ObjectId(req.user?._id);
    const [isTitleBlinded, isDescriptionBlinded] = await Promise.all([
      shouldBlindComment(title),
      shouldBlindComment(description),
    ]);
    const isBlinded = isTitleBlinded || isDescriptionBlinded;

    if (isBlinded) {
      return res.status(403).send("불쾌한 표현으로 인해 등록되지 않았습니다.");
    }

    const newRestaurantList: RestaurantListType = {
      title: title,
      description: description,
      crawlURL: link,
      like: 0,
      writer: userId,
    };

    const createdRestaurantList = await RestaurantList.create(
      newRestaurantList
    );

    // 유저의 추천 리스트 개수 증가
    await User.findByIdAndUpdate(userId, {
      $inc: { recommendedRestaurantListsCount: 1 },
    });

    res.send(createdRestaurantList._id);
  } catch (err) {
    res.status(500);
  }
};

export const crawlRestaurant = async (req: Request, res: Response) => {
  try {
    const { crawlURL, restaurantListId } = req.body;
    const id = mongoose.Types.ObjectId.createFromHexString(restaurantListId);
    const restaurants: RestaurantType[] = await crawlData(crawlURL);

    if (restaurants && restaurants.length > 0) {
      // 중복 처리할 방법을 미리 정의
      const bulkOps = await Promise.all(
        restaurants.map(async (restaurant) => {
          try {
            // 주소를 지오코딩하여 위도와 경도 구하기
            const [longitude, latitude] = await geocodeAddress(
              restaurant.location
            );

            // name과 location이 중복되지 않는지 확인
            const existingRestaurant = await Restaurant.findOne({
              name: restaurant.name,
              location: restaurant.location,
            });

            if (existingRestaurant) {
              // 중복된 레스토랑이 존재하면 update만 실행
              return {
                updateOne: {
                  filter: {
                    _id: existingRestaurant._id, // 기존 레스토랑을 업데이트
                  },
                  update: {
                    $set: {
                      ...restaurant,
                      locationCoordinates: {
                        type: "Point" as "Point",
                        coordinates: [longitude, latitude] as [number, number],
                      },
                    },
                    $inc: { count: 1 },
                  },
                },
              };
            } else {
              // 중복되지 않으면 새로운 레스토랑을 추가
              return {
                updateOne: {
                  filter: {
                    name: restaurant.name,
                    location: restaurant.location,
                  },
                  update: {
                    $set: {
                      ...restaurant,
                      locationCoordinates: {
                        type: "Point" as "Point",
                        coordinates: [longitude, latitude] as [number, number],
                      },
                    },
                    $inc: { count: 1 },
                  },
                  upsert: true, // 중복이 없으면 삽입
                },
              };
            }
          } catch (error) {
            console.error(
              `Failed to geocode address for ${restaurant.name}:`,
              error
            );
            return {
              updateOne: {
                filter: {
                  name: restaurant.name,
                  location: restaurant.location,
                },
                update: {
                  $set: {
                    ...restaurant,
                  },
                  $inc: { count: 1 },
                },
                upsert: true,
              },
            };
          }
        })
      );

      // bulkWrite 실행
      const bulkWriteResult = await Restaurant.bulkWrite(bulkOps, {
        ordered: false,
      });

      // 업데이트된 식당들의 _id를 가져오기
      const updatedRestaurants = await Restaurant.find({
        name: { $in: restaurants.map((restaurant) => restaurant.name) },
        location: { $in: restaurants.map((restaurant) => restaurant.location) },
      });

      const restaurantIds = updatedRestaurants.map(
        (restaurant) => restaurant._id
      );

      // RestaurantList 업데이트
      if (id !== null) {
        const restaurantList = await RestaurantList.findById(id);
        if (restaurantList) {
          // 식당 리스트의 작성자 ID 가져오기
          const writerId = restaurantList.writer;

          await Promise.all([
            // RestaurantList 업데이트
            RestaurantList.updateOne(
              { _id: id },
              {
                $set: {
                  restaurants: restaurantIds,
                  thumbnail: updatedRestaurants
                    .map((restaurant) => restaurant.img[0])
                    .filter((thumbnail) => thumbnail !== null)
                    .filter(Boolean)
                    .slice(0, 4),
                },
              }
            ),
            // 작성자의 추천 식당 수 업데이트
            User.findByIdAndUpdate(writerId, {
              $inc: { recommendedRestaurantsCount: restaurants.length },
            }),
          ]);
        }
      }

      res.send("게시물 등록이 완료되었습니다.");
    } else {
      res.status(400).send("맛집 데이터를 가져오지 못했습니다.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 오류");
  }
};

export const getInfinityScrollRestaurants = async (
  req: Request,
  res: Response
) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = page === 1 ? 8 : 4;
  const skipCount = page === 1 ? 0 : 4;
  const sortType = req.query.sortType as string;
  const type = req.query.type as "restaurant" | "restaurantList";
  const longitude = req.query.longitude
    ? parseFloat(req.query.longitude as string)
    : null;
  const latitude = req.query.latitude
    ? parseFloat(req.query.latitude as string)
    : null;
  const searchTerm = req.query.searchTerm as string;

  try {
    let sortAggregate: PipelineStage[] = [];

    switch (sortType) {
      case "최신순":
      default:
        sortAggregate = [{ $sort: { updatedAt: -1, _id: 1 } }];
        break;
      case "찜 많은순":
        sortAggregate = [{ $sort: { like: -1, _id: 1 } }];
        break;
      case "추천 많은순":
        sortAggregate = [{ $sort: { count: -1, _id: 1 } }];
        break;
      case "리뷰 많은순":
        sortAggregate = [{ $sort: { reviewCount: -1, _id: 1 } }];
        break;
      case "가까운순":
        if (longitude === null || latitude === null) {
          return res.status(400).json({ message: "위치 정보가 필요합니다." });
        }
        sortAggregate = [
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [longitude, latitude],
              },
              distanceField: "distance",
              spherical: true,
              key: "locationCoordinates",
            },
          },
          {
            $addFields: {
              distance: {
                $concat: [
                  {
                    $toString: {
                      $round: [{ $divide: ["$distance", 1000] }, 2],
                    },
                  },
                  " km",
                ],
              },
            },
          },
        ];
        break;
    }

    let matchAggregate: PipelineStage[] = [];

    if (searchTerm) {
      const escapeRegExp = (string: string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      };

      const safeSearchTerm = escapeRegExp(searchTerm);
      const searchRegex = new RegExp(safeSearchTerm, "i"); // 대소문자 구분 없이 검색
      if (type === "restaurant") {
        matchAggregate = [
          {
            $match: {
              $or: [
                { name: { $regex: searchRegex } },
                { category: { $regex: searchRegex } },
                { location: { $regex: searchRegex } },
                { menu: { $regex: searchRegex } },
              ],
            },
          },
        ];
      } else if (type === "restaurantList") {
        matchAggregate = [
          {
            $match: {
              $or: [
                { title: { $regex: searchRegex } },
                { description: { $regex: searchRegex } },
              ],
            },
          },
        ];
      }
    }

    let entities;
    if (type === "restaurant") {
      entities = await Restaurant.aggregate([
        ...sortAggregate,
        ...matchAggregate,
        { $skip: (page - 1) * pageSize + skipCount },
        { $limit: pageSize },
      ]);
    } else if (type === "restaurantList") {
      entities = await RestaurantList.aggregate([
        ...sortAggregate,
        ...matchAggregate,
        { $skip: (page - 1) * pageSize + skipCount },
        { $limit: pageSize },
      ]);
    } else {
      return res.status(400).json({ message: "유효하지 않은 타입입니다." });
    }

    res.status(200).json(entities);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};

export const getInfinityScrollSavedRestaurants = async (
  req: Request,
  res: Response
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = page === 1 ? 8 : 4;
    const skipCount = page === 1 ? 0 : 4;
    const type = req.query.type as "restaurant" | "restaurantList";
    const userId = new mongoose.Types.ObjectId(req.user?._id);

    // 타입에 따라 populate할 경로 설정
    const populatePath =
      type === "restaurant" ? "savedRestaurants" : "savedRestaurantLists";

    // 유저 정보에서 저장된 맛집 리스트 가져오기
    const user = await User.findById(userId).populate({
      path: populatePath,
    });

    if (!user || !user[populatePath]) {
      return res.status(404).json({ message: "저장된 맛집이 없어요" });
    }

    // 저장된 리스트 가져오기
    let savedEntities = user[populatePath];

    // 식당 목록을 페이지네이션 처리
    const paginatedEntities = savedEntities.slice(
      (page - 1) * pageSize + skipCount,
      (page - 1) * pageSize + skipCount + pageSize
    );

    res.status(200).json(paginatedEntities);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};

export const getInfinityScrollMyRecommended = async (
  req: Request,
  res: Response
) => {
  const userId = new mongoose.Types.ObjectId(req.user?._id);
  const page = parseInt(req.query.page as string, 10) || 1;
  const pageSize = page === 1 ? 8 : 4;
  const skipCount = (page - 1) * pageSize;

  try {
    // 해당 사용자가 작성한 리스트 게시글 가져오기
    const restaurantLists = await RestaurantList.find({ writer: userId })
      .skip(skipCount)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    res.status(200).json(restaurantLists);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};

export const getRestaurant = async (req: Request, res: Response) => {
  try {
    const { id, type } = req.query;

    let entity;
    if (type === "restaurant") {
      entity = await Restaurant.findOne({ _id: id });
    } else if (type === "restaurantList") {
      entity = await RestaurantList.findOne({ _id: id }).populate([
        { path: "restaurants" },
        { path: "writer" },
      ]);
    } else {
      return res.status(400).json({ message: "유효하지 않은 타입입니다." });
    }

    if (!entity) {
      return res
        .status(404)
        .json({ message: "해당 데이터를 찾을 수 없습니다." });
    }

    res.status(200).json(entity);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};

export const getNearbyRestaurants = async (req: Request, res: Response) => {
  const { longitude, latitude, maxDistance } = req.query;

  if (!longitude || !latitude || !maxDistance) {
    return res.status(400).json({ message: "위치 정보가 필요합니다." });
  }

  const parsedLongitude = parseFloat(longitude as string);
  const parsedLatitude = parseFloat(latitude as string);
  const parsedMaxDistance = parseFloat(maxDistance as string);

  try {
    const restaurants = await Restaurant.find({
      locationCoordinates: {
        $geoWithin: {
          $centerSphere: [
            [parsedLongitude, parsedLatitude],
            parsedMaxDistance / 6378.1,
          ],
        },
      },
    });

    res.status(200).json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};

export const patchRestaurantList = async (req: Request, res: Response) => {
  const { restaurantListId, title, description } = req.body;
  const userId = new mongoose.Types.ObjectId(req.user?._id);

  try {
    const restaurantList = await RestaurantList.findById(restaurantListId);

    if (!restaurantList) {
      return res.status(404).json({ message: "리스트를 찾을 수 없습니다." });
    }

    if (!restaurantList.writer.equals(userId)) {
      return res.status(403).json({ message: "수정 권한이 없습니다." });
    }

    const [isTitleBlinded, isDescriptionBlinded] = await Promise.all([
      shouldBlindComment(title),
      shouldBlindComment(description),
    ]);

    if (isTitleBlinded || isDescriptionBlinded) {
      return res.status(403).send("불쾌한 표현이 포함되어 있습니다.");
    }

    await RestaurantList.findByIdAndUpdate(restaurantListId, {
      title,
      description,
    });

    res.status(200).json({ message: "수정이 완료되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
