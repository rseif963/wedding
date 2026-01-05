"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function FAQsPage() {
  return (
    <main className="bg-gray-50 min-h-screen ">
        <Navbar />
      <div className="w-full md:max-w-5xl mt-20 py-16 mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900">Frequently Asked Questions</h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about using Wedpine — from finding trusted wedding vendors
            to managing bookings, payments, privacy, and account security.
          </p>
        </div>

        {/* Section: General */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">General Questions</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-medium text-gray-900">What is Wedpine?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Wedpine is a professional wedding planning platform that connects couples with
                verified wedding vendors such as photographers, venues, decorators, caterers,
                bridal wear providers, makeup artists, and more. Our goal is to simplify wedding
                planning by providing a trusted, organized, and transparent experience.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-medium text-gray-900">Who can use Wedpine?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Wedpine is designed for two main user types: clients (couples planning their wedding)
                and vendors (businesses offering wedding-related services). Each user type has tools
                tailored specifically to their needs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-medium text-gray-900">Is Wedpine free to use?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Creating an account and browsing vendors on Wedpine is free for clients. Vendors may
                access free basic features, with optional premium tools available to enhance
                visibility, analytics, and lead management.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Clients */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">For Couples & Clients</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-medium text-gray-900">How do I find the right vendor?</h3>
              <p className="mt-2 text-sm text-gray-600">
                You can search vendors by category, location, pricing, and availability. Each vendor
                profile includes photos, descriptions, services offered, and reviews to help you
                make an informed decision.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-medium text-gray-900">How do bookings work?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Once you find a vendor, you can send a booking inquiry directly through Wedpine.
                Vendors can accept, decline, or request more information. All communication is
                securely stored in your dashboard.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-medium text-gray-900">Can I message vendors before booking?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Yes. Wedpine allows direct messaging between clients and vendors so you can clarify
                details, pricing, availability, and expectations before confirming a booking.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-medium text-gray-900">Are vendors verified?</h3>
              <p className="mt-2 text-sm text-gray-600">
                We review vendor profiles and monitor activity to maintain quality and trust.
                However, clients are encouraged to communicate clearly and perform due diligence
                before finalizing agreements.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Vendors */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">For Vendors</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-medium text-gray-900">How do I become a vendor on Wedpine?</h3>
              <p className="mt-2 text-sm text-gray-600">
                You can register as a vendor by creating a vendor account and completing your
                business profile. This includes your services, pricing details, portfolio images,
                and contact information.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-medium text-gray-900">How do I receive booking requests?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Booking inquiries from clients appear directly in your vendor dashboard. You can
                view details, message clients, and accept or decline requests in real time.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-medium text-gray-900">What happens when I accept a booking?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Once accepted, both parties can continue communicating through Wedpine. Vendors are
                expected to honor accepted bookings and provide services as described in their
                profile and discussions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-medium text-gray-900">Can I track my performance?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Vendors have access to analytics tools that provide insights into profile views,
                inquiries received, and booking trends, helping you grow your business.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Privacy & Security */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Privacy, Security & Trust</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-medium text-gray-900">How is my data protected?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Wedpine uses industry-standard security measures to protect your personal
                information. Sensitive data is encrypted and access is strictly controlled.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-medium text-gray-900">Is my information shared with third parties?</h3>
              <p className="mt-2 text-sm text-gray-600">
                We do not sell your personal data. Information is only shared when necessary to
                operate the platform, comply with legal obligations, or improve our services.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-medium text-gray-900">Can I delete my account?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Yes. You may request account deletion at any time. Upon deletion, your personal
                data will be handled in accordance with our Privacy Policy and applicable laws.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Support */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Support & Help</h2>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-medium text-gray-900">How can I contact Wedpine support?</h3>
            <p className="mt-2 text-sm text-gray-600">
              If you need help, you can reach our support team via email, WhatsApp, or the contact
              page. We aim to respond to all inquiries promptly and professionally.
            </p>
          </div>
        </section>

        {/* Footer note */}
        <div className="text-center text-sm text-gray-500 mt-16">
          Last updated: {new Date().toLocaleDateString()} · Wedpine FAQs
        </div>
      </div>
      <Footer />
    </main>
  );
}
