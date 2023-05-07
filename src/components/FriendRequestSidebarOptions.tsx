"use client";
import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { motion as m } from "framer-motion";
interface FriendRequestSidebarOptionsProps {
  sessionId: string;
  initialUnseenRequests: number;
}

const FriendRequestSidebarOptions: FC<FriendRequestSidebarOptionsProps> = ({
  sessionId,
  initialUnseenRequests,
}) => {
  const [unseenRequests, setUnseenRequests] = useState<number>(
    initialUnseenRequests
  );

  // real time friend request
  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const friendRequestHandler = () => {
      setUnseenRequests((prev) => prev + 1);
    };

    const addedFriendHandler = () => {
      setUnseenRequests((prev) => prev - 1);
    };

    pusherClient.bind("incoming_friend_requests", friendRequestHandler);
    pusherClient.bind("new_friend", addedFriendHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));

      pusherClient.unbind("new_friend", addedFriendHandler);
      pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
    };
  }, [sessionId]);

  return (
    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Link
        href="/dashboard/requests"
        className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
      >
        <div className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
          <User className="h-7 w-7" />
        </div>
        <p className="truncate">Friend requests</p>
        {unseenRequests > 0 ? (
          <div className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600">
            {unseenRequests}
          </div>
        ) : null}
      </Link>
    </m.div>
  );
};

export default FriendRequestSidebarOptions;
