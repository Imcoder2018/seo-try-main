import * as cheerio from "cheerio";
import type { Check, CategoryResult, PageData } from "./types";
import { calculateGrade } from "../utils";

// Common US cities for keyword extraction
const US_CITIES = new Set([
  "new york", "los angeles", "chicago", "houston", "phoenix", "philadelphia",
  "san antonio", "san diego", "dallas", "san jose", "austin", "jacksonville",
  "fort worth", "columbus", "charlotte", "san francisco", "indianapolis", "seattle",
  "denver", "washington", "boston", "el paso", "detroit", "nashville", "portland",
  "memphis", "oklahoma city", "las vegas", "louisville", "baltimore", "milwaukee",
  "albuquerque", "tucson", "fresno", "mesa", "sacramento", "atlanta", "kansas city",
  "colorado springs", "miami", "raleigh", "omaha", "long beach", "virginia beach",
  "oakland", "minneapolis", "tulsa", "arlington", "tampa", "new orleans", "wichita",
  "cleveland", "bakersfield", "aurora", "anaheim", "honolulu", "santa ana", "riverside",
  "corpus christi", "lexington", "stockton", "henderson", "saint paul", "st. louis",
  "cincinnati", "pittsburgh", "greensboro", "anchorage", "plano", "lincoln", "orlando",
  "irvine", "newark", "toledo", "durham", "chula vista", "fort wayne", "jersey city",
  "st. petersburg", "laredo", "scottsdale", "chandler", "madison", "lubbock", "reno",
  "buffalo", "gilbert", "glendale", "north las vegas", "winston-salem", "chesapeake",
  "norfolk", "fremont", "garland", "irving", "hialeah", "richmond", "boise", "spokane",
  "baton rouge", "tacoma", "san bernardino", "modesto", "fontana", "des moines",
  "moreno valley", "santa clarita", "fayetteville", "birmingham", "oxnard", "rochester",
  "port st. lucie", "grand rapids", "huntsville", "salt lake city", "frisco", "yonkers",
  "amarillo", "glendale", "huntington beach", "mckinney", "montgomery", "augusta",
  "aurora", "akron", "little rock", "tempe", "overland park", "grand prairie", "tallahassee",
  "cape coral", "mobile", "knoxville", "shreveport", "worcester", "ontario", "vancouver",
  "sioux falls", "chattanooga", "brownsville", "fort lauderdale", "providence", "newport news",
]);

// US States and abbreviations
const US_STATES: Record<string, string> = {
  "alabama": "AL", "alaska": "AK", "arizona": "AZ", "arkansas": "AR", "california": "CA",
  "colorado": "CO", "connecticut": "CT", "delaware": "DE", "florida": "FL", "georgia": "GA",
  "hawaii": "HI", "idaho": "ID", "illinois": "IL", "indiana": "IN", "iowa": "IA",
  "kansas": "KS", "kentucky": "KY", "louisiana": "LA", "maine": "ME", "maryland": "MD",
  "massachusetts": "MA", "michigan": "MI", "minnesota": "MN", "mississippi": "MS", "missouri": "MO",
  "montana": "MT", "nebraska": "NE", "nevada": "NV", "new hampshire": "NH", "new jersey": "NJ",
  "new mexico": "NM", "new york": "NY", "north carolina": "NC", "north dakota": "ND", "ohio": "OH",
  "oklahoma": "OK", "oregon": "OR", "pennsylvania": "PA", "rhode island": "RI", "south carolina": "SC",
  "south dakota": "SD", "tennessee": "TN", "texas": "TX", "utah": "UT", "vermont": "VT",
  "virginia": "VA", "washington": "WA", "west virginia": "WV", "wisconsin": "WI", "wyoming": "WY",
};

// Service-related keywords for local businesses
const SERVICE_KEYWORDS = [
  "plumber", "plumbing", "electrician", "electrical", "hvac", "heating", "cooling", "air conditioning",
  "roofing", "roofer", "contractor", "landscaping", "landscaper", "lawn care", "cleaning", "cleaner",
  "maid", "handyman", "painter", "painting", "flooring", "carpet", "tile", "remodeling", "renovation",
  "repair", "installation", "maintenance", "service", "emergency", "24/7", "same day", "licensed",
  "insured", "certified", "professional", "expert", "specialist", "technician", "mechanic", "auto",
  "dental", "dentist", "doctor", "medical", "clinic", "therapy", "therapist", "attorney", "lawyer",
  "legal", "accounting", "accountant", "tax", "real estate", "realtor", "insurance", "agent",
  "restaurant", "cafe", "bakery", "salon", "spa", "gym", "fitness", "yoga", "pet", "veterinary",
  "photography", "wedding", "event", "catering", "moving", "storage", "pest control", "exterminator",
];

