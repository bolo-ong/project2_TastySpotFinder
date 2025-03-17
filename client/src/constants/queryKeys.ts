export const restaurantKeys = {
  all: ["restaurant"] as const,
  details: () => [...restaurantKeys.all, "detail"] as const,
  detail: (restaurantId: string) =>
    [...restaurantKeys.details(), restaurantId] as const,
  lists: () => [...restaurantKeys.all, "list"] as const,
  list: (sortType: string, search: string) =>
    [...restaurantKeys.lists(), { sortType }, { search }] as const,
  savedRestaurants: () => [...restaurantKeys.all, "savedRestaurants"] as const,
};

export const restaurantListKeys = {
  all: ["restaurantList"] as const,
  details: () => [...restaurantListKeys.all, "detail"] as const,
  detail: (restaurantListId: string) =>
    [...restaurantListKeys.details(), restaurantListId] as const,
  lists: () => [...restaurantListKeys.all, "list"] as const,
  list: (sortType: string, search: string) =>
    [...restaurantListKeys.lists(), { sortType }, { search }] as const,
  savedRestaurantLists: () =>
    [...restaurantKeys.all, "savedRestaurantLists"] as const,
};

export const restaurantReviewKeys = {
  all: ["restaurantReview"] as const,
  lists: (restaurantId: string, userId?: string) =>
    [
      ...restaurantReviewKeys.all,
      "list",
      { restaurantId },
      { userId },
    ] as const,
  list: (restaurantId: string, userId?: string, sortType?: string) =>
    [
      ...restaurantReviewKeys.lists(restaurantId, userId),
      { sortType },
    ] as const,
};

export const restaurantListReviewKeys = {
  all: ["restaurantListReview"] as const,
  lists: (restaurantId: string, userId?: string) =>
    [
      ...restaurantListReviewKeys.all,
      "list",
      { restaurantId },
      { userId },
    ] as const,
  list: (restaurantId: string, userId?: string, sortType?: string) =>
    [
      ...restaurantListReviewKeys.lists(restaurantId, userId),
      { sortType },
    ] as const,
};
