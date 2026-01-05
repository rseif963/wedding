"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function PrivacyPolicy() {
    return (
        <main className="w-full mx-auto text-gray-800">
            <Navbar />
            <div className="mt-20 text-center">
                <h1 className="text-3xl font-bold  mb-6">Privacy Policy</h1>
                <p className="text-sm text-gray-500 mb-10">Last Updated: January 2026</p>
            </div>


            <section className="space-y-6 text-start px-4 md:px-30 lg:px-40 w-full py-12 leading-relaxed">
                <p>
                    Welcome to <span className="font-semibold">Wedpine</span> ("we", "our", "us").
                    Wedpine is a wedding planning platform that connects couples planning
                    their weddings with professional vendors. Your privacy is extremely
                    important to us, and this Privacy Policy explains how we collect, use,
                    protect, and share your personal information when you use our website
                    and services.
                </p>

                <h2 className="text-xl font-semibold mt-10">1. Information We Collect</h2>

                <h3 className="font-medium mt-4">1.1 Information You Provide</h3>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Names, email addresses, and phone numbers</li>
                    <li>Vendor business details, descriptions, and pricing</li>
                    <li>Client wedding details and preferences</li>
                    <li>Messages exchanged between clients and vendors</li>
                    <li>Bookings, inquiries, and responses</li>
                    <li>Uploaded photos, documents, or other content</li>
                </ul>

                <h3 className="font-medium mt-4">1.2 Information Collected Automatically</h3>
                <ul className="list-disc pl-6 space-y-2">
                    <li>IP address and approximate location</li>
                    <li>Device type, browser, and operating system</li>
                    <li>Pages visited, clicks, and interaction data</li>
                    <li>Date, time, and duration of visits</li>
                </ul>

                <h2 className="text-xl font-semibold mt-10">2. How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>To create and manage user accounts</li>
                    <li>To connect clients with wedding vendors</li>
                    <li>To facilitate communication and bookings</li>
                    <li>To provide customer support</li>
                    <li>To improve platform features and user experience</li>
                    <li>To ensure platform security and prevent fraud</li>
                    <li>To comply with legal obligations</li>
                </ul>

                <h2 className="text-xl font-semibold mt-10">3. Sharing of Information</h2>
                <p>
                    We do not sell your personal data. We may share information only when
                    necessary:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Between clients and vendors to enable bookings</li>
                    <li>With trusted service providers (hosting, analytics, payments)</li>
                    <li>When required by law or legal process</li>
                    <li>To protect the rights, safety, and integrity of Wedpine</li>
                </ul>

                <h2 className="text-xl font-semibold mt-10">4. Data Retention</h2>
                <p>
                    We retain personal data only as long as necessary to provide our
                    services, comply with legal requirements, resolve disputes, and enforce
                    our agreements. Data is securely deleted or anonymized when no longer
                    needed.
                </p>

                <h2 className="text-xl font-semibold mt-10">5. Data Security</h2>
                <p>
                    Wedpine uses industry-standard security measures including encrypted
                    connections, access controls, and secure infrastructure. While we take
                    strong precautions, no system can be guaranteed to be 100% secure.
                </p>

                <h2 className="text-xl font-semibold mt-10">6. Cookies & Analytics</h2>
                <p>
                    We use cookies and analytics tools to understand usage patterns,
                    remember preferences, and improve performance. You may control cookies
                    through your browser settings.
                </p>

                <h2 className="text-xl font-semibold mt-10">7. Your Rights</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Access and review your personal data</li>
                    <li>Request correction or deletion of your data</li>
                    <li>Withdraw consent where applicable</li>
                    <li>Request data portability</li>
                </ul>

                <h2 className="text-xl font-semibold mt-10">8. Third-Party Services</h2>
                <p>
                    Wedpine may contain links to third-party websites or services. We are
                    not responsible for their privacy practices and encourage you to
                    review their policies separately.
                </p>

                <h2 className="text-xl font-semibold mt-10">9. Children’s Privacy</h2>
                <p>
                    Wedpine is not intended for use by children under the age of 13. We do
                    not knowingly collect personal information from children.
                </p>

                <h2 className="text-xl font-semibold mt-10">10. Changes to This Policy</h2>
                <p>
                    We may update this Privacy Policy from time to time. Any changes will
                    be reflected on this page with an updated revision date. Continued use
                    of Wedpine indicates acceptance of the updated policy.
                </p>

                <h2 className="text-xl font-semibold mt-10">11. Contact Us</h2>
                <p>
                    If you have any questions or concerns about this Privacy Policy or how
                    your data is handled, you may contact us at:
                </p>
                <p className="font-medium">Email: support@wedpine.com</p>
            </section>
            <Footer />
        </main>
    );
}
