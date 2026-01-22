import { NextRequest, NextResponse } from "next/server";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || "";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
  }

  if (!GOOGLE_PLACES_API_KEY) {
    return NextResponse.json(
      { error: "Google Places API key not configured" },
      { status: 500 }
    );
  }

  try {
    // Use Google Places Text Search API
    const searchUrl = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
    searchUrl.searchParams.set("query", query);
    searchUrl.searchParams.set("key", GOOGLE_PLACES_API_KEY);

    const response = await fetch(searchUrl.toString());
    const data = await response.json();

    if (data.status === "REQUEST_DENIED") {
      return NextResponse.json(
        { error: "Google Places API request denied. Check API key." },
        { status: 403 }
      );
    }

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      return NextResponse.json(
        { error: `Google Places API error: ${data.status}` },
        { status: 500 }
      );
    }

    const results = (data.results || []).map((place: Record<string, unknown>) => ({
      placeId: place.place_id,
      name: place.name,
      address: place.formatted_address,
      location: place.geometry && typeof place.geometry === "object" && "location" in place.geometry
        ? (place.geometry as { location: { lat: number; lng: number } }).location
        : null,
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      types: place.types,
      businessStatus: place.business_status,
      photos: place.photos
        ? (place.photos as Array<{ photo_reference: string }>).slice(0, 1).map((p) => ({
            reference: p.photo_reference,
          }))
        : [],
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Google Places search error:", error);
    return NextResponse.json(
      { error: "Failed to search Google Places" },
      { status: 500 }
    );
  }
}
