import { auth } from "@/auth";
import { deleteFirecrawlJobById, deleteRedditContentBySearchId, deleteRedditSearchByEmailAndSearch, getUser } from "@/db/queries";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
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
	try {
		const body: { searchId: string } = await req.json();
		const search = await deleteRedditSearchByEmailAndSearch(session.user.email, body.searchId);
		if (search) {
			return Response.json({
				status: 200,
				message: "successfully deleted search and related replies",
			});
		}
		else {
			throw new Error("unable to delete search");
		}
	} catch (err) {
		return Response.json({
			status: 500,
			message: "unable to delete search: " + err,
		});

	}
}
