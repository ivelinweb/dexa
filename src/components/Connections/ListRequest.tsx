"use client";
import { useDexa } from "@/context/dexa.context";
import { RequestInterface } from "@/interfaces/message.interface";
import { UserInterface } from "@/interfaces/user.interface";
import React, { useEffect, useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import CreatorPFP from "../Posts/ListPost/CreatorPFP";
import Moment from "react-moment";
import Button from "../Form/Button";
import { formatWalletAddress } from "@/libs/helpers";
import Link from "next/link";
import useToast from "@/hooks/toast.hook";
import { routes } from "@/libs/routes";

type Props = {
  request: RequestInterface;
  index: number;
};

function ListRequest({ request, index }: Props) {
  const requestDate = new Date(Number(request.createdAt) * 1000);
  const { CreatorABI, dexaCreator, MessengerABI, dexaMessenger } = useDexa();
  const [isAccepting, setIsAccepting] = useState<boolean>(false);
  const [isDeclining, setIsDeclining] = useState<boolean>(false);
  const [creator, setCreator] = useState<UserInterface>();
  const { loading, error, success } = useToast();
  const { writeContractAsync } = useWriteContract();
  const { data } = useReadContract({
    abi: CreatorABI,
    address: dexaCreator,
    functionName: "findCreator",
    args: [request.sender],
  });

  useEffect(() => {
    if (data) {
      const user = data as UserInterface;
      setCreator(user);
    }
  }, [data]);

  const acceptRequest = async () => {
    try {
      setIsAccepting(true);
      loading({ msg: "Accepting..." });
      await writeContractAsync(
        {
          abi: MessengerABI,
          address: dexaMessenger,
          functionName: "acceptConnectRequest",
          args: [request.sender, index],
        },
        {
          onSettled(data, error, variables, context) {
            setIsAccepting(false);
            success({ msg: "Request Accepted" });
          },
          onError(err, variables, context) {
            setIsAccepting(false);
            error({ msg: "Error accepting request" });
          },
        }
      );
    } catch (err) {
      setIsAccepting(false);
      error({ msg: "Error accepting request" });
    }
  };

  const declineRequest = async () => {
    try {
      setIsDeclining(true);
      loading({ msg: "Declining..." });
      await writeContractAsync(
        {
          abi: MessengerABI,
          address: dexaMessenger,
          functionName: "removeOne",
          args: [index],
        },
        {
          onSettled(data, error, variables, context) {
            setIsDeclining(false);
            success({ msg: "Request Declined" });
          },
          onError(err, variables, context) {
            setIsDeclining(false);
            error({ msg: "Error declining" });
          },
        }
      );
    } catch (err) {
      setIsDeclining(false);
      error({ msg: "Error declining" });
    }
  };

  return (
    <div className="flex items-center justify-between py-2 px-5 hover:bg-light cursor-pointer">
      <div className="flex items-start gap-x-2">
        <CreatorPFP
          username={creator?.username}
          name={creator?.name}
          pfp={creator?.pfp}
        />
        <div className="text-sm">
          <div className="gap-x-2 flex items-center">
            <Link
              href={routes.app.profile(`${creator?.username}`)}
              className="font-semibold"
            >
              {creator?.name}
            </Link>
            {creator?.wallet && (
              <p className="text-xs text-medium">
                {formatWalletAddress(creator?.wallet)}
              </p>
            )}
          </div>
          <p>
            <span className="font-medium">@{creator?.username}</span> is
            requesting to connect with you
          </p>
          <Moment fromNow className="text-medium text-xs">
            {requestDate}
          </Moment>
        </div>
      </div>
      <div className="flex items-center gap-x-3">
        <Button
          onClick={acceptRequest}
          type={"button"}
          kind={"clear"}
          shape={"ROUNDED"}
          disabled={isAccepting}
          className="bg-primary text-white hover:bg-primary/80 border border-primary"
        >
          Accept
        </Button>
        <Button
          onClick={declineRequest}
          type={"button"}
          kind={"clear"}
          shape={"ROUNDED"}
          disabled={isDeclining}
          className="bg-white text-primary hover:bg-primary/10 border border-primary"
        >
          Decline
        </Button>
      </div>
    </div>
  );
}

export default ListRequest;
