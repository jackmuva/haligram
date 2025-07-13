import Image from "next/image";
import { GithubSignIn } from "./github-sign-in";

export const SigninPage = () => {
  return (
    <div className="min-w-full min-h-full flex flex-col space-y-2 justify-center items-center">
      <div className="text-amber-700 dark:text-amber-300 font-bold">
        HALIGRAM
      </div>
      <div>
        Haligram helps marketing folks get in the right threads and conversations
      </div>
      <Image src={""} width={50} height={50} alt="haligram screenshot" />
      <div className="border border-foreground/30 flex flex-col space-y-4 p-6 rounded-sm items-center">
        <div>
          Sign in with one of the following providers:
        </div>
        <GithubSignIn />
      </div>
    </div >
  );
}
