import { fetchRedis } from "./redis";

export const getFriendsByUserId = async (userId: string) => {
  // fetch friends for current user
  console.log("userid", userId);
  const friendIds = (await fetchRedis(
    "smembers",
    `user:${userId}:friends`
  )) as string[];
  console.log("friend ids", friendIds);

  //   promise.all calls all the promises at thee same time
  const friends = await Promise.all(
    friendIds.map(async (friendId) => {
      const friend = (await fetchRedis("get", `user:${friendId}`)) as string;
      const parsedFriend = JSON.parse(friend) as User;
      return parsedFriend;
    })
  );

  return friends;
};
