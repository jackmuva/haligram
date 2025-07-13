import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { RedditSignIn } from "../../reddit-sign-in";
import { RedditFeed } from "./reddit-feed";

export const RedditPanel = () => {
  const { data, isLoading } = useSWR(`/api/reddit/check-auth`, fetcher)

  return (
    <div className="flex flex-col w-full items-center min-h-96">
      {!isLoading ?
        (data.hasAuth ?
          (<RedditFeed />) :
          (<RedditSignIn />)
        ) : (<div className="w-full h-full flex items-center justify-center">Loading...</div>)}
    </div>
  );
}