// Detect contact page
function detectContactPage($: cheerio.CheerioAPI): {
  hasContactPage: boolean;
  contactPageUrl: string | null;
  hasContactForm: boolean;
} {
  const links = $("a");
  let contactPageUrl: string | null = null;
  
  links.each((_, el) => {
    const href = $(el).attr("href")?.toLowerCase() || "";
    const text = $(el).text().toLowerCase();
    if (href.includes("contact") || text.includes("contact us") || text === "contact") {
      contactPageUrl = $(el).attr("href") || null;
      return false;
    }
  });
  
  const hasContactForm = $("form").filter((_, el) => {
    const formHtml = $(el).html()?.toLowerCase() || "";
    return formHtml.includes("email") || formHtml.includes("message") || formHtml.includes("name");
  }).length > 0;
  
  return {
    hasContactPage: !!contactPageUrl,
    contactPageUrl,
    hasContactForm,
  };
}

// Detect phone numbers and click-to-call
function detectPhoneNumbers($: cheerio.CheerioAPI, html: string): {
  phones: string[];
  hasClickToCall: boolean;
  clickToCallCount: number;
  primaryPhone: string | null;
} {
  const phoneRegex = /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
  const bodyText = $("body").text();
  const matches = bodyText.match(phoneRegex) || [];
  const uniquePhones = [...new Set(matches)];
  
  // Check for tel: links (click-to-call)
  const telLinks = $('a[href^="tel:"]');
  const clickToCallCount = telLinks.length;
  
  let primaryPhone: string | null = null;
  if (telLinks.length > 0) {
    primaryPhone = telLinks.first().attr("href")?.replace("tel:", "") || null;
  } else if (uniquePhones.length > 0) {
    primaryPhone = uniquePhones[0];
  }
  
  return {
    phones: uniquePhones,
    hasClickToCall: clickToCallCount > 0,
    clickToCallCount,
    primaryPhone,
  };
}

// Detect physical address
function detectAddress($: cheerio.CheerioAPI): {
  hasAddress: boolean;
  hasFullAddress: boolean;
  addressText: string | null;
  hasAddressSchema: boolean;
  components: {
    street: boolean;
    city: boolean;
    state: boolean;
    zip: boolean;
  };
} {
  const bodyText = $("body").text();
  const html = $.html();
  
  // Check for address schema
  const hasAddressSchema = html.includes("PostalAddress") || 
    $('[itemprop="address"]').length > 0 ||
    $('[itemtype*="PostalAddress"]').length > 0;
  
  // Address patterns
  const streetPattern = /\d+\s+[\w\s]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|way|court|ct|circle|cir|place|pl)\b/i;
  const zipPattern = /\b\d{5}(?:-\d{4})?\b/;
  const statePattern = new RegExp(`\\b(${Object.keys(US_STATES).join("|")}|${Object.values(US_STATES).join("|")})\\b`, "i");
  
  const hasStreet = streetPattern.test(bodyText);
  const hasZip = zipPattern.test(bodyText);
  const hasState = statePattern.test(bodyText);
  
  // Check for city mentions
  let hasCity = false;
  const bodyTextLower = bodyText.toLowerCase();
  for (const city of US_CITIES) {
    if (bodyTextLower.includes(city)) {
      hasCity = true;
      break;
    }
  }
  
  const hasFullAddress = hasStreet && hasCity && hasState && hasZip;
  const hasAddress = hasStreet || hasAddressSchema || (hasCity && hasState);
  
  // Try to extract address text
  let addressText: string | null = null;
  const addressEl = $('[itemprop="address"], .address, #address, [class*="address"]').first();
  if (addressEl.length) {
    addressText = addressEl.text().trim().substring(0, 200);
  }
  
  return {
    hasAddress,
    hasFullAddress,
    addressText,
    hasAddressSchema,
    components: {
      street: hasStreet,
      city: hasCity,
      state: hasState,
      zip: hasZip,
    },
  };
}

