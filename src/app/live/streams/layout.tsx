import LiveMenu from "@/components/Live/LiveMenu";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex overflow-hidden h-full">
      <LiveMenu />
      <div className="flex-1 w-4/5 overflow-hidden flex flex-col">{children}</div>
    </div>
  );
}
