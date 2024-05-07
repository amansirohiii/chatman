import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email: emailToAdd } = addFriendValidator.parse(body.data.email);
    const RESTResponse = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/get/user:email:${emailToAdd}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        },
        cache: "no-store",
      }
    );
    const data = (await RESTResponse.json()) as { result: string };
    const idToAdd = data.result;
    if (!idToAdd) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session.user.id === idToAdd) {
      return NextResponse.json(
        { message: "You can't add yourself as a friend" },
        { status: 400 }
      );
    }
    const isAlreadyAdded = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1;
    if (isAlreadyAdded) {
      return NextResponse.json(
        { message: "Friend request already sent" },
        { status: 400 }
      );
    }
    const isAlreadyFriends = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:friends`,
      session.user.id
    )) as 0 | 1;
    if (isAlreadyFriends) {
      return NextResponse.json(
        { message: "Already friends" },
        { status: 400 }
      );
    }
pusherServer.trigger(toPusherKey(`user:${idToAdd}:incoming_friend_requests`), "incoming_friend_requests", {senderId: session.user.id,
  senderEmail: session.user.email,
})

db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);
    return NextResponse.json({ message: "Friend Added!" }, { status: 200 });
  } catch (err) {
    if(err instanceof z.ZodError) {
      return NextResponse.json({ message: err.errors }, { status: 422 });
    }
    return NextResponse.json({ message: err }, { status: 400 });
  }
}
