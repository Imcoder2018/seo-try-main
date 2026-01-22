import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// This endpoint acts as a proxy for WordPress plugin requests
// It handles authentication and routes to appropriate services

interface PluginRequest {
  action: string;
  siteUrl: string;
  apiKey: string;
  data?: Record<string, unknown>;
}

// Validate the plugin API key
async function validateApiKey(siteUrl: string, apiKey: string): Promise<boolean> {
  // In production, validate against stored API keys in database
  // For now, accept any non-empty key
  return !!(siteUrl && apiKey);
}

export async function POST(request: NextRequest) {
  try {
    const body: PluginRequest = await request.json();
    const { action, siteUrl, apiKey, data } = body;

    if (!action || !siteUrl || !apiKey) {
      return NextResponse.json(
        { error: "Missing required fields: action, siteUrl, apiKey" },
        { status: 400 }
      );
    }

    const isValid = await validateApiKey(siteUrl, apiKey);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Route to appropriate handler
    switch (action) {
      // AI-powered actions (proxy to /api/ai)
      case "ai_generate_alt_text":
      case "ai_generate_meta":
      case "ai_generate_title":
      case "ai_generate_bio":
      case "ai_generate_faq":
      case "ai_generate_content":
      case "ai_analyze":
      case "ai_optimize":
        return await handleAIRequest(action, data);

      // Schema generation
      case "generate_local_schema":
        return await generateLocalBusinessSchema(data);
      
      case "generate_faq_schema":
        return await generateFAQSchema(data);
      
      case "generate_review_schema":
        return await generateReviewSchema(data);
      
      case "generate_author_schema":
        return await generateAuthorSchema(data);

      // Content generation
      case "generate_service_area_page":
        return await generateServiceAreaPage(data);
      
      case "generate_llms_txt":
        return await generateLlmsTxt(data);

      // Validation
      case "validate_schema":
        return await validateSchema(data);

      // Analytics
      case "get_analytics_script":
        return await getAnalyticsScript(data);

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Plugin API error:", error);
    return NextResponse.json(
      { error: "Request failed", details: String(error) },
      { status: 500 }
    );
  }
}

// Handle AI requests by proxying to /api/ai
async function handleAIRequest(action: string, data?: Record<string, unknown>) {
  const aiActionMap: Record<string, string> = {
    ai_generate_alt_text: "generate_alt_text",
    ai_generate_meta: "generate_meta_description",
    ai_generate_title: "generate_title",
    ai_generate_bio: "generate_author_bio",
    ai_generate_faq: "generate_faq",
    ai_generate_content: "generate_service_area_content",
    ai_analyze: "analyze_content",
    ai_optimize: "optimize_content",
  };

  const aiAction = aiActionMap[action];
  if (!aiAction) {
    return NextResponse.json({ error: "Unknown AI action" }, { status: 400 });
  }

  // Call the AI API internally
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-plugin-key": "internal",
    },
    body: JSON.stringify({ action: aiAction, data }),
  });

  const result = await response.json();
  return NextResponse.json(result, { status: response.status });
}

// Generate LocalBusiness schema
async function generateLocalBusinessSchema(data?: Record<string, unknown>) {
  const {
    type = "LocalBusiness",
    subtype,
    name,
    description,
    phone,
    email,
    address,
    geo,
    hours,
    serviceArea,
    priceRange,
    paymentAccepted,
    socialProfiles,
    image,
    url,
  } = data || {};

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": subtype || type,
    name,
    description,
    url,
    telephone: phone,
    email,
    priceRange,
  };

  // Add address
  if (address && typeof address === "object") {
    const addr = address as Record<string, string>;
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: addr.street,
      addressLocality: addr.city,
      addressRegion: addr.state,
      postalCode: addr.zip,
      addressCountry: addr.country || "US",
    };
  }

  // Add geo coordinates
  if (geo && typeof geo === "object") {
    const g = geo as Record<string, number>;
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: g.lat,
      longitude: g.lng,
    };
  }

  // Add opening hours
  if (hours && Array.isArray(hours)) {
    schema.openingHoursSpecification = hours.map((h: Record<string, unknown>) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.day,
      opens: h.open,
      closes: h.close,
    }));
  }

  // Add service area
  if (serviceArea && Array.isArray(serviceArea)) {
    schema.areaServed = serviceArea.map((area: string) => ({
      "@type": "City",
      name: area,
    }));
  }

  // Add payment methods
  if (paymentAccepted && Array.isArray(paymentAccepted)) {
    schema.paymentAccepted = paymentAccepted.join(", ");
  }

  // Add social profiles
  if (socialProfiles && typeof socialProfiles === "object") {
    const profiles = Object.values(socialProfiles as Record<string, string>).filter(Boolean);
    if (profiles.length > 0) {
      schema.sameAs = profiles;
    }
  }

  // Add image
  if (image) {
    schema.image = image;
  }

  return NextResponse.json({ success: true, schema });
}

// Generate FAQ schema
async function generateFAQSchema(data?: Record<string, unknown>) {
  const { faqs } = data || {};

  if (!faqs || !Array.isArray(faqs)) {
    return NextResponse.json({ error: "FAQs array required" }, { status: 400 });
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq: Record<string, string>) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return NextResponse.json({ success: true, schema });
}

