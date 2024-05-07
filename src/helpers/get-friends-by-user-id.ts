import { fetchRedis } from "./redis";

export const getFriendsByUserId = async (userId: string) => {
  const friendsId = (await fetchRedis("smembers",`user:${userId}:friends`) as string[]);
  const friends  = (await Promise.all(friendsId.map(async (friendId)=>{
    return JSON.parse(await fetchRedis("get",`user:${friendId}`)) as User
  }
  )));
  return friends;
}
