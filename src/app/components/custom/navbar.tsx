import { Session } from "next-auth"
import { SignOut } from "./sign-out";
export const Navbar = ({ session }: { session: Session }) => {
	return (
		<div className="z-40 w-screen bg-background/20 border-b border-foreground/20 absolute top-0 left-0 h-16
			flex justify-between items-center px-8">
			<h1 className="text-amber-700 dark:text-amber-300 font-bold">HALIGRAM</h1>
			<div className="flex items-center space-x-8">
				<div className="flex items-center space-x-1">
					<div>{session.user?.name}</div>
				</div>
				<SignOut />
			</div>
		</div>
	);
}
