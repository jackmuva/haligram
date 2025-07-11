import { signIn } from "@/auth"
import Image from "next/image"
import { Button } from "../ui/button"

export function GithubSignIn() {
	return (
		<form
			action={async () => {
				"use server"
				await signIn("github")
			}}
		>
			<Button type="submit">
				<Image src={"/github-logo.png"} alt="github logo" height={20} width={20} />
				<p>Sign in</p>
			</Button>
		</form>
	)
}
