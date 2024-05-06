import { fetchRedis } from "./redis";

export const getFriendsByUserId = async (userId: string) => {
  const friendsId = (await fetchRedis("smembers",`user:${userId}:friends`) as string[]);
  const friends  = (await Promise.all(friendsId.map(async (friend)=>{
    return JSON.parse(await fetchRedis("get",`user:${friend}`)) as User
  }
  )));
  return friends;
}
