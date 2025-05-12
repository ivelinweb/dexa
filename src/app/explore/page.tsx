"use client";

import React, { useState } from "react";
import Section from "@/components/Layouts/Section";
import AuthMainLayout from "@/components/Layouts/AuthMainLayout";
import ComingSoon from "@/components/ui/ComingSoon";
import Header from "@/components/ui/Header";

export default function Explore() {
  return (
    <AuthMainLayout>
      <Section>
        <div className="border-b bg-white/40 z-20 border-light top-0 sticky">
          <Header title="Explore" />
        </div>
        <ComingSoon />
      </Section>
    </AuthMainLayout>
  );
}
