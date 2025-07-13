export const fetcher = async (url: string) => {
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`HTTP error! status: ${res.status}`);
	}
	return res.json();
};

export const callOAuthAPI = async ({ apiCall, refresh, purge }: {
	apiCall: () => Promise<Response>,
	refresh: () => Promise<any>,
	purge: () => Promise<void>
}): Promise<Response | null> => {
	let response = await apiCall();
	if (!response.ok) {
		const newToken = await refresh();
		console.log("refreshing token: ", newToken);
		response = await apiCall();
		if (!response.ok) {
			console.log("deleting credentials");
			await purge();
			return null;
		}
	}
	return response;
}