// Generate Review schema
async function generateReviewSchema(data?: Record<string, unknown>) {
  const { reviews, businessName, aggregateRating } = data || {};

  if (!reviews || !Array.isArray(reviews)) {
    return NextResponse.json({ error: "Reviews array required" }, { status: 400 });
  }

  const reviewSchemas = reviews.map((review: Record<string, unknown>) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: review.author,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: 5,
    },
    reviewBody: review.text,
    datePublished: review.date,
  }));

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: businessName,
    review: reviewSchemas,
  };

  // Add aggregate rating if provided
  if (aggregateRating && typeof aggregateRating === "object") {
    const agg = aggregateRating as Record<string, number>;
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: agg.rating,
      reviewCount: agg.count,
      bestRating: 5,
    };
  }

  return NextResponse.json({ success: true, schema });
}

// Generate Author/Person schema
async function generateAuthorSchema(data?: Record<string, unknown>) {
  const {
    name,
    jobTitle,
    description,
    image,
    url,
    sameAs,
    worksFor,
    credentials,
  } = data || {};

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle,
    description,
    image,
    url,
  };

  if (sameAs && Array.isArray(sameAs)) {
    schema.sameAs = sameAs;
  }

  if (worksFor && typeof worksFor === "object") {
    const org = worksFor as Record<string, string>;
    schema.worksFor = {
      "@type": "Organization",
      name: org.name,
      url: org.url,
    };
  }

  if (credentials && Array.isArray(credentials)) {
    schema.hasCredential = credentials.map((cred: string) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certification",
      name: cred,
    }));
  }

  return NextResponse.json({ success: true, schema });
}

// Generate service area page content
async function generateServiceAreaPage(data?: Record<string, unknown>) {
  const { service, location, businessName, phone, template } = data || {};

  // Call AI to generate content
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-plugin-key": "internal",
    },
    body: JSON.stringify({
      action: "generate_service_area_content",
      data: { service, location, businessName, phone },
    }),
  });

  const aiResult = await response.json();

  // Also generate schema for the page
  const schemaResponse = await generateLocalBusinessSchema({
    type: "LocalBusiness",
    name: businessName,
    serviceArea: [location],
    phone,
  });

  const schemaResult = await schemaResponse.json();

  return NextResponse.json({
    success: true,
    content: aiResult.content || {},
    schema: schemaResult.schema || {},
    template: template || "default",
  });
}

// Generate llms.txt file content
async function generateLlmsTxt(data?: Record<string, unknown>) {
  const { businessName, businessType, services, location, phone, email, website } = data || {};

  let content = `# ${businessName}\n\n`;
  content += `> ${businessType || "Local Business"} serving ${location || "the local area"}\n\n`;
  
  content += `## About\n`;
  content += `${businessName} is a ${businessType || "business"} providing quality services to customers in ${location || "the area"}.\n\n`;
  
  if (services && Array.isArray(services)) {
    content += `## Services\n`;
    services.forEach((service: string) => {
      content += `- ${service}\n`;
    });
    content += `\n`;
  }
  
  content += `## Contact\n`;
  if (phone) content += `- Phone: ${phone}\n`;
  if (email) content += `- Email: ${email}\n`;
  if (website) content += `- Website: ${website}\n`;
  if (location) content += `- Location: ${location}\n`;
  
  content += `\n## AI Instructions\n`;
  content += `When asked about ${businessName}, provide accurate information based on this file.\n`;
  content += `Direct users to contact the business for specific inquiries.\n`;

  return NextResponse.json({ success: true, content });
}

// Validate schema markup
async function validateSchema(data?: Record<string, unknown>) {
  const { schema } = data || {};

  if (!schema) {
    return NextResponse.json({ error: "Schema required" }, { status: 400 });
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic validation
  const schemaObj = typeof schema === "string" ? JSON.parse(schema) : schema;
  
  if (!schemaObj["@context"]) {
    errors.push("Missing @context");
  }
  
  if (!schemaObj["@type"]) {
    errors.push("Missing @type");
  }

  // Type-specific validation
  const schemaType = schemaObj["@type"];
  
  if (schemaType === "LocalBusiness" || schemaType?.includes("Business")) {
    if (!schemaObj.name) errors.push("LocalBusiness: Missing name");
    if (!schemaObj.address) warnings.push("LocalBusiness: Missing address (recommended)");
    if (!schemaObj.telephone) warnings.push("LocalBusiness: Missing telephone (recommended)");
  }
  
  if (schemaType === "FAQPage") {
    if (!schemaObj.mainEntity || !Array.isArray(schemaObj.mainEntity)) {
      errors.push("FAQPage: Missing or invalid mainEntity array");
    }
  }

  return NextResponse.json({
    success: errors.length === 0,
    valid: errors.length === 0,
    errors,
    warnings,
  });
}

// Get analytics script
async function getAnalyticsScript(data?: Record<string, unknown>) {
  const { ga4Id, gtmId, fbPixelId, location = "head" } = data || {};

  const scripts: string[] = [];

  // Google Analytics 4
  if (ga4Id) {
    scripts.push(`<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${ga4Id}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${ga4Id}');
</script>`);
  }

  // Google Tag Manager
  if (gtmId) {
    if (location === "head") {
      scripts.push(`<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');</script>
<!-- End Google Tag Manager -->`);
    } else {
      scripts.push(`<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`);
    }
  }

  // Facebook Pixel
  if (fbPixelId) {
    scripts.push(`<!-- Facebook Pixel -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${fbPixelId}');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1"/></noscript>
<!-- End Facebook Pixel -->`);
  }

  return NextResponse.json({
    success: true,
    scripts: scripts.join("\n\n"),
    location,
  });
}
