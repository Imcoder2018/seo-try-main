import { NextRequest, NextResponse } from "next/server";

interface ScrapedBusinessData {
  businessName: string;
  address: string;
  phone: string;
  website: string;
  rating: string;
  reviewCount: string;
  primaryCategory: string;
  additionalCategories: string;
  photoCount: string;
  hasWorkHours: boolean;
  workHours: string;
  isClaimed: boolean;
  latitude?: string;
  longitude?: string;
  placeId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate it's a Google Maps URL
    if (!url.includes("google.com/maps") && !url.includes("maps.google.com") && !url.includes("goo.gl/maps")) {
      return NextResponse.json(
        { error: "Please provide a valid Google Maps URL" },
        { status: 400 }
      );
    }

    // Extract data from URL first
    const urlData = extractFromUrl(url);

    // Fetch the Google Maps page
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Cache-Control": "no-cache",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      // Even if fetch fails, return URL-extracted data
      if (urlData.businessName) {
        return NextResponse.json({ data: urlData });
      }
      return NextResponse.json(
        { error: "Failed to fetch the Google Maps page" },
        { status: 500 }
      );
    }

    const html = await response.text();
    
    // Extract business data from HTML and merge with URL data
    const htmlData = extractBusinessData(html, url);
    
    // Merge data, preferring HTML data over URL data
    const businessData: ScrapedBusinessData = {
      ...urlData,
      ...Object.fromEntries(
        Object.entries(htmlData).filter(([, value]) => value && value !== "0" && value !== "")
      ),
    };

    return NextResponse.json({ data: businessData });
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json(
      { error: "Failed to scrape business data. Please enter details manually." },
      { status: 500 }
    );
  }
}

function extractFromUrl(url: string): ScrapedBusinessData {
  const data: ScrapedBusinessData = {
    businessName: "",
    address: "",
    phone: "",
    website: "",
    rating: "",
    reviewCount: "",
    primaryCategory: "",
    additionalCategories: "",
    photoCount: "0",
    hasWorkHours: false,
    workHours: "",
    isClaimed: false,
  };

  try {
    // Extract business name from URL path
    // Format: /maps/place/Business+Name/@lat,lng
    const placeMatch = url.match(/\/place\/([^/@]+)/);
    if (placeMatch) {
      data.businessName = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
    }

    // Extract coordinates
    const coordsMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordsMatch) {
      data.latitude = coordsMatch[1];
      data.longitude = coordsMatch[2];
    }

    // Extract from query parameters
    const urlObj = new URL(url);
    const query = urlObj.searchParams.get("q");
    if (query && !data.businessName) {
      data.businessName = query.replace(/\+/g, " ");
    }

    // Extract place_id if present
    const placeId = urlObj.searchParams.get("place_id");
    if (placeId) {
      data.placeId = placeId;
    }

    // Try to extract from CID parameter
    const cid = urlObj.searchParams.get("cid");
    if (cid) {
      data.placeId = cid;
    }

  } catch (error) {
    console.error("Error extracting from URL:", error);
  }

  return data;
}

