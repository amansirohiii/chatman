"use client"
import { db } from "@/lib/db";
import { signIn, signOut } from "next-auth/react"

export default function Home() {
  // await db.set("hello", "chatman");
  return (
    <div>
    <button onClick={() => signIn()}>Signin</button>
    <button onClick={() => signOut()}>Sign out</button>
  </div>
  );
}

// export default Home;