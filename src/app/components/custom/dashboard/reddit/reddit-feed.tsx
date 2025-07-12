import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { RedditSignIn } from "../../reddit-sign-in";
import { RedditPanel } from "./reddit-panel";

export const RedditFeed = () => {
  const { data, isLoading } = useSWR(`/api/reddit/check-auth`, fetcher)

  return (
    <div className="flex flex-col w-full items-center min-h-96 justify-center">
      {!isLoading ?
        (data.hasAuth ?
          (<RedditPanel />) :
          (<RedditSignIn />)
        ) : (<div>Loading...</div>)}
    </div>
  );
}
