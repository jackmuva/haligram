import { Session } from "next-auth";
import { Navbar } from "../navbar";
import { InstructionsPanel } from "./instructions-panel";
import { KnowledgePanel } from "./knowledge-panel";
import { TopicPanel } from "./topic-panel";

export const Dashboard = ({ session }: { session: Session }) => {

  return (
    <div className="flex flex-col md:flex-row min-w-full p-8 pt-20 space-y-4">
      <Navbar session={session} />
      <div className="flex flex-col h-[700px] w-full md:min-h-full md:w-1/3 gap-4">
        <InstructionsPanel />
        <KnowledgePanel />
      </div>
      <div className="w-full md:w-2/3 md:ml-4">
        <TopicPanel />
      </div>
    </div>
  );
}
