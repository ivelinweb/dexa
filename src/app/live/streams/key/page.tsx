"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/redux.hook";
import { setSidebar } from "@/slices/sidebar/sidebar.slice";
import Section from "@/components/Layouts/Section";
import LiveHeader from "@/components/Live/LiveHeader";
import { IStreamCredentials } from "@/interfaces/stream.interface";
import { useAuth } from "@/context/auth.context";
import RequestKey from "@/components/Live/RequestKey";
import { useQuery } from "@tanstack/react-query";
import {
  getStreamCredentials,
} from "@/actions/stream.action";
import { QueryKeys } from "@/libs/enum";
import StreamKeyForm from "@/components/Live/StreamKeyForm";

function StreamKey() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [credentials, setCredentials] = useState<IStreamCredentials>();

  const { data, refetch } = useQuery({
    queryKey: [QueryKeys.STREAM_AUTH],
    queryFn: getStreamCredentials,
    enabled: user ? true : false,
  });

  useEffect(() => {
    dispatch(setSidebar(false));
  }, []);

  useEffect(() => {
    if (data?.data && data.status == true) {
      const { serverUrl, streamKey, ingressId } =
        data.data as IStreamCredentials;
      setCredentials({ serverUrl, streamKey, ingressId });
    }
  }, [data]);

  return (
    <div className="">
      <LiveHeader title="Credentials" />
      <Section>
        {credentials ? (
          <>
            <div className="max-w-2xl mx-auto w-full p-5 my-5">
              <p className="text-xl font-semibold">Streaming Credentials</p>
              <p className="text-medium">
                Paste these credientials in your streaming software. (eg: OBS)
              </p>
            </div>
            <div className="max-w-2xl px-5 mx-auto w-full flex flex-col gap-10">
              <StreamKeyForm credentials={credentials} />
            </div>
          </>
        ) : (
          <RequestKey setCredentials={setCredentials} />
        )}
      </Section>
    </div>
  );
}

export default StreamKey;
