import { fetcher } from "@/lib/utils";
import useSWR from "swr";

export const ActiveRedditFeed = ({ searchTerm }: { searchTerm: string }) => {
  const params = new URLSearchParams({ q: searchTerm });
  //const { data, isLoading } = useSWR(`/api/reddit/search?${params.toString()}`, fetcher);

  return (
    //isLoading ? (<div>loading...</div>) : (
    <div></div>
    //)
  );
}
