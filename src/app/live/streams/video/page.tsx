"use client";

import React, { useEffect, useState, useLayoutEffect, Suspense } from "react";
import { useAppDispatch } from "@/hooks/redux.hook";
import { setSidebar } from "@/slices/sidebar/sidebar.slice";
import { useStream } from "@/context/stream.context";
import { useAuth } from "@/context/auth.context";
import StreamPlayer from "@/components/Live/StreamPlayer";
import { IStreamCredentials } from "@/interfaces/stream.interface";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/libs/enum";
import { getStreamCredentials } from "@/actions/stream.action";
import Loader from "@/components/ui/Loader";

function StreamVideo() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { getViewerToken, viewerCredentials } = useStream();
  const [credentials, setCredentials] = useState<IStreamCredentials>();

  const { data } = useQuery({
    queryKey: [QueryKeys.STREAM_AUTH],
    queryFn: getStreamCredentials,
    enabled: !!user,
  });

  useLayoutEffect(() => {
    dispatch(setSidebar(false));
  }, []);

  useEffect(() => {
    if (user && credentials) {
      getViewerToken(`${user.wallet}`, `${user.username}`);
    }
  }, [user, credentials]);

  useEffect(() => {
    if (data?.data && data.status == true) {
      const { serverUrl, streamKey, ingressId } =
        data.data as IStreamCredentials;
      setCredentials({ serverUrl, streamKey, ingressId });
    }
  }, [data]);

  return (
    <Suspense fallback={<Loader />}>
      <StreamPlayer
        token={viewerCredentials?.token}
        hostIdentity={`${user?.wallet}`}
        hostName={`${user?.username}`}
        isStreaming={true}
      />
    </Suspense>
  );
}

export default StreamVideo;
