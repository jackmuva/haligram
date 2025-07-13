"use client";
import { useState } from "react";

export const InstructionsPanel = () => {
  const [active, setActive] = useState<boolean>(false);
  return (
    <div className={`relative border border-foreground/20 rounded-sm w-full p-4 bg-background duration-700 
          ease-in-out transition-all overflow-y-scroll
          ${!active ? "flex-1 hover:flex-4" : "flex-4"}`}
      onClick={() => setActive((prev) => !prev)}>
      <h1 className="font-semibold text-blue-700 dark:text-blue-300 absolute -top-3 left-3 z-10 bg-background px-1">
        HALIGRAM instructions
      </h1>
      <div className="flex flex-col space-y-4  ">
        <textarea rows={4} placeholder="system prompt for HALIGRAM to create comments"
          className="outline-none border border-foreground/20 rounded-sm px-1 bg-background-muted" />
        <textarea rows={10} placeholder="system prompt for HALIGRAM to create comments"
          className="outline-none border border-foreground/20 rounded-sm px-1 bg-background-muted" />
      </div>
    </div>

  );
}
