import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { toast } from "react-toastify";
import { Notification } from "../../ui/notification";
import { ToastContainer } from "react-toastify";

export const KnowledgePanel = ({ active, setActive }:
  { active: "instructions" | "knowledge" | "", setActive: (x: "instructions" | "knowledge" | "") => void }) => {

  const submitFirecrawlJob = async () => {
    const url = window.document.getElementById("urlBar").value;
    const crawlDepth = window.document.getElementById("crawlDepth").value;
    fetch(`${window.location.origin}/api/knowledge`, {
      method: "POST",
      body: JSON.stringify({
        url: url,
        crawlDepth: crawlDepth,
      }),
    }).then((job) => {
      if (job) {
        toast(<Notification />, {
          position: "top-left",
          data: { message: "HALIGRAM is extracting data from site" },
          hideProgressBar: true,
          closeButton: false,
        })
      } else {
        toast(<Notification />, {
          position: "top-left",
          data: { message: "Unable to extract data. Please try again" },
          hideProgressBar: true,
          closeButton: false,
        })
      }
    });;
  }

  return (
    <div className={`relative border border-foreground/20 rounded-sm w-full bg-background 
          duration-700 ease-in-out transition-all overflow-y-scroll p-2 flex flex-col  space-y-2 
          ${active === "knowledge" ? "flex-4" : "flex-1 hover:flex-4"}`}
      onClick={() => setActive("knowledge")}>
      <ToastContainer />
      <h1 className="font-semibold text-emerald-700 dark:text-emerald-300 px-1">
        external knowledge
      </h1>
      <div className="w-full flex space-x-2">
        <Input id="urlBar" type="url" placeholder="crawl url for external knowledge" className="w-full" />
        <Input id="crawlDepth" defaultValue={1} type="number" min={1} max={5} className="w-10" />
      </div>
      <Button className="w-44 bg-indigo-500 text-white hover:bg-indigo-300"
        variant="custom" onClick={() => submitFirecrawlJob()}>
        crawl
      </Button>
      <div className="mt-2 font-bold">indexed urls:</div>
    </div>
  );
}
