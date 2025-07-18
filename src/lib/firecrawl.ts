import 'dotenv/config';
import FirecrawlApp from '@mendable/firecrawl-js';

class FirecrawlService {
	protected _firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! });

	constructor() { };

	public static createService = () => {
		const fs = new FirecrawlService();
		return fs;
	}

	public async crawl({ url, limit, maxDepth = 5, email }: { url: string, limit: number, email: string, maxDepth?: number }) {
		const crawlResponse = await this._firecrawl.asyncCrawlUrl(url, {
			limit: limit,
			maxDepth: maxDepth ?? 3,
			scrapeOptions: {
				formats: ['markdown'],
			},
			webhook: {
				//url: `${process.env.APPLICATION_URL!}/api/knowledge/webhook`,
				url: `https://paratodemo.com/api/knowledge/webhook`,
				headers: {},
				metadata: { "user": email },
				events: ["completed", "failed"],
			}
		});

		if (!crawlResponse.success) {
			throw new Error(`Failed to crawl: ${crawlResponse.error}`)
		}
		return crawlResponse;
	}

	public async checkCrawlStatus(id: string) {
		const crawlResponse = await this._firecrawl.checkCrawlStatus(id);

		if (!crawlResponse.success) {
			throw new Error(`Failed to check crawl status: ${crawlResponse.error}`)
		}

		return crawlResponse;
	}
}

export const firecrawlService = FirecrawlService.createService();