function extractBusinessData(html: string, url: string): ScrapedBusinessData {
  const data: ScrapedBusinessData = {
    businessName: "",
    address: "",
    phone: "",
    website: "",
    rating: "",
    reviewCount: "",
    primaryCategory: "",
    additionalCategories: "",
    photoCount: "0",
    hasWorkHours: false,
    workHours: "",
    isClaimed: false,
  };

  try {
    // Extract business name from title or meta tags
    const titleMatch = html.match(/<title[^>]*>([^<]+)</i);
    if (titleMatch) {
      // Title format is usually "Business Name - Google Maps"
      const title = titleMatch[1].replace(/ - Google Maps$/i, "").replace(/ · Google Maps$/i, "").trim();
      if (title && !title.includes("Google Maps")) {
        data.businessName = title.split(" · ")[0].trim();
      }
    }

    // Try to extract from og:title
    const ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i) ||
                         html.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:title"/i);
    if (ogTitleMatch && !data.businessName) {
      data.businessName = ogTitleMatch[1].split(" · ")[0].trim();
    }

    // Extract rating - look for patterns like "4.5" followed by stars or rating indicators
    const ratingPatterns = [
      /(\d+\.?\d*)\s*stars?/i,
      /"ratingValue"\s*:\s*"?(\d+\.?\d*)"?/i,
      /"aggregateRating"[^}]*"ratingValue"\s*:\s*"?(\d+\.?\d*)"?/i,
      /aria-label="[^"]*(\d+\.?\d*)\s*stars?/i,
      /(\d+\.\d)\s*\(\d+\)/,
    ];
    
    for (const pattern of ratingPatterns) {
      const match = html.match(pattern);
      if (match && parseFloat(match[1]) >= 1 && parseFloat(match[1]) <= 5) {
        data.rating = match[1];
        break;
      }
    }

    // Extract review count
    const reviewPatterns = [
      /"reviewCount"\s*:\s*"?(\d+)"?/i,
      /"userRatingsTotal"\s*:\s*"?(\d+)"?/i,
      /(\d+)\s*reviews?/i,
      /\((\d+)\)/,
      /(\d{1,3}(?:,\d{3})*)\s*reviews?/i,
    ];
    
    for (const pattern of reviewPatterns) {
      const match = html.match(pattern);
      if (match) {
        data.reviewCount = match[1].replace(/,/g, "");
        break;
      }
    }

    // Extract address
    const addressPatterns = [
      /"address"\s*:\s*"([^"]+)"/i,
      /"streetAddress"\s*:\s*"([^"]+)"/i,
      /data-item-id="address"[^>]*>([^<]+)</i,
      /"formatted_address"\s*:\s*"([^"]+)"/i,
    ];
    
    for (const pattern of addressPatterns) {
      const match = html.match(pattern);
      if (match) {
        data.address = decodeHTMLEntities(match[1]);
        break;
      }
    }

    // Extract phone number
    const phonePatterns = [
      /"telephone"\s*:\s*"([^"]+)"/i,
      /data-item-id="phone[^"]*"[^>]*>([^<]+)</i,
      /href="tel:([^"]+)"/i,
      /"formatted_phone_number"\s*:\s*"([^"]+)"/i,
      /(\+\d{1,3}[\s-]?\d{2,4}[\s-]?\d{3,4}[\s-]?\d{3,4})/,
    ];
    
    for (const pattern of phonePatterns) {
      const match = html.match(pattern);
      if (match) {
        data.phone = match[1].trim();
        break;
      }
    }

    // Extract website
    const websitePatterns = [
      /"url"\s*:\s*"(https?:\/\/(?!(?:www\.)?google\.com)[^"]+)"/i,
      /data-item-id="authority"[^>]*href="([^"]+)"/i,
      /"website"\s*:\s*"([^"]+)"/i,
    ];
    
    for (const pattern of websitePatterns) {
      const match = html.match(pattern);
      if (match && !match[1].includes("google.com")) {
        data.website = match[1];
        break;
      }
    }

    // Extract category
    const categoryPatterns = [
      /"@type"\s*:\s*"([^"]+)"/gi,
      /data-item-id="category"[^>]*>([^<]+)</i,
      /"category"\s*:\s*"([^"]+)"/i,
      /button[^>]*jsaction="[^"]*category[^"]*"[^>]*>([^<]+)</i,
    ];
    
    // Try to find category from structured data or HTML
    const typeMatch = html.match(/"@type"\s*:\s*"(LocalBusiness|Restaurant|Store|[^"]+Business[^"]*)"/i);
    if (typeMatch) {
      data.primaryCategory = typeMatch[1].replace(/([A-Z])/g, " $1").trim();
    }

    // Look for category in the page content
    const catMatch = html.match(/aria-label="[^"]*"[^>]*>([A-Za-z\s&]+(?:Restaurant|Store|Shop|Service|Business|Cafe|Bar|Hotel|Salon|Gym|Clinic|Hospital|School|Agency|Company))/i);
    if (catMatch && !data.primaryCategory) {
      data.primaryCategory = catMatch[1].trim();
    }

    // Check for opening hours
    if (html.includes("opening_hours") || html.includes("openingHours") || 
        html.includes("Open 24 hours") || html.includes("Opens") || 
        html.includes("Closes") || html.match(/\d{1,2}:\d{2}\s*[AP]M/i)) {
      data.hasWorkHours = true;
    }

    // Extract opening hours text if available
    const hoursMatch = html.match(/"openingHours"\s*:\s*\[([^\]]+)\]/i);
    if (hoursMatch) {
      data.workHours = hoursMatch[1].replace(/"/g, "").replace(/,/g, ", ");
      data.hasWorkHours = true;
    }

    // Try to count photos
    const photoMatches = html.match(/photos?\s*\((\d+)\)/i) || html.match(/"imageCount"\s*:\s*(\d+)/i);
    if (photoMatches) {
      data.photoCount = photoMatches[1];
    } else {
      // Estimate from image references
      const imageCount = (html.match(/googleusercontent\.com/g) || []).length;
      if (imageCount > 0) {
        data.photoCount = Math.min(imageCount, 50).toString();
      }
    }

    // Check if claimed (look for "Claim this business" text absence as indicator)
    data.isClaimed = !html.includes("Claim this business") && !html.includes("Own this business");

    // Extract coordinates from URL or page
    const coordsMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ||
                        html.match(/"latitude"\s*:\s*(-?\d+\.\d+)/) ||
                        html.match(/"lat"\s*:\s*(-?\d+\.\d+)/);
    if (coordsMatch) {
      data.latitude = coordsMatch[1];
      if (coordsMatch[2]) {
        data.longitude = coordsMatch[2];
      }
    }

    // Extract place_id if available
    const placeIdMatch = url.match(/place_id[=:]([^&]+)/) || 
                         html.match(/"place_id"\s*:\s*"([^"]+)"/i);
    if (placeIdMatch) {
      data.placeId = placeIdMatch[1];
    }

  } catch (error) {
    console.error("Error parsing HTML:", error);
  }

  return data;
}

function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\\u0026/g, "&")
    .replace(/\\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
