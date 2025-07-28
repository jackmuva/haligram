import { auth } from "@/auth";
import { deleteFirecrawlJobById, getUser } from "@/db/queries";
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
		const body: { jobId: string, jobUrl: string } = await req.json();
		const user = await getUser(session.user.email, session.user.name);
		const job = await deleteFirecrawlJobById(user[0].id, body.jobId, body.jobUrl);
		if (job) {
			return Response.json({
				status: 200,
				message: "successfully deleted job",
			});
		}
		else {
			throw new Error("unable to delete job");
		}
	} catch (err) {
		return Response.json({
			status: 500,
			message: "unable to delete job: " + err,
		});

	}
}
