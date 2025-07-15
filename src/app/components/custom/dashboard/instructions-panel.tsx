import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Notification } from "../../ui/notification";

export const InstructionsPanel = ({ active, setActive }:
  { active: "instructions" | "knowledge" | "", setActive: (x: "instructions" | "knowledge" | "") => void }) => {
  ({ prompt: "", context: "" });
  const { data, mutate, isLoading } = useSWR(`/api/instructions`, fetcher)

  const submitInstr = async () => {
    const prompt = window.document.getElementById("prompt");
    const context = window.document.getElementById("context");
    //@ts-ignore
    if (context && !context.value) {
      context.innerHTML = "Please give context on your product - description, benefits, use cases, examples";
      return;
    }
    const req = await fetch(`${window.location.origin}/api/instructions`, {
      method: "POST",
      //@ts-ignore
      body: JSON.stringify({ prompt: prompt.value, context: context.value }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await req.json();
    if (res) {
      //@ts-ignore
      toast(<Notification />, {
        data: { message: "saved" },
        closeButton: false,
        customProgressBar: true,
        position: 'top-left',
      });
      mutate();
    }
  }

  return (
    <div className={`relative border border-foreground/20 rounded-sm w-full p-4 bg-background duration-700 
          ease-in-out transition-all overflow-y-scroll 
          ${active === "instructions" ? "flex-4" : "flex-1 hover:flex-4"}`}
      onClick={() => setActive("instructions")}>
      <ToastContainer />
      <div className="flex w-full justify-between items-center">
        <h1 className="font-semibold text-blue-700 dark:text-blue-300  px-1">
          HALIGRAM instructions
        </h1>
        <div className="text-indigo-600 dark:text-indigo-300 underline hover:font-bold cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            submitInstr();
          }}>
          Save
        </div>
      </div>
      <div className="flex flex-col space-y-4 mt-4">
        <textarea id="prompt" rows={4} placeholder="system prompt for HALIGRAM to create comments"
          className="outline-none border border-foreground/20 rounded-sm px-1 bg-background-muted"
          defaultValue={!isLoading && data.instructions.length > 0 ? data.instructions[0].systemPrompt : ""}>
        </textarea>
        <textarea id="context" rows={10} placeholder="context on your product - description, benefits, use cases, examples"
          className="outline-none border border-foreground/20 rounded-sm px-1 bg-background-muted"
          defaultValue={!isLoading && data.instructions.length > 0 ? data.instructions[0].productContext : ""}>
        </textarea>
      </div>
    </div>

  );
}
