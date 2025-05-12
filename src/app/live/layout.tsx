import AuthMainLayout from "@/components/Layouts/AuthMainLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dexa | Live streaming",
  description: "Start streaming right from Dexa",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthMainLayout>{children}</AuthMainLayout>;
}
