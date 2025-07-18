import { Button } from "@/app/components/ui/button";
import { RedditContent } from "@/db/schema";
import { useState, useEffect, useRef } from "react";

export const RedditPost = ({ post }: { post: RedditContent }) => {
  const [expand, setExpand] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  //TODO:button to post comment

  useEffect(() => {
    if (expand && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [expand]);

  return (
    <div className={`w-full border border-background-muted bg-background-muted/30 
      rounded-sm p-2 overflow-y-hidden flex flex-col space-y-2 
       ${expand ? "h-fit" : "h-48 hover:bg-background-muted/50 cursor-pointer"}`}
      onClick={() => setExpand(true)}>
      <div>
        <div className="flex space-x-2 items-center font-semibold justify-between">
          <div className="underline underline-offset-4">title: {post.title}</div>
          {expand && <Button variant="icon" size="sm" onClick={(e) => {
            e.stopPropagation();
            setExpand(false);
          }}>
            collapse
          </Button>}
        </div>
        <div className={`pl-2 ${expand ? "" : "line-clamp-2"}`}>{post.contentText}</div>
      </div>
      <textarea
        ref={textareaRef}
        className={`p-1 border border-foreground/30 rounded-sm bg-green-200/30 w-full
          ${expand ? "overflow-hidden" : "h-full"}`}
        style={{ height: expand ? 'auto' : undefined }}
        defaultValue={post.reply ?? ""} />
    </div>
  );
}
