import React, { useState } from "react";

const plans = [
  {
    name: "Basic",
    features: [
      "Profile",
      "8 Photos",
      "Contact Button",
      "10 Reviews",
    ],
    monthly: 499,
    yearly: 4490,
    yearlyDiscountPercent: 25,
  },
  {
    name: "Pro",
    features: [
      "Profile",
      "Top Listing",
      "16 Photos",
      "Contact Button",
      "50 Reviews",
    ],
    monthly: 1299,
    yearly: 11690,
    yearlyDiscountPercent: 25,
  },
  {
    name: "Premium",
    features: [
      "Profile",
      "Featured",
      "Unlimited Photos",
      "Contact Button",
      "Unlimited Reviews",
      "Unlimited Bookings",
    ],
    monthly: 1999,
    yearly: 16790,
    yearlyDiscountPercent: 30,
  },
];

export default function Subscriptions() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <>
      <style>{`
        .container {
          max-width: 1200px;
          width: 100%;
          padding: 2rem;
          background: rgba(255 255 255 / 0.15);
          border-radius: 24px;
          backdrop-filter: blur(15px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.05);
        }
        h2 {
          font-weight: 700;
          font-size: 1.5rem;
          margin-bottom: 1rem;
          text-align: center;
          color: #1f2937;
          letter-spacing: 0.05em;
        }
        .billing-toggle {
          margin: 1rem auto 3rem;
          text-align: center;
          user-select: none;
        }
        .toggle-label {
  display: inline-flex;
  align-items: center;
  position: relative;
  width: 220px;
  background: #e0e7ff;
  border-radius: 9999px;
  padding: 0.25rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  color: #4f46e5; /* default text color */
  user-select: none;
}

.toggle-label span {
  flex: 1;
  text-align: center;
  z-index: 10;
  pointer-events: none;
  transition: color 0.3s ease;
}

/* slider */
.toggle-slider {
  position: absolute;
  top: 50%;
  left: 0.15rem;
  transform: translateY(-50%);
  width: 50%;
  height: 2rem; /* slightly smaller height */
  
  display: flex;
  align-items: center;
  justify-content: center;

  background: #4f46e5;
  border-radius: 9999px;
  color: white;
  font-weight: 600;
  font-size: 0.85rem;

  transition: transform 0.3s ease;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.4);
}


/* move slider on check */
.toggle-label input:checked ~ .toggle-slider {
  transform: translate(calc(100% - 0.3rem), -50%);
}
/* text colors: purple on unselected, white on selected */
.toggle-label input:not(:checked) ~ span.monthly {
  color: white; /* Monthly selected by default */
}
.toggle-label input:not(:checked) ~ span.yearly {
  color: #4f46e5; /* Yearly not selected */
}
.toggle-label input:checked ~ span.monthly {
  color: #4f46e5; /* Monthly not selected */
}
.toggle-label input:checked ~ span.yearly {
  color: white; /* Yearly selected */
}


        input:checked + .toggle-slider {
          transform: translateX(100%);
        }
        input:checked ~ span.monthly {
          color: #a5b4fc;
        }
        input:not(:checked) ~ span.yearly {
          color: #a5b4fc;
        }

        .toggle-label input[type="checkbox"] {
           position: absolute;
           opacity: 0;
           width: 0;
           height: 0;
           margin: 0;
           padding: 0;
           pointer-events: none; /* optional: disables direct clicks on the checkbox */
        }


        .plans {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }
        .plan-card {
          background: rgba(255 255 255 / 0.3);
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          cursor: pointer;
          border: 2px solid transparent;
          backdrop-filter: blur(15px);
        }
        .plan-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.15);
          border-color: #6366f1;
        }
        .plan-name {
          font-weight: 800;
          font-size: 1.8rem;
          color: #3730a3;
          margin-bottom: 1rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-align: center;
        }
        .plan-features {
          flex: 1;
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem 0;
          color: #334155;
          font-weight: 500;
          font-size: 1rem;
          line-height: 1.6;
        }
        .plan-features li {
          padding-left: 1.4em;
          position: relative;
          margin-bottom: 0.8rem;
        }
        .plan-features li::before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #4f46e5;
          font-weight: 700;
          font-size: 1.1rem;
        }
        .plan-price {
          font-weight: 900;
          font-size: 2rem;
          color: #4338ca;
          text-align: center;
          margin-bottom: 0.25rem;
          transition: color 0.3s ease;
        }
        .plan-price small {
          display: block;
          font-weight: 600;
          font-size: 1rem;
          color: #6b7280;
          margin-bottom: 1rem;
        }
        .plan-discount {
          text-align: center;
          font-size: 0.9rem;
          color: #10b981;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .btn-subscribe {
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 9999px;
          padding: 0.75rem 2rem;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
          align-self: center;
          user-select: none;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.5);
        }
        .btn-subscribe:hover {
          background-color: #3730a3;
          box-shadow: 0 6px 20px rgba(55, 48, 163, 0.7);
        }
        /* Featured badge for Premium */
        .plan-card.premium::before {
          content: "Featured";
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: #facc15;
          color: #1f2937;
          font-weight: 700;
          font-size: 0.85rem;
          padding: 0.2rem 0.75rem;
          border-radius: 9999px;
          box-shadow: 0 0 6px #facc15aa;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          user-select: none;
        }
      `}</style>

      <div className="container" role="region" aria-label="Subscription Plans">
        <h2>Choose Your Subscription Plan</h2>

        <div className="billing-toggle" role="group" aria-label="Billing Cycle Toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={billingCycle === "yearly"}
              onChange={() =>
                setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")
              }
              aria-checked={billingCycle === "yearly"}
              aria-label="Toggle billing cycle between monthly and yearly"
            />
            <span className="monthly" aria-live="polite">Monthly</span>
            <span className="yearly" aria-live="polite">Yearly</span>
            <span className="toggle-slider">
              {billingCycle === "monthly" ? "Monthly" : "Yearly"}
            </span>
          </label>
        </div>

        <div className="plans">
          {plans.map(({ name, features, monthly, yearly, yearlyDiscountPercent }) => {
            const price = billingCycle === "monthly" ? monthly : yearly;
            const discount = billingCycle === "yearly" ? yearlyDiscountPercent : 0;

            return (
              <article
                key={name}
                className={`plan-card ${name.toLowerCase() === "premium" ? "premium" : ""}`}
                tabIndex={0}
                aria-label={`${name} plan with features and pricing`}
              >
                <h3 className="plan-name">{name}</h3>
                <ul className="plan-features">
                  {features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                <div className="plan-price" aria-live="polite" aria-atomic="true">
                  Ksh {price.toLocaleString()}
                  <small>{billingCycle === "monthly" ? "/month" : "/year"}</small>
                </div>

                {discount > 0 && (
                  <div className="plan-discount" aria-label="Discount percentage">
                    Save {discount}%
                  </div>
                )}

                <button className="btn-subscribe" type="button" aria-label={`Subscribe to ${name} plan`}>
                  Get Started
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}
