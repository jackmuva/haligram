import { Button } from "@/app/components/ui/button";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { useState } from "react";

export function RedditFeed() {
  const { data, isLoading, mutate } = useSWR(`/api/reddit/past-search`, fetcher)
  const [feedState, setFeedState] = useState<{ searchTerm: string }>({ searchTerm: "" });
  console.log(data, isLoading);

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
    }
  }

  return (
    <div className="w-full flex flex-col pt-2">
      <div className="flex space-x-2">
        <input type="text" placeholder="search for keywords or phrases" maxLength={512}
          className="border border-foreground/20 rounded-sm px-1 bg-background-muted w-80"
          onChange={(e) => setFeedState((prev) => ({ ...prev, searchTerm: e.target.value }))}
          value={feedState.searchTerm} />
        <Button className="bg-foreground-muted" onClick={() => submitSearch(feedState.searchTerm)}
          disabled={feedState.searchTerm === ""}>
          search
        </Button>
      </div>
      <div className="flex">

      </div>
    </div>
  )
}
