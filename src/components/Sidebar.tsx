"use client"
import Image from "next/image";
import React, { useEffect, useState } from 'react'
import FriendRequestsSidebarOptions from "./FriendRequestsSidebarOptions";
import Link from "next/link";
import SidebarChatList from "./SidebarChatList";

import SignOutButton from "@/components/SignOutButton";
import { Icon, Icons } from "@/components/ui/Icons";


interface SidebarProps{
  session: any
  friends: User[]
  unseenRequestCount: number
}


interface SidebarOptions {
  id: number;
  name: string;
  href: string;
  Icon: Icon;
}
export const sidebarOptions: SidebarOptions[] = [
  {
    id: 1,
    name: "Dashboard",
    href: "/dashboard",
    Icon: "LayoutDashboard",
  },
  {
    id: 2,
    name: "Add Friends",
    href: "/dashboard/add",
    Icon: "UserPlus",
  },
  {
    id: 3,
    name: "Friends",
    href: "/dashboard",
    Icon: "BookUser",
  },
  {
    id: 4,
    name: "Chats",
    href: "/dashboard",
    Icon: "MessagesSquare",
  },
  {
    id: 5,
    name: "Settings",
    href: "/dashboard",
    Icon: "Settings",
  },
];

const Sidebar = ({session, friends, unseenRequestCount}: SidebarProps ) => {

return (
    <div className="hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 ">
      <Link
        href="/dashboard"
        className="flex h-16 shrink-0 items-center mr-0 mx-auto"
      >
        <Image src="/chatman.svg" width={60} height={60} alt="logo" />
      </Link>
      {friends.length > 0 ? (
        <div className="text-sm font-semibold leading-6 text-gray-400">
          Your Chats
        </div>
      ) : null}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <SidebarChatList friends={friends} sessionId={session.user.id} />
          </li>
          <li>
            <div className="text-xs font-semibold leading-6 text-gray-400">
              Overview
            </div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              {sidebarOptions.map((option) => {
                const Icon = Icons[option.Icon];
                return (
                  <li key={option.id}>
                    <Link
                      href={option.href}
                      className="text-gray-700 hover:text-indigo-600 bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                    >
                      <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="truncate">{option.name}</span>
                    </Link>
                  </li>
                );
              })}
              <li>
                <FriendRequestsSidebarOptions
                  sessionId={session.user.id}
                  initialUnseenRequestCount={unseenRequestCount}
                />
              </li>
            </ul>
          </li>

          <li className="-mx-6 mt-auto flex items-center">
            <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
              <div className="relative h-9 w-8 bg-gray-50">
                <Image
                  src={session.user.image || ""}
                  alt="profile"
                  fill
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                />
              </div>
              <span className="sr-only">Your Profile</span>
              <div className="flex flex-col">
                <span aria-hidden="true">{session.user.name}</span>
                <span
                  className="text-xs text-zinc-400 truncate w-36"
                  aria-hidden="true"
                >
                  {session.user.email}
                </span>
              </div>
            </div>
            <SignOutButton className="h-full aspect-square" />
          </li>
        </ul>
      </nav>
    </div>

);
};
export default Sidebar;
