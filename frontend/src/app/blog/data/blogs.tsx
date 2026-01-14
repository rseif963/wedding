import React from "react";

export type BlogPost = {
    slug: string;
    title: string;
    excerpt: string;
    image: string;
    content: React.ReactNode;
};

export const blogs: BlogPost[] = [
    // ============================
    // 1. PHOTOGRAPHERS
    // ============================
    {
        slug: "best-wedding-photographers-in-nairobi",
        title: "Capturing Forever: The Best Wedding Photographers in Nairobi",
        excerpt:
            "Discover Nairobi’s top wedding photographers who master the art of storytelling, emotion, and timeless imagery.",
        image: "/assets/blog1.jpg",
        content: (
            <>
                <style>{`
          h1 {
            font-weight: 700;
            font-size: 1.5rem;
            margin-bottom: 1rem;
            text-align: start;
          }
        `}</style>

                <p>
                    Your wedding day is one of life’s most magical moments — the laughter,
                    the tears, the stolen glances, the dancing under fairy lights. You’ll
                    want a photographer who doesn’t just take pictures, but crafts a story.
                    Nairobi’s wedding photography scene is rich and diverse, blending
                    photojournalism, fine art, fashion, and creative storytelling.
                </p>

                <p>
                    Here are some of the top wedding photographers in Nairobi who are
                    masters at freezing both the big moments and the tiny, tender ones.
                </p>

                <h1>Antony Trivet Photography</h1>
                <p>
                    Antony Trivet is a household name in Kenya’s wedding photography
                    industry. His style is artistic and photo-journalistic, weaving
                    elegant portraiture with natural, spontaneous emotion.
                </p>
                <p>
                    <strong>Why pick him:</strong> Years of experience, award recognition,
                    and a deeply emotional vision make him ideal for couples seeking a
                    premium wedding feel.
                </p>

                <h1>Timothy Katua (Katz Photography)</h1>
                <p>
                    Based in Nairobi, Timothy Katua is known for a creative documentary
                    approach. Having captured over 100 weddings, his focus is on how the
                    day felt — not just how it looked.
                </p>
                <p>
                    His membership in prestigious international photography networks
                    speaks volumes about his professionalism and quality.
                </p>

                <h1>Kiss the Bride Photography</h1>
                <p>
                    Run by Nicholas Muyoma, Kiss the Bride Photography Kenya specializes in
                    wedding and lifestyle photography with a romantic, expressive, and
                    modern style.
                </p>
                <p>
                    They also cover destination weddings across Kenya — from Nairobi to
                    the Maasai Mara.
                </p>

                <h1>Janeson Events / Janeson Films</h1>
                <p>
                    Janeson offers both cinematic videography and wedding photography.
                    Their premium packages include full-day coverage, hundreds of edited
                    photos, and even drone footage.
                </p>
                <p>
                    Using top-tier gear like Sony, Canon, and DJI drones, they deliver
                    crisp, cinematic visuals that feel straight out of a film.
                </p>

                <h1>Twist Pictures</h1>
                <p>
                    Twist Pictures provides both photography and video services with a
                    clean, modern style. Their packages include full-day coverage, drone
                    services, and beautifully crafted photo books.
                </p>
                <p>
                    They’re a great choice for couples who want cinematic visuals without
                    sacrificing photography quality.
                </p>

                <h1>Sarah Waiswa</h1>
                <p>
                    Nairobi-based Sarah Waiswa brings a soulful, documentary-style
                    perspective to her work. While not exclusively a wedding photographer,
                    her ability to capture identity, culture, and emotion makes her a
                    compelling choice.
                </p>

                <h2>Osborne Macharia</h2>
                <p>
                    Known for bold, conceptual photography, Osborne Macharia is perfect
                    for couples seeking wedding photos that feel like high-fashion art.
                </p>
                <p>
                    Though not traditional, his creative eye transforms weddings into
                    powerful visual stories.
                </p>

                <h1>Tips for Picking the Right Photographer</h1>
                <ul>
                    <li>
                        <strong>Know your style:</strong> Documentary, traditional,
                        cinematic, or fashion — choose what resonates with you.
                    </li>
                    <li>
                        <strong>Set a realistic budget:</strong> Photography is an
                        investment you’ll never regret.
                    </li>
                    <li>
                        <strong>Meet them first:</strong> Chemistry matters — you’ll spend
                        a lot of time together on the big day.
                    </li>
                    <li>
                        <strong>Clarify deliverables:</strong> Timelines, galleries, albums,
                        and formats.
                    </li>
                    <li>
                        <strong>Confirm logistics:</strong> Travel, destination fees, and
                        drone coverage.
                    </li>
                </ul>

                <blockquote>
                    Nairobi is bursting with creative wedding photographers who can turn
                    your wedding day into a timeless story.
                </blockquote>

                <p>
                    Whether you want classic elegance, cinematic drama, or raw emotion,
                    the photographers above bring professionalism, artistry, and heart.
                    Choose someone who captures not just your moments, but how they felt.
                </p>
            </>
        ),
    },

    // ============================
    // 2. TOP 10 VENUES
    // ============================
    {
        slug: "top-10-wedding-venues-in-kenya",
        title: "Top 10 Wedding Venues in Kenya: Say “I Do” in Paradise",
        excerpt:
            "From safari lodges to beachside escapes, discover Kenya’s most breathtaking wedding venues.",
        image: "/assets/blog2.jpg",
        content: (
            <>
                <style>{`
          h2 {
            font-weight: 700;
            font-size: 1.5rem;
            margin-bottom: 1rem;
            text-align: start;
          }
        `}</style>

                <p>
                    Planning a wedding in Kenya? From serene lakeside escapes to luxurious
                    safari lodges, Kenya offers breathtaking venues for unforgettable
                    celebrations.
                </p>

                <h2>1. Giraffe Manor – Nairobi</h2>
                <p>
                    Imagine saying “I do” while giraffes peek through the windows! Giraffe Manor is a luxury boutique hotel in Nairobi and a bucket-list venue for animal lovers. The manor’s lush gardens and iconic giraffe interactions make for unforgettable photos. Perfect for intimate weddings, this venue combines elegance with whimsy.
                </p>

                <h2>2. Manda Bay – Lamu</h2>
                <p>
                    For a tropical paradise wedding, Manda Bay on the Lamu Archipelago is unbeatable. Golden beaches, turquoise waters, and swaying palms set the scene for a dreamy destination wedding. Opt for a barefoot ceremony with the ocean as your backdrop—pure romance!
                </p>

                <h2>3. Safari Park Hotel – Nairobi</h2>
                <p>
                    Looking for a venue with versatility and grandeur? The Safari Park Hotel offers expansive gardens, elegant ballrooms, and luxury lodges. Ideal for large weddings, this venue blends classic Kenyan charm with modern amenities. Bonus: Stunning photo opportunities in the hotel’s lush gardens!
                </p>

                <h2>4. Lake Naivasha Sopa Lodge</h2>
                <p>
                    A wedding by the lake? Yes, please! Lake Naivasha Sopa Lodge provides serene lakeside views, surrounded by vibrant wildlife and picturesque gardens. Exchange vows with the gentle ripple of the lake and enjoy sunset photos that look straight out of a movie.
                </p>

                <h2>5. Karen Blixen Coffee Garden</h2>
                <p>
                    Step into storybook elegance at Karen Blixen Coffee Garden. This venue is perfect for those seeking a romantic, colonial-style wedding. The beautifully landscaped gardens, intimate courtyards, and cozy cottages make it a top choice for both small and medium-sized weddings.
                </p>

                <h2>6. Ngong Hills</h2>
                <p>
                    For couples who love drama and breathtaking views, Ngong Hills is a spectacular choice. Imagine exchanging vows with rolling hills in the background and the wind in your hair. This venue is perfect for adventurous couples looking for a unique outdoor wedding experience.
                </p>

                <h2>7. Amboseli Serena Safari Lodge</h2>
                <p>
                    Dreaming of a wedding with elephants in the background? Amboseli Serena Safari Lodge offers sweeping views of Mount Kilimanjaro and the savannah plains. A safari-themed wedding here is perfect for wildlife enthusiasts and makes for unforgettable wedding photos.
                </p>

                <h2>8. Hemingways Watamu</h2>
                <p>
                    If luxury and the beach are your top priorities, Hemingways Watamu is the place to be. White sands, sparkling turquoise waters, and five-star amenities create the ultimate romantic getaway. This venue is ideal for intimate beach weddings with a touch of elegance.
                </p>

                <h2>9. Tribe Hotel – Nairobi</h2>
                <p>
                    For couples craving modern sophistication, The Tribe Hotel is a chic, urban oasis. With stunning contemporary architecture, rooftop terraces, and lush gardens, this venue perfectly blends luxury and style for an unforgettable city wedding.
                </p>

                <h2>10. Elsa’s Kopje – Meru</h2>
                <p>
                    For a wilderness wedding, Elsa’s Kopje in Meru National Park is unmatched. Imagine exchanging vows on a private terrace overlooking the savannah, with wildlife roaming in the distance. Perfect for adventurous couples who want a safari wedding with elegance and exclusivity.
                </p>
                <h2>Tips for Choosing Your Perfect Venue</h2>
                <p>
                    Consider the guest list – Make sure the venue can comfortably host everyone. Think about accessibility – How easy is it for guests to reach the location? Check amenities – Catering, accommodation, and decor options are key. Visit before booking – Pictures are amazing, but seeing the venue in person is essential. Final Thoughts
                    Kenya offers some of the most diverse and stunning wedding venues in the world. Whether you dream of a beach wedding, a safari adventure, or a charming garden ceremony, there’s a venue to bring your vision to life. Your dream Kenyan wedding is closer than you think—just pick a venue and start planning the celebration of a lifetime!
                </p>
            </>
        ),
    },

    // ============================
    // 3. WEDDING CAKES
    // ============================
    {
        slug: "wedding-cake-inspiration",
        title: "Wedding Cake Inspiration: Sweet Designs to Make Your Day Unforgettable",
        excerpt:
            "From classic white cakes to bold modern designs, find wedding cake inspiration that tells your love story.",
        image: "/assets/blog3.jpg",
        content: (
            <>
                <style>{`
          h2 {
            font-weight: 700;
            font-size: 1.5rem;
            margin-bottom: 1rem;
            text-align: start;
          }
        `}</style>

                <p>
                    When it comes to weddings, few things capture the imagination quite like the cake. Beyond being a delicious finale to your celebration, a wedding cake is a centerpiece, a conversation starter, and a reflection of your love story. From classic elegance to bold, modern statements, there’s a cake for every couple—and every personality. Here’s a journey through some of the most inspiring wedding cake trends, styles, and ideas to spark your imagination.
                </p>

                <h2>Timeless Elegance: The Classic White Cake</h2>
                <p>
                    Nothing says “wedding” quite like a pristine white cake. Smooth fondant, delicate piping, and cascading sugar flowers create a sense of sophistication and romance. For a modern twist, consider subtle metallic accents—like gold leaf detailing—or a hint of color in the floral arrangements.
                </p>
                <ul>
                    <li>
                        <strong>Tip:</strong> Pair white roses with greenery for a naturally elegant look, or add monogrammed initials for a personal touch.
                    </li>
                </ul>

                <h2>Nature-Inspired Cakes: Flowers, Fruits, and Foliage</h2>
                <p>
                    For couples who love the outdoors, floral and botanical designs bring the beauty of nature indoors. Think hand-painted sugar flowers, edible blooms, and fresh fruit arrangements that add color, texture, and a touch of whimsy.
                </p>
                <ul>
                    <li>
                        <strong>Fun Idea:</strong> Use seasonal fruits or flowers to tell your story—cherry blossoms in spring, sunflowers in summer, or rich berries in fall.
                    </li>
                </ul>

                <h2>Modern Minimalism: Sleek, Simple, Stunning</h2>
                <p>
                    Minimalist cakes are all about clean lines, geometric shapes, and understated elegance. Often featuring smooth buttercream or fondant, these cakes rely on texture, color blocks, or small design elements to make a statement.
                </p>
                <ul>
                    <li>
                        <strong>Pro Tip:</strong> Matte or marble finishes, paired with a single striking decoration, can create a jaw-dropping visual impact without being over the top.
                    </li>
                </ul>

                <h2>Bold & Beautiful: Colorful Cakes</h2>
                <p>
                    Who says wedding cakes have to be white? From ombré shades to vibrant brushstroke designs, colorful cakes can reflect your personalities and bring energy to your reception. Metallics, watercolor effects, and even edible glitter can turn your cake into a true showstopper.
                </p>
                <ul>
                    <li>
                        <strong>Tip:</strong> Coordinate cake colors with your wedding palette for a harmonious and Instagram-worthy centerpiece.
                    </li>
                </ul>

                <h2>Whimsical and Fun: Quirky Cakes That Reflect You</h2>
                <p>For couples with a playful side, there are no rules. Think themed cakes, unexpected shapes, or fun textures. Maybe a stacked geometric masterpiece, a dripping chocolate dream, or a cake inspired by your favorite hobbies or travel memories.</p>
                <ul>
                    <li>
                        <strong>Fun Twist:</strong> Mini cakes or cake towers for each table not only look adorable but let guests enjoy a personal treat.
                    </li>
                </ul>

                <h2>Multi-Tiered Masterpieces</h2>
                <p>For those dreaming of grandeur, multi-tiered cakes are the ultimate wedding statement. Each layer can have its own design, flavor, or theme, giving your cake depth and character. Combine textures—like smooth fondant on one tier, rough buttercream on another—for a layered effect that’s visually stunning.</p>

                <h2>Final Thoughts: Make Your Cake Your Canvas</h2>
                <p>Your wedding cake is more than just dessert—it’s art. Whether you lean toward classic elegance, modern minimalism, or something completely unexpected, your cake should reflect your style and the story of your love. Don’t be afraid to mix ideas, experiment with flavors, or consult a talented cake designer who can bring your vision to life.</p>
                <p>After all, the perfect wedding cake is sweet, memorable, and utterly you.</p>
                <blockquote>
                    Your wedding cake should be as memorable as your love story.
                </blockquote>
            </>
        ),
    },

    // ============================
    // 4. BRIDAL DRESSES
    // ============================
    {
        slug: "ultimate-bridal-dress-shopping-guide",
        title: "The Ultimate Bridal Dress Shopping Guide: Find Your Dream Gown with Ease",
        excerpt:
            "A stress-free guide to finding a bridal gown that makes you feel confident, radiant, and unforgettable.",
        image: "/assets/blog4.jpg",
        content: (
            <>
                <style>{`
          h2 {
            font-weight: 700;
            font-size: 1.5rem;
            margin-bottom: 1rem;
            text-align: start;
          }
        `}</style>

                <p>
                    Bridal dress shopping is a journey filled with excitement, emotion,
                    and discovery.
                </p>

                <h2>Start Early</h2>
                <p>
                    Begin shopping 8–12 months in advance to allow time for fittings and
                    alterations.
                </p>

                <h2>Set a Budget</h2>
                <p>
                    Remember to include alterations, accessories, and veils.
                </p>

                <h2>Trust Your Instincts</h2>
                <p>
                    When it feels right, you’ll know — that’s your dress.
                </p>

                <blockquote>
                    The perfect dress doesn’t just fit your body — it fits your soul.
                </blockquote>
            </>
        ),
    }, 
];
