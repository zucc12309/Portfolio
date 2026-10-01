import { NextResponse } from "next/server";
import { getGithubStats } from "@/lib/github";

export const revalidate = 3600;

export async function GET() {
  return NextResponse.json(await getGithubStats());
}
