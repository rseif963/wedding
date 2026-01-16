// app/head.tsx (no "use client")
export default function Head() {
  return (
    <>
      {/* Page Title */}
      <title>Wedpine</title>

      {/* Favicon / App Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

      {/* SEO Meta Tags */}
      <meta
        name="description"
        content="Find trusted wedding vendors, venues, photographers, caterers and planners on Wedpine."
      />
      <meta name="keywords" content="wedding vendors, wedding planning, wedding photographers, wedding venues, wedding catering" />
      <meta name="robots" content="index, follow" />

      {/* Open Graph / Social Preview */}
      <meta property="og:title" content="Wedpine" />
      <meta
        property="og:description"
        content="Discover and book the best wedding vendors in one place."
      />
      <meta property="og:url" content="https://www.wedpine.com" />
      <meta property="og:site_name" content="Wedpine" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/og-image.jpg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/*  Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Wedpine" />
      <meta
        name="twitter:description"
        content="Discover and book the best wedding vendors in one place."
      />
      <meta name="twitter:image" content="/og-image.jpg" />

      {/* 🔹 Structured Data */}
      <script
        id="site-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Wedpine",
            alternateName: "Wedpine",
            url: "https://www.wedpine.com",
          }),
        }}
      />
    </>
  );
}
