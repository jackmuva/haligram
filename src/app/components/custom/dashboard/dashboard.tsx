"use client";
import { Session } from "next-auth";
import { useState } from "react";
import { InstructionsPanel } from "./instructions-panel";
import { KnowledgePanel } from "./knowledge-panel";
import { TopicPanel } from "./topic-panel";

export const Dashboard = ({ session }: { session: Session }) => {
  const [active, setActive] = useState<"instructions" | "knowledge" | "">("");
  return (
    <div className="flex flex-col md:flex-row min-w-full p-8 pt-20 space-y-4">
      <div className="flex flex-col h-[700px] w-full md:min-h-full md:w-1/3 gap-4">
        <InstructionsPanel active={active} setActive={setActive} />
        <KnowledgePanel active={active} setActive={setActive} />
      </div>
      <div className="w-full md:w-2/3 md:ml-4"
        onClick={() => setActive("")}>
        <TopicPanel />
      </div>
    </div>
  );
}
