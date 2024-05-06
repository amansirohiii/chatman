import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const {id: idToAdd}= z.object({ id: z.string() }).parse(body);
    await fetchRedis("srem", `user:${session.user.id}:incoming_friend_requests`, idToAdd);
    return NextResponse.json({ message: "Friend request denied" }, { status: 200 });

} catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 422 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
}
}
