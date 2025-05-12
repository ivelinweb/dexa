import NewPost from "@/components/Posts/NewPost";
import Feeds from "@/components/Home/Feeds";
import Section from "@/components/Layouts/Section";
import Aside from "@/components/Layouts/Aside";
import QuickView from "@/components/Profile/QuickView";
import Header from "@/components/ui/Header";
import AuthMainLayout from "@/components/Layouts/AuthMainLayout";
import SearchComponent from "@/components/Home/Search";
import LiveOnDexa from "@/components/Home/LiveOnDexa";

export default function Home() {
  return (
    <AuthMainLayout>
      <div className="flex space-x-5">
        <Section>
          <div className="border-b bg-white/40 z-20 border-light px-3 top-0 sticky">
            <Header title="Feeds" isBack={false} />
          </div>
          <div className="border-b border-light">
            <NewPost />
          </div>
          <Feeds />
        </Section>
        <Aside className="pr-3">
          <div className="flex flex-col gap-y-5 mt-2">
            <SearchComponent />
            <QuickView />
            <LiveOnDexa />
          </div>
        </Aside>
      </div>
    </AuthMainLayout>
  );
}
