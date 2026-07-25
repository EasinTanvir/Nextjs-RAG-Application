import AppHeader from "@/components/AppHeader";
import ChatPanel from "@/components/ChatPanel";
import UploadPanel from "@/components/UploadPanel";

const HomePage = () => {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <AppHeader />
      <div className="mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:gap-6">
        <div className="flex-1 lg:basis-[35%]">
          <UploadPanel />
        </div>
        <div className="flex-1 lg:basis-[65%]">
          <ChatPanel />
        </div>
      </div>
    </main>
  );
};

export default HomePage;
