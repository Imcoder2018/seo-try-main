import {
  Search,
  Link2,
  Smartphone,
  Zap,
  Share2,
  Server,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "On-Page SEO",
    description:
      "Analyze title tags, meta descriptions, headers, keywords, schema markup, and more.",
  },
  {
    icon: Link2,
    title: "Links Analysis",
    description:
      "Check backlinks, internal links, broken links, and anchor text distribution.",
  },
  {
    icon: Smartphone,
    title: "Usability",
    description:
      "Test mobile-friendliness, Core Web Vitals, PageSpeed scores, and tap targets.",
  },
  {
    icon: Zap,
    title: "Performance",
    description:
      "Measure load times, compression, image optimization, and HTTP/2 usage.",
  },
  {
    icon: Share2,
    title: "Social",
    description:
      "Verify Open Graph tags, Twitter Cards, and social media presence.",
  },
  {
    icon: Server,
    title: "Technology",
    description:
      "Detect CMS, hosting, CDN, SSL certificates, and DNS configuration.",
  },
];

export function Features() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-4">
          Comprehensive Website Analysis
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Get detailed insights across all aspects of your website&apos;s SEO
          health with actionable recommendations.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
