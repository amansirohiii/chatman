import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest){
    try {
        const body = await req.json();
        const {id: idToAdd}= z.object({ id: z.string() }).parse(body);
        const session = await getServerSession(authOptions);
        if(!session) return NextResponse.json({error: "Unauthorized"}, {status: 401});
        const isAlreadyFriends = await fetchRedis("sismember", `user:${session.user.id}:friends`, idToAdd);
        if(isAlreadyFriends) return NextResponse.json({error: "Already Friends"}, {status: 400});
        const hasFriendRequest = await fetchRedis("sismember", `user:${session.user.id}:incoming_friend_requests`, idToAdd);
        if(!hasFriendRequest) return NextResponse.json({error: "No Friend Request"}, {status: 400});



        const [userRaw, friendRaw] = (await Promise.all([
            fetchRedis('get', `user:${session.user.id}`),
            fetchRedis('get', `user:${idToAdd}`),
          ])) as [string, string]

          const user = JSON.parse(userRaw) as User
          const friend = JSON.parse(friendRaw) as User

          // notify added user

          await Promise.all([
            pusherServer.trigger(
              toPusherKey(`user:${idToAdd}:friends`),
              'new_friend',
              user
            ),
            pusherServer.trigger(
              toPusherKey(`user:${session.user.id}:friends`),
              'new_friend',
              friend
            ),
            fetchRedis("sadd", `user:${session.user.id}:friends`, idToAdd),
             fetchRedis("sadd", `user:${idToAdd}:friends`, session.user.id),
             fetchRedis("srem", `user:${session.user.id}:incoming_friend_requests`, idToAdd),
             fetchRedis("srem", `user:${idToAdd}:incoming_friend_requests`, session.user.id),
          ])







        return NextResponse.json({success: true});

    } catch (error: any) {
        if(error instanceof z.ZodError){
            return NextResponse.json({error: error.errors}, {status: 422});
        }
        return NextResponse.json({error: error.message}, {status: 400});

    }
}