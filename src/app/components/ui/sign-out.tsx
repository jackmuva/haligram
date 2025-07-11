import { signOut } from "@/auth"

export function SignOut() {
	return (
		<form
			action={async () => {
				"use server"
				await signOut()
			}}
		>
			<button className="border rounded-sm px-2 py-1 flex w-fit items-center bg-stone-100/80 
				space-x-2 hover:bg-stone-100/50 text-slate-900"
				type="submit">Sign Out</button>
		</form>
	)
}