// Detect Google Maps embed
function detectGoogleMap($: cheerio.CheerioAPI): {
  hasMap: boolean;
  mapType: "embed" | "api" | "static" | null;
  hasDirectionsLink: boolean;
} {
  const html = $.html();
  const iframes = $("iframe");
  
  let hasMap = false;
  let mapType: "embed" | "api" | "static" | null = null;
  
  // Check for Google Maps iframe embed
  iframes.each((_, el) => {
    const src = $(el).attr("src") || "";
    if (src.includes("google.com/maps") || src.includes("maps.google.com")) {
      hasMap = true;
      mapType = "embed";
      return false;
    }
  });
  
  // Check for Google Maps API
  if (!hasMap && (html.includes("maps.googleapis.com") || html.includes("google.maps"))) {
    hasMap = true;
    mapType = "api";
  }
  
  // Check for static map image
  if (!hasMap && html.includes("maps.googleapis.com/maps/api/staticmap")) {
    hasMap = true;
    mapType = "static";
  }
  
  // Check for directions link
  const hasDirectionsLink = $('a[href*="maps.google.com/maps/dir"], a[href*="google.com/maps/dir"]').length > 0 ||
    $('a:contains("Get Directions"), a:contains("Directions")').length > 0;
  
  return {
    hasMap,
    mapType,
    hasDirectionsLink,
  };
}

// Detect business hours
function detectBusinessHours($: cheerio.CheerioAPI): {
  hasHours: boolean;
  hasHoursSchema: boolean;
  hoursText: string | null;
  is24Hours: boolean;
} {
  const html = $.html().toLowerCase();
  const bodyText = $("body").text().toLowerCase();
  
  // Check for hours schema
  const hasHoursSchema = html.includes("openinghours") || 
    html.includes("openinghoursspecification") ||
    $('[itemprop="openingHours"]').length > 0;
  
  // Check for hours text patterns
  const hoursPatterns = [
    /\b(mon|tue|wed|thu|fri|sat|sun)[a-z]*\s*[-–:]\s*\d{1,2}(:\d{2})?\s*(am|pm|a\.m\.|p\.m\.)?/i,
    /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s*[-–:]\s*\d{1,2}/i,
    /\bhours?\s*of\s*operation\b/i,
    /\bbusiness\s*hours?\b/i,
    /\bopen\s*(from|daily|hours?)\b/i,
    /\b\d{1,2}(:\d{2})?\s*(am|pm)\s*[-–]\s*\d{1,2}(:\d{2})?\s*(am|pm)\b/i,
  ];
  
  const hasHours = hoursPatterns.some(p => p.test(bodyText)) || hasHoursSchema;
  const is24Hours = bodyText.includes("24/7") || bodyText.includes("24 hours") || bodyText.includes("open 24");
  
  // Try to extract hours text
  let hoursText: string | null = null;
  const hoursEl = $('[itemprop="openingHours"], .hours, #hours, .business-hours, [class*="hours"]').first();
  if (hoursEl.length) {
    hoursText = hoursEl.text().trim().substring(0, 200);
  }
  
  return {
    hasHours,
    hasHoursSchema,
    hoursText,
    is24Hours,
  };
}

