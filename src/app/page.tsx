import { db } from "@/lib/db";

export async function Home() {
  await db.set("hello", "chatman");
  return (
    <div>
      <div className="text-red-500">hello chatman</div>
    </div>
  );
}

export default Home;