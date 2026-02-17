// University search endpoint for autocomplete
// GET /api/universities?q=harv&offset=0&limit=10
// Supports searching by name OR abbreviations (e.g., "NJIT", "MIT", "UCLA")

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

    // Fetch name matches
    const { data: nameMatches, error: nameError } = await supabase
      .from("universities")
      .select("id, name, country, state, abbreviations")
      .ilike("name", `%${query}%`)
      .limit(200);

    if (nameError) {
      console.error("[Universities] Name search error:", nameError);
      return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }

    // Fetch abbreviation matches
    const { data: abbreviationMatches, error: abbreviationError } =
      await supabase
        .from("universities")
        .select("id, name, country, state, abbreviations")
        .not("abbreviations", "is", null)
        .ilike("abbreviations", `%${query}%`)
        .limit(200);

    if (abbreviationError) {
      console.error(
        "[Universities] Abbreviation search error:",
        abbreviationError,
      );
      return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }

    const mergedById = new Map<
      number,
      {
        id: number;
        name: string;
        country: string;
        state: string | null;
        abbreviations: string | null;
      }
    >();
    for (const uni of nameMatches || []) {
      mergedById.set(uni.id, uni);
    }
    for (const uni of abbreviationMatches || []) {
      mergedById.set(uni.id, uni);
    }

    const rankUniversity = (uni: {
      name: string;
      abbreviations: string | null;
    }) => {
      const normalizedName = uni.name.toLowerCase();
      const abbreviationTokens = (uni.abbreviations || "")
        .split(",")
        .map((token) => token.trim().toLowerCase())
        .filter(Boolean);

      if (abbreviationTokens.some((token) => token === query)) return 0;
      if (abbreviationTokens.some((token) => token.startsWith(query))) return 1;
      if (normalizedName.startsWith(query)) return 2;
      if (abbreviationTokens.some((token) => token.includes(query))) return 3;
      return 4;
    };

    const sortedUniversities = Array.from(mergedById.values()).sort((a, b) => {
      const rankDelta = rankUniversity(a) - rankUniversity(b);
      if (rankDelta !== 0) return rankDelta;
      return a.name.localeCompare(b.name);
    });

    const total = sortedUniversities.length;
    const universities = sortedUniversities.slice(offset, offset + limit);

    return NextResponse.json({
      universities,
      total,
      offset,
      limit,
    });
  } catch (error) {
    console.error("[Universities] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
