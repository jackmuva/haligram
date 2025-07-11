import { auth } from "@/auth";
import { Session } from "next-auth";
import { Dashboard } from "./components/custom/dashboard/dashboard";
import { SigninPage } from "./components/custom/signin-page";

export default async function Home() {
  const session: Session | null = await auth()
  console.log(session);
  if (session) {
    return (
      <div className="flex min-w-dvw min-h-dvh font-mono">
        <Dashboard session={session} />
      </div>
    );
  }
  return (
    <div className="flex min-w-dvw min-h-dvh font-mono">
      <SigninPage />
    </div>
  );
}
