"use client";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import DrawingViewer from "@/components/viewer/DrawingViewer";
import DrawingInfo from "@/components/viewer/DrawingInfo";
import KeyboardShortcuts from "@/components/layout/KeyboardShortcuts";

export default function Home() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <KeyboardShortcuts />
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <DrawingViewer />
          </div>
          <DrawingInfo />
        </main>
      </div>
    </div>
  );
}