// Detect service area information
function detectServiceAreas($: cheerio.CheerioAPI, html: string): {
  hasServiceAreaPage: boolean;
  serviceAreas: string[];
  hasServiceAreaSchema: boolean;
  hasMultipleLocations: boolean;
} {
  const links = $("a");
  const bodyTextLower = $("body").text().toLowerCase();
  
  // Check for service area links
  let hasServiceAreaPage = false;
  links.each((_, el) => {
    const href = $(el).attr("href")?.toLowerCase() || "";
    const text = $(el).text().toLowerCase();
    if (href.includes("service-area") || href.includes("areas-served") || href.includes("locations") ||
        text.includes("service area") || text.includes("areas we serve") || text.includes("our locations")) {
      hasServiceAreaPage = true;
      return false;
    }
  });
  
  // Check for service area schema
  const hasServiceAreaSchema = html.toLowerCase().includes("servicearea") || 
    html.toLowerCase().includes("areaserved");
  
  // Extract mentioned cities
  const serviceAreas: string[] = [];
  for (const city of US_CITIES) {
    if (bodyTextLower.includes(city)) {
      serviceAreas.push(city.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "));
    }
    if (serviceAreas.length >= 10) break;
  }
  
  // Check for multiple locations
  const hasMultipleLocations = 
    $('[itemtype*="LocalBusiness"]').length > 1 ||
    (bodyTextLower.match(/location/g) || []).length > 2 ||
    links.filter((_, el) => $(el).text().toLowerCase().includes("location")).length > 1;
  
  return {
    hasServiceAreaPage,
    serviceAreas,
    hasServiceAreaSchema,
    hasMultipleLocations,
  };
}

// Detect reviews/testimonials
function detectReviews($: cheerio.CheerioAPI): {
  hasReviews: boolean;
  hasReviewSchema: boolean;
  reviewCount: number;
  hasStarRatings: boolean;
  hasGoogleReviewsLink: boolean;
} {
  const html = $.html().toLowerCase();
  
  // Check for review elements
  const reviewSelectors = [
    ".review", ".testimonial", ".customer-review", ".client-review",
    "[itemprop='review']", ".reviews", "#reviews", ".testimonials",
    "[class*='testimonial']", "[class*='review']"
  ];
  
  let reviewCount = 0;
  reviewSelectors.forEach(sel => {
    reviewCount += $(sel).length;
  });
  
  // Check for review schema
  const hasReviewSchema = html.includes('"review"') || 
    html.includes('"aggregaterating"') ||
    $('[itemprop="review"]').length > 0 ||
    $('[itemprop="aggregateRating"]').length > 0;
  
  // Check for star ratings
  const hasStarRatings = 
    $('[class*="star"], [class*="rating"], .stars').length > 0 ||
    html.includes("★") || html.includes("⭐");
  
  // Check for Google reviews link
  const hasGoogleReviewsLink = 
    $('a[href*="google.com/maps/place"], a[href*="search.google.com/local/reviews"]').length > 0;
  
  return {
    hasReviews: reviewCount > 0 || hasReviewSchema,
    hasReviewSchema,
    reviewCount: Math.min(reviewCount, 50),
    hasStarRatings,
    hasGoogleReviewsLink,
  };
}

// Extract local keywords
function extractLocalKeywords($: cheerio.CheerioAPI): {
  cities: string[];
  states: string[];
  services: string[];
  localPhrases: string[];
  nearMeOptimized: boolean;
} {
  const bodyText = $("body").text().toLowerCase();
  const title = $("title").text().toLowerCase();
  const metaDesc = $('meta[name="description"]').attr("content")?.toLowerCase() || "";
  const h1 = $("h1").text().toLowerCase();
  const allText = `${title} ${metaDesc} ${h1} ${bodyText}`;
  
  const cities: string[] = [];
  const states: string[] = [];
  const services: string[] = [];
  
  // Extract cities
  for (const city of US_CITIES) {
    if (allText.includes(city)) {
      cities.push(city.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "));
    }
    if (cities.length >= 5) break;
  }
  
  // Extract states
  for (const [state, abbr] of Object.entries(US_STATES)) {
    if (allText.includes(state) || allText.includes(abbr.toLowerCase())) {
      states.push(state.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "));
    }
    if (states.length >= 3) break;
  }
  
  // Extract services
  for (const service of SERVICE_KEYWORDS) {
    if (allText.includes(service)) {
      services.push(service.charAt(0).toUpperCase() + service.slice(1));
    }
    if (services.length >= 8) break;
  }
  
  // Check for local phrases
  const localPhrases: string[] = [];
  const localPatterns = [
    { pattern: /serving\s+[\w\s]+\s+area/i, phrase: "Serving [Area]" },
    { pattern: /locally\s+owned/i, phrase: "Locally Owned" },
    { pattern: /family[\s-]owned/i, phrase: "Family Owned" },
    { pattern: /years?\s+(?:of\s+)?experience/i, phrase: "Years of Experience" },
    { pattern: /licensed\s+and\s+insured/i, phrase: "Licensed and Insured" },
    { pattern: /free\s+(?:quote|estimate)/i, phrase: "Free Quote/Estimate" },
    { pattern: /same[\s-]day\s+service/i, phrase: "Same Day Service" },
    { pattern: /emergency\s+service/i, phrase: "Emergency Service" },
  ];
  
  localPatterns.forEach(({ pattern, phrase }) => {
    if (pattern.test(bodyText)) {
      localPhrases.push(phrase);
    }
  });
  
  // Check for "near me" optimization
  const nearMeOptimized = allText.includes("near me") || allText.includes("near you");
  
  return {
    cities,
    states,
    services,
    localPhrases,
    nearMeOptimized,
  };
}

// Detect GBP (Google Business Profile) link
function detectGBPLink($: cheerio.CheerioAPI): {
  hasGBPLink: boolean;
  gbpUrl: string | null;
} {
  const links = $("a");
  let gbpUrl: string | null = null;
  
  links.each((_, el) => {
    const href = $(el).attr("href") || "";
    if (href.includes("google.com/maps/place") || 
        href.includes("business.google.com") ||
        href.includes("g.page")) {
      gbpUrl = href;
      return false;
    }
  });
  
  return {
    hasGBPLink: !!gbpUrl,
    gbpUrl,
  };
}

// Enhanced Local Business Schema validation
function validateLocalBusinessSchema($: cheerio.CheerioAPI): {
  hasSchema: boolean;
  schemaType: string | null;
  completeness: number;
  missingFields: string[];
  schemaData: Record<string, unknown>;
} {
  const jsonLdScripts = $('script[type="application/ld+json"]');
  let schemaData: Record<string, unknown> = {};
  let schemaType: string | null = null;
  
  const requiredFields = [
    "name", "address", "telephone", "openingHours", "url", 
    "geo", "priceRange", "image", "areaServed"
  ];
  const foundFields: string[] = [];
  
  jsonLdScripts.each((_, el) => {
    try {
      const json = JSON.parse($(el).html() || "{}");
      const type = json["@type"] || "";
      
      if (type.includes("LocalBusiness") || type.includes("Organization") || 
          type.includes("Store") || type.includes("Restaurant") ||
          type.includes("Service") || type.includes("Professional")) {
        schemaType = type;
        schemaData = json;
        
        Object.keys(json).forEach(key => {
          if (requiredFields.includes(key.toLowerCase()) && json[key]) {
            foundFields.push(key);
          }
        });
        
        // Check nested address
        if (json.address) foundFields.push("address");
        if (json.geo || json.hasGeoCoordinates) foundFields.push("geo");
        
        return false;
      }
    } catch {}
  });
  
  const missingFields = requiredFields.filter(f => !foundFields.includes(f));
  const completeness = Math.round((foundFields.length / requiredFields.length) * 100);
  
  return {
    hasSchema: !!schemaType,
    schemaType,
    completeness,
    missingFields,
    schemaData,
  };
}

export function analyzeLocalSEO(data: PageData): CategoryResult {
  const $ = cheerio.load(data.html);
  const checks: Check[] = [];

  // 1. Contact Page Detection
  const contactInfo = detectContactPage($);
  const contactScore = [contactInfo.hasContactPage, contactInfo.hasContactForm].filter(Boolean).length * 50;
  checks.push({
    id: "contactPage",
    name: "Contact Page",
    status: contactInfo.hasContactPage ? "pass" : "fail",
    score: contactScore || 20,
    weight: 12,
    value: contactInfo,
    message: contactInfo.hasContactPage
      ? `Contact page found${contactInfo.hasContactForm ? " with contact form" : ""}`
      : "No contact page detected",
    recommendation: !contactInfo.hasContactPage
      ? "Add a dedicated contact page with full business information"
      : undefined,
  });

  // 2. Phone Number & Click-to-Call
  const phoneInfo = detectPhoneNumbers($, data.html);
  const phoneScore = phoneInfo.hasClickToCall ? 100 : phoneInfo.phones.length > 0 ? 60 : 0;
  checks.push({
    id: "clickToCall",
    name: "Phone & Click-to-Call",
    status: phoneInfo.hasClickToCall ? "pass" : phoneInfo.phones.length > 0 ? "warning" : "fail",
    score: phoneScore,
    weight: 15,
    value: phoneInfo,
    message: phoneInfo.hasClickToCall
      ? `Click-to-call enabled (${phoneInfo.clickToCallCount} tel: links)${phoneInfo.primaryPhone ? `: ${phoneInfo.primaryPhone}` : ""}`
      : phoneInfo.phones.length > 0
      ? `Phone found but no click-to-call: ${phoneInfo.phones[0]}`
      : "No phone number detected",
    recommendation: !phoneInfo.hasClickToCall
      ? "Add click-to-call phone links using tel: protocol for mobile users"
      : undefined,
  });

  // 3. Physical Address
  const addressInfo = detectAddress($);
  const addressScore = addressInfo.hasFullAddress ? 100 : addressInfo.hasAddress ? 60 : 0;
  checks.push({
    id: "physicalAddress",
    name: "Physical Address",
    status: addressInfo.hasFullAddress ? "pass" : addressInfo.hasAddress ? "warning" : "fail",
    score: addressScore,
    weight: 12,
    value: addressInfo,
    message: addressInfo.hasFullAddress
      ? `Full address detected${addressInfo.hasAddressSchema ? " with schema markup" : ""}`
      : addressInfo.hasAddress
      ? "Partial address found - missing some components"
      : "No physical address detected",
    recommendation: !addressInfo.hasFullAddress
      ? "Add complete physical address with street, city, state, and ZIP code"
      : !addressInfo.hasAddressSchema
      ? "Add PostalAddress schema markup to your address"
      : undefined,
  });

  // 4. Google Map Embed
  const mapInfo = detectGoogleMap($);
  const mapScore = mapInfo.hasMap ? 100 : mapInfo.hasDirectionsLink ? 50 : 0;
  checks.push({
    id: "googleMap",
    name: "Google Map",
    status: mapInfo.hasMap ? "pass" : mapInfo.hasDirectionsLink ? "warning" : "fail",
    score: mapScore,
    weight: 10,
    value: mapInfo,
    message: mapInfo.hasMap
      ? `Google Map ${mapInfo.mapType} detected${mapInfo.hasDirectionsLink ? " with directions link" : ""}`
      : mapInfo.hasDirectionsLink
      ? "Directions link found but no map embed"
      : "No Google Map found",
    recommendation: !mapInfo.hasMap
      ? "Add a Google Map embed to your contact page for better local trust signals"
      : !mapInfo.hasDirectionsLink
      ? "Add a 'Get Directions' link for better user experience"
      : undefined,
  });

  // 5. Business Hours
  const hoursInfo = detectBusinessHours($);
  const hoursScore = hoursInfo.hasHoursSchema ? 100 : hoursInfo.hasHours ? 70 : 0;
  checks.push({
    id: "businessHours",
    name: "Business Hours",
    status: hoursInfo.hasHours ? "pass" : "fail",
    score: hoursScore,
    weight: 10,
    value: hoursInfo,
    message: hoursInfo.hasHours
      ? `Business hours detected${hoursInfo.hasHoursSchema ? " with schema" : ""}${hoursInfo.is24Hours ? " (24/7)" : ""}`
      : "No business hours found",
    recommendation: !hoursInfo.hasHours
      ? "Display your business hours prominently on your website"
      : !hoursInfo.hasHoursSchema
      ? "Add OpeningHoursSpecification schema for better search visibility"
      : undefined,
  });

  // 6. Local Business Schema
  const schemaInfo = validateLocalBusinessSchema($);
  checks.push({
    id: "localBusinessSchema",
    name: "Local Business Schema",
    status: schemaInfo.completeness >= 70 ? "pass" : schemaInfo.hasSchema ? "warning" : "fail",
    score: schemaInfo.completeness || 0,
    weight: 15,
    value: {
      ...schemaInfo,
      schemaData: schemaInfo.hasSchema ? "Present" : "Missing",
    },
    message: schemaInfo.hasSchema
      ? `${schemaInfo.schemaType} schema found (${schemaInfo.completeness}% complete)`
      : "No Local Business Schema found",
    recommendation: !schemaInfo.hasSchema
      ? "Add LocalBusiness schema with complete business information"
      : schemaInfo.missingFields.length > 0
      ? `Add missing schema fields: ${schemaInfo.missingFields.slice(0, 3).join(", ")}`
      : undefined,
  });

  // 7. Reviews & Testimonials
  const reviewInfo = detectReviews($);
  const reviewScore = reviewInfo.hasReviewSchema ? 100 : reviewInfo.hasReviews ? 70 : 0;
  checks.push({
    id: "reviews",
    name: "Reviews & Testimonials",
    status: reviewInfo.hasReviews ? "pass" : "fail",
    score: reviewScore,
    weight: 12,
    value: reviewInfo,
    message: reviewInfo.hasReviews
      ? `${reviewInfo.reviewCount > 0 ? reviewInfo.reviewCount + " review(s) found" : "Reviews section detected"}${reviewInfo.hasStarRatings ? " with star ratings" : ""}${reviewInfo.hasReviewSchema ? " with schema" : ""}`
      : "No reviews or testimonials found",
    recommendation: !reviewInfo.hasReviews
      ? "Add customer testimonials or reviews to build trust and social proof"
      : !reviewInfo.hasReviewSchema
      ? "Add Review schema markup for rich snippets in search results"
      : undefined,
  });

  // 8. Service Areas
  const serviceAreaInfo = detectServiceAreas($, data.html);
  const serviceScore = serviceAreaInfo.hasServiceAreaPage ? 100 : serviceAreaInfo.serviceAreas.length >= 3 ? 70 : serviceAreaInfo.serviceAreas.length > 0 ? 50 : 30;
  checks.push({
    id: "serviceAreas",
    name: "Service Area Coverage",
    status: serviceAreaInfo.serviceAreas.length > 0 ? "pass" : "warning",
    score: serviceScore,
    weight: 8,
    value: serviceAreaInfo,
    message: serviceAreaInfo.serviceAreas.length > 0
      ? `${serviceAreaInfo.serviceAreas.length} service area(s) mentioned: ${serviceAreaInfo.serviceAreas.slice(0, 3).join(", ")}${serviceAreaInfo.serviceAreas.length > 3 ? "..." : ""}`
      : "No specific service areas mentioned",
    recommendation: serviceAreaInfo.serviceAreas.length === 0
      ? "Add location-specific service area pages (e.g., 'Plumbing in Denver')"
      : !serviceAreaInfo.hasServiceAreaPage
      ? "Create a dedicated service areas page listing all locations served"
      : undefined,
  });

  // 9. Local Keywords
  const keywords = extractLocalKeywords($);
  const keywordScore = keywords.cities.length + keywords.services.length >= 3 ? 100 : 
    keywords.cities.length + keywords.services.length > 0 ? 60 : 30;
  checks.push({
    id: "localKeywords",
    name: "Local Keywords",
    status: keywords.cities.length > 0 && keywords.services.length > 0 ? "pass" : "warning",
    score: keywordScore,
    weight: 10,
    value: keywords,
    message: keywords.cities.length > 0 || keywords.services.length > 0
      ? `Found ${keywords.cities.length} city/location keyword(s) and ${keywords.services.length} service keyword(s)`
      : "Limited local keywords detected",
    recommendation: keywords.cities.length === 0
      ? "Add city and location names to your content for local search visibility"
      : keywords.services.length === 0
      ? "Include service-related keywords with location modifiers"
      : !keywords.nearMeOptimized
      ? "Consider optimizing for 'near me' search queries"
      : undefined,
  });

  // 10. Google Business Profile Link
  const gbpInfo = detectGBPLink($);
  checks.push({
    id: "gbpLink",
    name: "Google Business Profile Link",
    status: gbpInfo.hasGBPLink ? "pass" : "info",
    score: gbpInfo.hasGBPLink ? 100 : 60,
    weight: 6,
    value: gbpInfo,
    message: gbpInfo.hasGBPLink
      ? "Google Business Profile link found"
      : "No Google Business Profile link detected",
    recommendation: !gbpInfo.hasGBPLink
      ? "Link to your Google Business Profile for better local SEO and reviews"
      : undefined,
  });

  // Calculate category score
  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const weightedScore = checks.reduce((sum, c) => sum + c.score * c.weight, 0);
  const score = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
  const grade = calculateGrade(score);

  return {
    score,
    grade,
    message: score >= 80
      ? "Excellent local SEO! Your site is well-optimized for local search."
      : score >= 60
      ? "Good local SEO foundation with room for improvement"
      : score >= 40
      ? "Local SEO needs attention - several critical elements missing"
      : "Poor local SEO - implement foundational local elements immediately",
    checks,
  };
}
