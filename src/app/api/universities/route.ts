// University search endpoint for autocomplete
// GET /api/universities?q=harv&offset=0&limit=10

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim().toLowerCase();
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const limit = Math.min(parseInt(searchParams.get("limit") || "10", 10), 20);

  if (!query || query.length < 2) {
    return NextResponse.json({ universities: [], total: 0 });
  }

  try {
    const supabase = getSupabaseServer();

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from("universities")
      .select("id", { count: "exact", head: true })
      .ilike("name", `%${query}%`);

    if (countError) {
      console.error("[Universities] Count error:", countError);
    }

    // Search with prefix match and pagination
    const { data: universities, error } = await supabase
      .from("universities")
      .select("id, name, country, state")
      .ilike("name", `%${query}%`)
      .order("name")
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("[Universities] Search error:", error);
      return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }

    return NextResponse.json({ 
      universities, 
      total: count || 0,
      offset,
      limit
    });
  } catch (error) {
    console.error("[Universities] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
