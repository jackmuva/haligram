export { auth as middleware } from "@/auth"

//import { auth } from "@/auth"
//import { getUser } from "./db/queries";
//
//export default auth((req) => {
//	auth().then((session) => {
//		if (session && session.user && session.user.name && session.user.email) {
//			getUser(session.user.email, session.user.name);
//		}
//	}).catch((err) => {
//		console.error("middleware error:", err);
//	});;
//})
