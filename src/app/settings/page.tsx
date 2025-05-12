"use client";

import { Suspense } from "react";
import Section from "@/components/Layouts/Section";
import AuthMainLayout from "@/components/Layouts/AuthMainLayout";
import ComingSoon from "@/components/ui/ComingSoon";
import Header from "@/components/ui/Header";

export default function Settings() {
  return (
    <AuthMainLayout>
      <div className="flex space-x-5">
        <Section>
          <div className="border-b bg-white/40 z-20 border-light top-0 sticky">
            <Header title="Settings" />
          </div>
          <Suspense>
            <ComingSoon />
          </Suspense>
        </Section>
      </div>
    </AuthMainLayout>
  );
}
