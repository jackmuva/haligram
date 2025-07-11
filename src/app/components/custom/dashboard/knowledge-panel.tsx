"use client";
import { useState } from "react";

export const KnowledgePanel = () => {
  const [active, setActive] = useState<boolean>(false);
  return (
    <div className={`relative border border-foreground/20 rounded-sm w-full bg-background duration-700 ease-in-out transition-all
          ${!active ? "flex-1 hover:flex-4" : "flex-4"}`}
      onClick={() => setActive((prev) => !prev)}>
      <h1 className="font-semibold text-emerald-700 dark:text-emerald-300 absolute -top-3 left-3 z-10 bg-background px-1">
        External Knowledge
      </h1>
    </div>
  );
}
