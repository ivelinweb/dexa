import React, { Suspense } from "react";
import AuthMainLayout from "@/components/Layouts/AuthMainLayout";
import WatchLive from "@/components/Live/WatchLive";

function Watch() {  
  return (
    <AuthMainLayout>
      <Suspense>
        <WatchLive />
      </Suspense>
    </AuthMainLayout>
  );
}

export default Watch;
