"use client";

export default function HowItWorks() {
  const howItWorks = [
    {
      step: "01",
      title: "Find Vendors",
      description:
        "Browse through hundreds of trusted wedding vendors by category and location.",
    },
    {
      step: "02",
      title: "Compare & Shortlist",
      description:
        "Check ratings, reviews, and portfolios to choose the right vendor for your big day.",
    },
    {
      step: "03",
      title: "Book Easily",
      description:
        "Contact vendors directly and manage bookings seamlessly on our platform.",
    },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            How Wedpine Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your journey to the perfect wedding, simplified
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {howItWorks.map((item, index) => (
            <div
              key={item.step}
              className="text-center animate-fade-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 rounded-3xl bg-wedding-purple-light flex items-center justify-center">
                  <span className="font-display text-3xl font-bold text-primary">
                    {item.step}
                  </span>
                </div>

                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                )}
              </div>

              <h3 className="font-display text-2xl font-semibold mb-3">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
