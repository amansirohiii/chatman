import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

import { fetchRedis } from "@/helpers/redis";
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import Sidebar, { sidebarOptions } from "@/components/Sidebar";
import MobileChatLayout from "@/components/MobileChatLayout";

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
      <div className="md:hidden">
        <MobileChatLayout
          friends={friends}
          session={session}
          sidebarOptions={sidebarOptions}
          unseenRequestCount={unseenRequestCount}
        />
      </div>
      <Sidebar session={session} friends={friends} unseenRequestCount={unseenRequestCount}/>
      <aside className='max-h-[calc(100vh-10rem)] md:max-h-screen container pt-16 overscroll-none md:py-12 w-full'>
        {children}
      </aside>
    </div>
  );
};
export default Layout;
