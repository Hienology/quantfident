// University search endpoint for autocomplete
// GET /api/universities?q=harv

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim().toLowerCase();

  if (!query || query.length < 2) {
    return NextResponse.json({ universities: [] });
  }

  try {
    const supabase = getSupabaseServer();

    // Search with prefix match and limit results
    const { data: universities, error } = await supabase
      .from("universities")
      .select("id, name, country, state")
      .ilike("name", `%${query}%`)
      .order("name")
      .limit(20);

    if (error) {
      console.error("[Universities] Search error:", error);
      return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }

    return NextResponse.json({ universities });
  } catch (error) {
    console.error("[Universities] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
