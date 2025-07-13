import { auth } from "@/auth";
import { getRedditSearchByEmail, getUser } from "@/db/queries";

export async function GET() {
	const session = await auth();
	if (!session || !session.user) {
		return Response.json({
			status: 400,
			message: "user has not authenticated"
		});
	} else if (!session.user.name || !session.user.email) {
		return Response.json({
			status: 500,
			message: "problem getting session"
		});

	}
	const user = await getUser(session.user.email, session.user.name);
	const searches = await getRedditSearchByEmail(user[0].email);
	return Response.json({ searches: searches })
}
