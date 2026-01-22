import { NextRequest, NextResponse } from "next/server";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || "";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const placeId = searchParams.get("placeId");

  if (!placeId) {
    return NextResponse.json({ error: "placeId parameter is required" }, { status: 400 });
  }

  if (!GOOGLE_PLACES_API_KEY) {
    return NextResponse.json(
      { error: "Google Places API key not configured" },
      { status: 500 }
    );
  }

  try {
    // Use Google Places Details API
    const detailsUrl = new URL("https://maps.googleapis.com/maps/api/place/details/json");
    detailsUrl.searchParams.set("place_id", placeId);
    detailsUrl.searchParams.set("key", GOOGLE_PLACES_API_KEY);
    detailsUrl.searchParams.set(
      "fields",
      "place_id,name,formatted_address,formatted_phone_number,international_phone_number,website,url,rating,user_ratings_total,reviews,photos,opening_hours,business_status,types,address_components,geometry,price_level,cid"
    );

    const response = await fetch(detailsUrl.toString());
    const data = await response.json();

    if (data.status === "REQUEST_DENIED") {
      return NextResponse.json(
        { error: "Google Places API request denied. Check API key." },
        { status: 403 }
      );
    }

    if (data.status !== "OK") {
      return NextResponse.json(
        { error: `Google Places API error: ${data.status}` },
        { status: 500 }
      );
    }

    const place = data.result;

    // Calculate audit score based on completeness
    const auditResult = calculateAuditScore(place);

    return NextResponse.json({
      business: {
        placeId: place.place_id,
        cid: place.cid,
        name: place.name,
        address: place.formatted_address,
        phone: place.formatted_phone_number || place.international_phone_number,
        website: place.website,
        googleUrl: place.url,
        rating: place.rating,
        totalReviews: place.user_ratings_total,
        businessStatus: place.business_status,
        types: place.types,
        priceLevel: place.price_level,
        location: place.geometry?.location,
        openingHours: place.opening_hours,
        photos: place.photos?.slice(0, 10).map((p: { photo_reference: string }) => ({
          reference: p.photo_reference,
          url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`,
        })),
        reviews: place.reviews?.slice(0, 5).map((r: {
          author_name: string;
          rating: number;
          relative_time_description: string;
          text: string;
          time: number;
        }) => ({
          author: r.author_name,
          rating: r.rating,
          relativeTime: r.relative_time_description,
          text: r.text,
          time: r.time,
        })),
      },
      audit: auditResult,
    });
  } catch (error) {
    console.error("Google Places details error:", error);
    return NextResponse.json(
      { error: "Failed to fetch business details" },
      { status: 500 }
    );
  }
}

interface Place {
  name?: string;
  types?: string[];
  formatted_address?: string;
  website?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  opening_hours?: {
    weekday_text?: string[];
    periods?: unknown[];
  };
  photos?: Array<{ photo_reference: string }>;
  rating?: number;
  user_ratings_total?: number;
  reviews?: Array<{
    author_name: string;
    rating: number;
    relative_time_description: string;
    text: string;
    time: number;
  }>;
}

function calculateAuditScore(place: Place) {
  const checks = {
    profileCompleteness: [] as Array<{
      id: string;
      name: string;
      status: "pass" | "fail";
      message: string;
      value?: string;
      workHours?: Record<string, string>;
    }>,
    reviewChecks: [] as Array<{
      id: string;
      name: string;
      status: "pass" | "fail";
      message: string;
      value?: string;
    }>,
    recommendations: [] as string[],
  };

  let totalChecks = 0;
  let passedChecks = 0;

  // Primary Category
  totalChecks++;
  if (place.types && place.types.length > 0) {
    passedChecks++;
    checks.profileCompleteness.push({
      id: "primary-category",
      name: "Primary Category",
      status: "pass",
      message: "Your business has a Primary Category assigned.",
      value: place.types[0].replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    });
  } else {
    checks.profileCompleteness.push({
      id: "primary-category",
      name: "Primary Category",
      status: "fail",
      message: "Your business does not have a Primary Category assigned.",
    });
    checks.recommendations.push("Assign a Primary Category to your Business Profile.");
  }

  // Additional Categories
  totalChecks++;
  if (place.types && place.types.length > 1) {
    passedChecks++;
    checks.profileCompleteness.push({
      id: "additional-categories",
      name: "Additional Categories",
      status: "pass",
      message: "Your business has Additional Categories assigned.",
      value: `${place.types.length - 1} additional categories`,
    });
  } else {
    checks.profileCompleteness.push({
      id: "additional-categories",
      name: "Additional Categories",
      status: "fail",
      message: "Your business does not have Additional Categories assigned.",
    });
    checks.recommendations.push("Assign Additional Categories to your Business Profile.");
  }

  // Address
  totalChecks++;
  if (place.formatted_address) {
    passedChecks++;
    checks.profileCompleteness.push({
      id: "address",
      name: "Address",
      status: "pass",
      message: "Your business has a full address provided.",
      value: place.formatted_address,
    });
  } else {
    checks.profileCompleteness.push({
      id: "address",
      name: "Address",
      status: "fail",
      message: "Your business does not have an address provided.",
    });
    checks.recommendations.push("Add a complete address to your Business Profile.");
  }

  // Website
  totalChecks++;
  if (place.website) {
    passedChecks++;
    checks.profileCompleteness.push({
      id: "website",
      name: "Website",
      status: "pass",
      message: "Your business has a website URL provided.",
      value: place.website,
    });
  } else {
    checks.profileCompleteness.push({
      id: "website",
      name: "Website",
      status: "fail",
      message: "Your business does not have a website URL provided.",
    });
    checks.recommendations.push("Add a business website to your Business Profile.");
  }

  // Phone Number
  totalChecks++;
  if (place.formatted_phone_number || place.international_phone_number) {
    passedChecks++;
    checks.profileCompleteness.push({
      id: "phone",
      name: "Phone Number",
      status: "pass",
      message: "Your business has a phone number provided.",
      value: place.formatted_phone_number || place.international_phone_number,
    });
  } else {
    checks.profileCompleteness.push({
      id: "phone",
      name: "Phone Number",
      status: "fail",
      message: "Your business does not have a phone number provided.",
    });
    checks.recommendations.push("Add a phone number to your Business Profile.");
  }

  // Work Hours
  totalChecks++;
  if (place.opening_hours?.weekday_text && place.opening_hours.weekday_text.length > 0) {
    passedChecks++;
    const workHours: Record<string, string> = {};
    place.opening_hours.weekday_text.forEach((day: string) => {
      const [dayName, ...hours] = day.split(": ");
      workHours[dayName] = hours.join(": ");
    });
    checks.profileCompleteness.push({
      id: "work-hours",
      name: "Work Hours",
      status: "pass",
      message: "Your business has work hours provided.",
      workHours,
    });
  } else {
    checks.profileCompleteness.push({
      id: "work-hours",
      name: "Work Hours",
      status: "fail",
      message: "Your business does not have work hours provided.",
    });
    checks.recommendations.push("Add business hours to your Business Profile.");
  }

  // Photos
  totalChecks++;
  const photoCount = place.photos?.length || 0;
  if (photoCount >= 5) {
    passedChecks++;
    checks.profileCompleteness.push({
      id: "photos",
      name: "Photos",
      status: "pass",
      message: "Your business has a sufficient number of photos provided.",
      value: `${photoCount} photos`,
    });
  } else {
    checks.profileCompleteness.push({
      id: "photos",
      name: "Photos",
      status: "fail",
      message: photoCount > 0
        ? `Your business has only ${photoCount} photos. We recommend at least 5.`
        : "Your business does not have any photos.",
    });
    checks.recommendations.push("Add more photos to your Business Profile (at least 5 recommended).");
  }

  // Review Score
  totalChecks++;
  if (place.rating && place.rating >= 4.0) {
    passedChecks++;
    checks.reviewChecks.push({
      id: "review-score",
      name: "Review Score",
      status: "pass",
      message: "Your business has a good review score.",
      value: `${place.rating} stars`,
    });
  } else if (place.rating) {
    checks.reviewChecks.push({
      id: "review-score",
      name: "Review Score",
      status: "fail",
      message: "Your business's review score could be improved.",
      value: `${place.rating} stars`,
    });
    checks.recommendations.push("Improve your review score by providing excellent customer service.");
  } else {
    checks.reviewChecks.push({
      id: "review-score",
      name: "Review Score",
      status: "fail",
      message: "Your business does not have any reviews yet.",
    });
    checks.recommendations.push("Encourage customers to leave reviews on your Business Profile.");
  }

  // Number of Reviews
  totalChecks++;
  const reviewCount = place.user_ratings_total || 0;
  if (reviewCount >= 10) {
    passedChecks++;
    checks.reviewChecks.push({
      id: "num-reviews",
      name: "Number of Reviews",
      status: "pass",
      message: "Your business has a good number of reviews.",
      value: `${reviewCount} reviews`,
    });
  } else {
    checks.reviewChecks.push({
      id: "num-reviews",
      name: "Number of Reviews",
      status: "fail",
      message: reviewCount > 0
        ? `Your business has only ${reviewCount} reviews.`
        : "Your business does not have any reviews.",
      value: `${reviewCount} reviews`,
    });
    checks.recommendations.push("Encourage more customers to leave reviews for your business.");
  }

  // Calculate overall score
  const score = Math.round((passedChecks / totalChecks) * 100);

  // Categorize reviews
  const goodReviews = (place.reviews || [])
    .filter((r: { rating: number }) => r.rating >= 4)
    .map((r: {
      rating: number;
      relative_time_description: string;
      text: string;
    }) => ({
      rating: r.rating,
      date: r.relative_time_description,
      comment: r.text,
    }));

  const badReviews = (place.reviews || [])
    .filter((r: { rating: number }) => r.rating < 4)
    .map((r: {
      rating: number;
      relative_time_description: string;
      text: string;
    }) => ({
      rating: r.rating,
      date: r.relative_time_description,
      comment: r.text,
    }));

  return {
    score,
    profileCompleteness: checks.profileCompleteness,
    reviewChecks: checks.reviewChecks,
    recommendations: checks.recommendations,
    recentGoodReviews: goodReviews,
    recentBadReviews: badReviews,
  };
}
