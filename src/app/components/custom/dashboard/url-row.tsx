import { FirecrawlJob } from "@/db/schema";

export const UrlRow = ({ job }: { job: FirecrawlJob }) => {
  return (
    <div className="w-full flex flex-col items-start">
      <a href={job.url} target="_blank">{job.url}</a>
      <div className={`rounded-sm px-1 ${job.status === "indexed" ? "bg-green-400" : "bg-gray-400"}`}>
        {job.status}
      </div>
    </div>
  );
}
