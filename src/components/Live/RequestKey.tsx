import React, { useState } from "react";
import Button from "../Form/Button";
import { useAuth } from "@/context/auth.context";
import { requestCredentials } from "@/actions/stream.action";
import useToast from "@/hooks/toast.hook";
import { IStreamCredentials } from "@/interfaces/stream.interface";
import { IngressInput } from "@/libs/enum";

type Props = {
  setCredentials: React.Dispatch<
    React.SetStateAction<IStreamCredentials | undefined>
  >;
};

function RequestKey({ setCredentials }: Props) {
  const { user } = useAuth();
  const { loading, success, error } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const requestKey = async () => {
    try {
      if (!user) return;
      loading({ msg: "Requesting Key..." });
      setIsLoading(true);
      const request = await requestCredentials(
        `${user.username}`,
        IngressInput.RTMP_INPUT
      );
      if (request.status) {
        const data = request.data as IStreamCredentials;
        setCredentials(data);
        success({ msg: "Successful" });
      } else {
        error({ msg: request.message });
      }
      setIsLoading(false);
    } catch (err: any) {
      error({ msg: err.message });
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center min-h-96 flex items-center justify-start">
      <div>
        <p className="font-semibold">No Stream key</p>
        <p className="text-medium mt-2">
          You do not have any stream key, click on the request button to get
          one.
        </p>
        <Button
          onClick={requestKey}
          disabled={isLoading}
          kind="primary"
          type="button"
          className="px-[4rem] py-[0.8rem] mt-6"
          size="LARGE"
        >
          Request key
        </Button>
      </div>
    </div>
  );
}

export default RequestKey;
