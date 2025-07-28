import { Button } from "@/app/components/ui/button";
import { RedditContent } from "@/db/schema";
import { useState, useEffect, useRef } from "react";
import { mutate } from "swr";

export const RedditPost = ({ post, searchTerm }: { post: RedditContent, searchTerm: string }) => {
  const [expand, setExpand] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (expand && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [expand]);

  const postComment = async () => {
    const comment = document.getElementById("commentInput");
    //@ts-ignore
    if (comment && !comment.value) {
      comment.innerHTML = "comment cannot be blank";
      return;
    }

    const postReq = await fetch(`${window.location.origin}/api/reddit/comment`,
      {
        method: "POST",
        body: JSON.stringify({
          parent: post.postId,
          //@ts-ignore
          text: comment.value,
        }),
      });
    if (postReq.ok) {
      // @ts-ignore
      toast(<Notification />, {
        position: "top-right",
        data: { message: "comment posted" },
        hideProgressBar: true,
        closeButton: false,
      });
      const params = new URLSearchParams({ q: searchTerm });
      mutate(`/api/reddit/get-search?${params.toString()}`)
    } else {
      // @ts-ignore
      toast(<Notification />, {
        position: "top-right",
        data: { message: "unable to post comment" },
        hideProgressBar: true,
        closeButton: false,
      })
    }
  }

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
        id={"commentInput"}
        ref={textareaRef}
        className={`p-1 border border-foreground/30 rounded-sm bg-green-200/30 w-full
          ${expand ? "overflow-hidden" : "h-full"}`}
        style={{ height: expand ? 'auto' : undefined }}
        defaultValue={post.reply ?? ""} />
      {expand && <Button className="w-40" onClick={() => postComment()}>Comment</Button>}
    </div>
  );
}
