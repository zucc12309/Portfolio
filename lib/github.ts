export type GithubStat = {
  name: string;
  stars: number;
  forks: number;
  language: string;
  updatedAt: string;
  url: string;
};

export const publicRepoUrls = [
  "https://github.com/zucc12309/memory-router",
  "https://github.com/zucc12309/Ai-agent-os",
  "https://github.com/zucc12309/AI-HEDGE-FUND",
  "https://github.com/zucc12309/CRM-workflow-automation",
  "https://github.com/zucc12309/splitwise-mcp",
  "https://github.com/zucc12309/Swiggy-bot",
];

function parseRepo(url: string) {
  const [, owner, repo] = url.match(/github\.com\/([^/]+)\/([^/]+)/) ?? [];
  return { owner, repo };
}

/** Fetches public repo stats directly from GitHub (cached for an hour). Never throws. */
export async function getGithubStats(): Promise<GithubStat[]> {
  const results = await Promise.all(
    publicRepoUrls.map(async (url): Promise<GithubStat | null> => {
      const { owner, repo } = parseRepo(url);
      if (!owner || !repo) return null;

      try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
          headers: process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : undefined,
          next: { revalidate: 3600 },
          signal: AbortSignal.timeout(5000),
        });
        if (!response.ok) return null;
        const json = await response.json();
        return {
          name: json.name,
          stars: json.stargazers_count,
          forks: json.forks_count,
          language: json.language ?? "Mixed",
          updatedAt: json.updated_at,
          url: json.html_url,
        };
      } catch {
        return null;
      }
    }),
  );

  return results.filter((item): item is GithubStat => item !== null);
}
