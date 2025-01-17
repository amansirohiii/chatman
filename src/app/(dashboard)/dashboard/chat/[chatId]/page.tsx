import ChatInput from "@/components/ChatInput";
import Messages from "@/components/Messages";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { messageArrayValidator } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { Message } from "postcss";


export async function generateMetadata({
  params,
}: {
  params: { chatId: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session) notFound()
  const [userId1, userId2] = params.chatId.split('--')
  const { user } = session

  const chatPartnerId = user.id === userId1 ? userId2 : userId1
  const chatPartnerRaw = (await fetchRedis(
    'get',
    `user:${chatPartnerId}`
  )) as string
  const chatPartner = JSON.parse(chatPartnerRaw) as User

  return { title: `FriendZone | ${chatPartner.name} chat` }
}

interface pageProps {
  params: {
    chatId: string;
  };
}
async function getChatMessages(chatId: string) {
  try {
    const result: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    );
    const dbMessages = result.map((message) => JSON.parse(message) as Message);
    const reversedDbMessages = dbMessages.reverse();
    const messages = messageArrayValidator.parse(reversedDbMessages);
    return messages;
  } catch (error) {
    notFound();
  }
}

const page = async ({ params }: pageProps) => {
  const { chatId } = params;
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");
  const { user } = session;
  const [userId1, userId2] = chatId.split("--");
  if (user.id !== userId1 && user.id !== userId2) notFound();
  const chatPartnerId = user.id === userId1 ? userId2 : userId1;
  const chatPartnerRaw = (await fetchRedis(
    'get',
    `user:${chatPartnerId}`
  )) as string
  const chatPartner = JSON.parse(chatPartnerRaw) as User
  const initialMessages = await getChatMessages(chatId)
  return (
    <div className="flex-1 justify-between flex flex-col md:h-full md:max-h-[calc(100vh-6rem)] h-[calc(100vh-10rem)] ">
      <div className="flex sm:items-center justify-between md:py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative w-8 sm:w-12 h-8 sm:h-12">
              <Image
                src={chatPartner.image}
                fill
                referrerPolicy="no-referrer"
                className="rounded-full"
                alt={`${chatPartner.name} profile picture`}
              />
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <div className="text-xl flex items-center">
              <span className="text-gray-700 mr-3 font-semibold">
                {chatPartner.name}
              </span>
            </div>
            <span className="text-sm text-gray-600">{chatPartner.email}</span>
          </div>
        </div>
      </div>
      <Messages sessionImg={session.user.image} chatPartner={chatPartner} initialMessages={initialMessages} sessionId={session.user.id} chatId={chatId}/>
      <ChatInput chatPartner={chatPartner} chatId={chatId}/>
    </div>
  );
};

export default page;
