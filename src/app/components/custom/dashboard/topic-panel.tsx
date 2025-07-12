"use client";
import { useState } from "react";
import { RedditPanel } from "./reddit/reddit-panel";

export const supportedChannels = ["reddit"];

export const TopicPanel = () => {
  const [activeChannel, setActiveChannel] = useState<string>(supportedChannels[0]);

  return (
    <div className="flex flex-col space-y-2 p-4 border border-foreground/20 bg-background rounded-sm h-full relative">
      <div className="flex space-x-2 absolute -top-3 left-3 z-10 bg-background px-1">
        <label className="font-semibold"> Channels: </label>
        {supportedChannels.map((channel: string) => {
          return (
            <div key={channel} className={`hover:underline cursor-pointer ${activeChannel === channel ? "text-red-700 dark:text-red-300" : ""}`}
              onClick={() => setActiveChannel(channel)}>
              {channel}
            </div>
          );
        })}
      </div>
      {activeChannel === "reddit" ?
        <RedditPanel /> :
        <></>}
    </div>
  );
}
