import { signIn } from "@/auth"
import Image from "next/image"

export function GithubSignIn() {
	return (
		<form
			action={async () => {
				"use server"
				await signIn("github")
			}}
		>
			<button className="border rounded-sm px-2 py-1 flex w-fit items-center bg-stone-100/80 
				space-x-2 hover:bg-stone-100/50 text-slate-900"
				type="submit">
				<Image src={"/github-logo.png"} alt="github logo" height={20} width={20} />
				<p>Sign in</p>
			</button>
		</form>
	)
}
