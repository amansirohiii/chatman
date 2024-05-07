import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

import { fetchRedis } from "@/helpers/redis";
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import Sidebar from "@/components/Sidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const friends = await getFriendsByUserId(session.user.id);
  const unseenRequestCount = (
    (await fetchRedis(
      "smembers",
      `user:${session.user.id}:incoming_friend_requests`
    )) as User[]
  ).length;
  return (
    <div className="w-full flex h-screen">
      <Sidebar session={session} friends={friends} unseenRequestCount={unseenRequestCount}/>
      {children}
    </div>
  );
};
export default Layout;
