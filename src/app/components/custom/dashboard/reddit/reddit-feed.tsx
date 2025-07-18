import { Button } from "@/app/components/ui/button";
import { ActiveRedditFeed } from "./active-reddit-feed";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { useEffect, useState } from "react";
import { RedditSearch } from "@/db/schema";
import { toast, ToastContainer } from "react-toastify";
import { Notification } from "@/app/components/ui/notification";
import { Input } from "@/app/components/ui/input";

export function RedditFeed() {
  const { data, mutate, isLoading } = useSWR(`/api/reddit/past-searches`, fetcher)
  const [feedState, setFeedState] = useState<{ searchTerm: string, activeTerm: string }>
    ({ searchTerm: "", activeTerm: "" });

  useEffect(() => {
    if (data && data.searches.length > 0) {
      setFeedState((prev) => ({
        ...prev, activeTerm: data.searches.sort((a: RedditSearch, b: RedditSearch) => {
          const aDate = a.updatedAt ?? '';
          const bDate = b.updatedAt ?? '';
          return aDate.localeCompare(bDate);
        })[0].search
      }));
    }
  }, [data]);

  const submitSearch = async (search: string) => {
    if (!search) {
      return;
    }
    const req = await fetch(`${window.location.origin}/api/reddit/new-search`, {
      method: "POST",
      body: JSON.stringify({ searchTerm: search }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await req.json();
    if (res) {
      mutate()
      setFeedState((prev) => ({ ...prev, searchTerm: "" }));
      //@ts-ignore
      toast(<Notification />, {
        data: {
          message: `HALIGRAM is searching for relevant posts on [${search}] 
                    Check ${search} tab for status.`
        },
        closeButton: false,
        customProgressBar: true,
        position: 'top-center'
      });
    }
  }

  return (
    <div className="w-full flex flex-col pt-2 space-y-4">
      <ToastContainer />
      <div className="flex space-x-2">
        <Input type="text" placeholder="search for keywords or phrases" maxLength={512}
          className="w-80"
          onChange={(e) => setFeedState((prev) => ({ ...prev, searchTerm: e.target.value }))}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              submitSearch(feedState.searchTerm);
            }
          }}
          value={feedState.searchTerm} />
        <Button className="bg-foreground-muted" onClick={() => submitSearch(feedState.searchTerm)}
          disabled={feedState.searchTerm === ""}>
          search
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 justify-start">
        {!isLoading ? (
          [...data.searches]
            .sort((a: RedditSearch, b: RedditSearch) => {
              const aDate = a.updatedAt ?? '';
              const bDate = b.updatedAt ?? '';
              return aDate.localeCompare(bDate);
            })
            .map((search: RedditSearch) => {
              return (
                <div
                  key={search.search}
                  className={`border ${search.search === feedState.activeTerm ? "bg-indigo-500/70" : "bg-foreground-muted/30"}
                  px-2 rounded-sm hover:bg-foreground hover:text-background overflow-x-scroll cursor-pointer`}
                  onClick={() => setFeedState((prev) => ({ ...prev, activeTerm: search.search }))}
                >
                  {search.search}
                </div>
              )
            })) : (<div>loading...</div>)}
      </div>
      {feedState.activeTerm && <ActiveRedditFeed searchTerm={feedState.activeTerm} />}
    </div>
  )
}
