"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/auth.context";
import { useDexaMessenger } from "@/context/dexa-messenger.context";
import { toOxString } from "@/libs/helpers";
import { useReadContract } from "wagmi";
import { FriendListInterface } from "@/interfaces/user.interface";
import { useQuery } from "@tanstack/react-query";
import { batchUserStreamStatus } from "@/actions/stream.action";
import { LiveUser } from "@/interfaces/stream.interface";
import LiveUserPFP from "../Live/stream-components/LiveUserPFP";

function LiveOnDexa() {
  const { dexaMessenger, MessengerABI } = useDexaMessenger();
  const [friends, setFriends] = useState<FriendListInterface[]>([]);
  const [liveUsers, setLivesUsers] = useState<FriendListInterface[]>([]);
  const { user } = useAuth();
  const { data } = useReadContract({
    abi: MessengerABI,
    address: dexaMessenger,
    functionName: "getFriendsList",
    account: toOxString(user?.wallet),
    query: {
      enabled: !!user,
    },
  });

  const { refetch: fetchStatuses } = useQuery({
    queryKey: ["LIVE_USERS"],
    queryFn: () => batchUserStreamStatus(friends),
    enabled: false,
  });

  useEffect(() => {
    if (data) {
      setFriends(data as FriendListInterface[]);
    }
  }, [data]);

  useEffect(() => {
    const init = async () => {
      if (friends.length > 0) {
        const response = await fetchStatuses();
        const liveUsers: LiveUser[] = response.data?.data;
        if (liveUsers && liveUsers.length > 0) {
          const filterUsers = friends.filter((f) =>
            liveUsers.some(
              (u) => u.creator.toLowerCase() === f.id.toLowerCase()
            )
          );
          setLivesUsers(filterUsers);
        }
      }
    };
    if (friends.length > 0) init();
  }, [friends]);

  if (liveUsers.length < 1) {
    return;
  }

  return (
    <div className="w-full flex flex-col p-3 rounded-2xl border border-light overflow-hidden bg-white">
      <div className="flex justify-between bg-white">
        <p className="inline text-base xl:text-lg font-semibold text-medium">
          <span className="text-primary">Moments</span> &{" "}
          <span className="gradient-text">Hangouts</span>
        </p>
      </div>
      <div className="w-full overflow-scroll scrollbar-hide mt-2 flex items-center gap-x-3 justify-start">
        {liveUsers.map((user, i) => (
          <LiveUserPFP key={i} user={user} />
        ))}
      </div>
    </div>
  );
}

export default LiveOnDexa;
