import Image from "next/image"
import { Button } from "../ui/button"

export function RedditSignIn() {
	return (
		<div className="w-full h-full flex items-center justify-center">
			<a href={`${window.location.origin}/api/oauth/reddit`}>
				<Button type="submit">
					<Image src={"/reddit-logo.png"} alt="reddit logo" height={20} width={20} />
					<p>connect your reddit</p>
				</Button>
			</a>
		</div>
	)
}
