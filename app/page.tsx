import { Desktop } from "@/components/os/desktop";
import { getGithubStats } from "@/lib/github";

export const revalidate = 3600;

export default async function Page() {
  const stats = await getGithubStats();
  return <Desktop stats={stats} />;
}
