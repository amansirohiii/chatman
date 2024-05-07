import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from 'nanoid'
import { Message, messageValidator } from "@/lib/validations/message";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function POST(req: NextRequest){
  try {
    const {text, chatId}: {text: string, chatId: string} = await req.json();
    const session = await getServerSession(authOptions);
    if(!session) return NextResponse.json({message: "Unauthorized"}, {status: 401});
    const [userId1, userId2] = chatId.split("--");
    if(session.user.id !== userId1 && session.user.id !== userId2) return NextResponse.json({message: "Unauthorized"}, {status: 401});
    const friendId = session.user.id === userId1 ? userId2 : userId1;
    const friendList = (await fetchRedis("smembers", `user:${session.user.id}:friends`)) as string[];
    if(!friendList.includes(friendId)) return NextResponse.json({message: "Unauthorized"}, {status: 401});
   const rawSender = await fetchRedis("get", `user:${session.user.id}`);
    const sender = JSON.parse(rawSender);
    const timestamp = Date.now();
    const messageData: Message = {
      id: nanoid(),
      senderId: session.user.id,
      text,
      timestamp
    }
    const message = messageValidator.parse(messageData);


    pusherServer.trigger(toPusherKey(`chat:${chatId}`), "incoming_message", message)
    await pusherServer.trigger(toPusherKey(`user:${friendId}:chats`), 'new_message', {
      ...message,
      senderImg: sender.image,
      senderName: sender.name
    })


    await db.zadd(`chat:${chatId}:messages`, {score: timestamp, member: JSON.stringify(message)});
    return NextResponse.json({message: "Message sent"});
  } catch (error) {
    if(error instanceof Error) return NextResponse.json({message: error.message}, {status: 500});
    return NextResponse.json({message: "Internal server error"}, {status: 500});
  }
}