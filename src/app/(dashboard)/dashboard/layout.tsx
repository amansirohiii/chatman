import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { FC, ReactNode } from "react";
import { Icon, Icons } from "@/components/ui/Icons";
import SignOutButton from "@/components/SignOutButton";
import FriendRequestsSidebarOptions from "@/components/FriendRequestsSidebarOptions";
import { fetchRedis } from "@/helpers/redis";
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import SidebarChatList from "@/components/SidebarChatList";
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
