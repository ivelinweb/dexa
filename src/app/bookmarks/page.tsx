"use client";

import React, { useState } from "react";
import Section from "@/components/Layouts/Section";
import AuthMainLayout from "@/components/Layouts/AuthMainLayout";
import Header from "@/components/ui/Header";
import Aside from "@/components/Layouts/Aside";
import BookmarkFeeds from "@/components/Bookmarks/BookmarkFeeds";

export default function Bookmarks() {
  return (
    <AuthMainLayout>
      <div className="flex space-x-5">
        <Section>
          <div className="border-b bg-white/40 z-20 border-light px-3 top-0 sticky">
            <Header title="Bookmarks" isBack={false} />
          </div>
          <BookmarkFeeds />
        </Section>
        <Aside className="pr-3">
          <div></div>
        </Aside>
      </div>
    </AuthMainLayout>
  );
}
