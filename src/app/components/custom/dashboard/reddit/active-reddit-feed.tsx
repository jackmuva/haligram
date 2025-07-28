import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { RedditPost } from "./reddit-post";
import { RedditContent } from "@/db/schema";

export const ActiveRedditFeed = ({ searchTerm }: { searchTerm: string }) => {
  const params = new URLSearchParams({ q: searchTerm });
  const { data, isLoading } = useSWR(`/api/reddit/get-search?${params.toString()}`, fetcher, {
    refreshInterval: 10000
  });

  console.log(data);
  return (
    isLoading ? (<div>loading...</div>) : (
      <div>
        {data.searchStatus !== "FINISHED" ? (
          <div>HALIGRAM is {data.searchStatus}</div>
        ) : (
          data.redditContent && data.redditContent.length === 0 ? (
            <div>No posts found...</div>
          ) : (
            <div>
              {data.redditContent.filter((post: RedditContent) => post.reply).length > 0 ? (
                data.redditContent.map((post: RedditContent) => {
                  if (post.reply) {
                    return (<RedditPost key={post.id} post={post} searchTerm={searchTerm} />);
                  }
                })) : (
                <div>No relevant posts...</div>
              )}
            </div>
          )
        )}
      </div>
    )
  );
}
