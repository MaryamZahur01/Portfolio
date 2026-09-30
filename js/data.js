/* =========================================================
   EDIT THIS FILE TO UPDATE YOUR PORTFOLIO
   Everything (contact details, projects, tools) lives here.
   ========================================================= */

window.SITE = {
  name: "Maryam Zahoor",
  firstName: "Maryam",
  role: "Graphic & UI/UX Designer",

  // >>> Put your real email here (used by "Contact me" and "Get a quote")
  email: "m.zahoor0504@gmail.com",

  // >>> WhatsApp number with country code, digits only, e.g. "923001234567".
  //     Leave empty "" to hide the floating WhatsApp button.
  whatsapp: "",

  behance: "https://www.behance.net/maryamzahoor",
  linkedin: "", // e.g. "https://www.linkedin.com/in/your-profile"
  dribbble: "",
  instagram: ""
};

/* Tools shown in the moving strip and in the About toolkit */
window.TOOLS = [
  "Figma", "Photoshop", "Illustrator", "InDesign", "After Effects", "Canva",
  "FigJam", "Adobe XD", "Shopify", "Framer", "Webflow", "Lottie",
  "Miro", "Notion", "ChatGPT", "Midjourney"
];

/*  Project fields
    slug    : screenshot file name -> assets/projects/<slug>.jpg (captured automatically, see README)
    url     : live link the card opens
    cat     : web | app | shopify   (graphic design work is pulled from Behance automatically)
    feature : true = shows in the big "Selected work" slider (and is NOT repeated in the grid)
    extra   : optional second link shown on the card
    img     : optional, your own image instead of the automatic screenshot, e.g. img: "assets/own/oraami.jpg"
*/
window.CATEGORIES = [
  { id: "web",     label: "Websites & SaaS" },
  { id: "app",     label: "Mobile apps" },
  { id: "shopify", label: "Shopify stores" },
  { id: "graphic", label: "Graphic design" }
];

window.PROJECTS = [
  // ---------- Websites & SaaS (featured in the slider) ----------
  { slug: "oraami", title: "Oraami", url: "https://oraami.com/", cat: "web", feature: true, hue: "#5b4bdb",
    tag: "AI lead intelligence platform",
    desc: "Designed the complete product from scratch: data-heavy dashboards, tables, filters, lead profiles, AI-driven insights, campaign management, analytics and end-to-end user flows." },
  { slug: "baselinelabs", title: "Baseline Labs", url: "https://baselinelabs.ai/", cat: "web", feature: true, hue: "#1f7a6b",
    tag: "AI search visibility SaaS",
    desc: "Worked on the product itself, improving onboarding and the dashboard." },
  { slug: "smartli", title: "Smartli", url: "https://www.smartli.ai/", cat: "web", feature: true, hue: "#e2548a",
    tag: "AI content creation SaaS",
    desc: "Designed the product experience and the website." },
  { slug: "qoyod", title: "Qoyod", url: "https://www.qoyod.com/en/", cat: "web", feature: true, hue: "#1a6fd6",
    tag: "Accounting platform",
    desc: "Designed the marketing website and enhanced the product user experience." },
  { slug: "coredirection", title: "Core Direction", url: "https://coredirection.com/", cat: "web", feature: true, hue: "#f06a3b",
    tag: "Fitness & wellness platform",
    extra: { label: "iOS app", url: "https://apps.apple.com/ae/app/core-direction/id1644608047" },
    desc: "Enhanced the overall user experience of the platform and its iOS app." },
  { slug: "spocket", title: "Spocket", url: "https://www.spocket.co/", cat: "web", feature: true, hue: "#6a3df0",
    tag: "Dropshipping app",
    desc: "Designed the marketing website." },
  { slug: "storfund", title: "Storfund", url: "https://storfund.com/", cat: "web", feature: true, hue: "#0f3d63",
    tag: "B2B fintech platform",
    desc: "Collaborated with the marketing team on graphic design: social media design, logo work, email banners and website material." },
  { slug: "histrips", title: "HiStrips", url: "https://histrips.com/", cat: "web", feature: true, hue: "#0D1F17",
    tag: "Sports performance & sleep brand", desc: "Store design for a brand selling nasal strips, mouth tape and recovery gear to athletes." },
  { slug: "strandbags", title: "Strandbags", url: "https://www.strandbags.com.au/", cat: "web", feature: true, hue: "#111111",
    tag: "Bags & luggage retail, Australia", desc: "E-commerce design work." },

  // ---------- Websites & SaaS (grid) ----------
  { slug: "histrips", title: "HiStrips", url: "https://histrips.com/", cat: "web", hue: "#111111",
    tag: "Sports performance & sleep brand", desc: "Store design for a brand selling nasal strips, mouth tape and recovery gear to athletes." },
  { slug: "strandbags", title: "Strandbags", url: "https://www.strandbags.com.au/", cat: "web", hue: "#111111",
    tag: "Bags & luggage retail, Australia", desc: "E-commerce design work." },
  { slug: "gemmapell", title: "Gemma Pell", url: "https://gemmapell.com/", cat: "web", hue: "#b68a6a",
    tag: "Website", desc: "Website design." },
  { slug: "pokermoose", title: "Poker Moose", url: "https://www.pokermoose.com/", cat: "web", hue: "#1e6b3a",
    tag: "Website", desc: "Website design." },
  { slug: "boldify", title: "Boldify", url: "https://getboldify.com/", cat: "web", hue: "#7A3FF2",
    tag: "Haircare brand", desc: "E-commerce design work." },

  // ---------- Mobile apps ----------
  

  { slug: "app-edx", title: "edX", url: "https://play.google.com/store/apps/details?id=org.edx.mobile", cat: "app", hue: "#02262b",
    tag: "Online learning app", desc: "Mobile app design." },
  { slug: "app-emiga", title: "Emiga", url: "https://play.google.com/store/apps/details?id=com.phinex.emiga&hl=en", cat: "app", hue: "#11998e",
    tag: "Android app", desc: "Mobile app design." },

  // ---------- Shopify stores & Apps ----------
  { slug: "buckpalmer", title: "Buck Palmer", url: "https://buckpalmer.com/", cat: "shopify", hue: "#2c2c2c",
    tag: "Shopify store", desc: "Shopify store design." },
  { slug: "borrowingmagnolia", title: "Borrowing Magnolia", url: "https://www.borrowingmagnolia.com/", cat: "shopify", hue: "#b5977a",
    tag: "Shopify store", desc: "Shopify store design." },
  { slug: "jubilee", title: "Jubilee Beauty", url: "https://jubilee.beauty/", cat: "shopify", hue: "#d98aa6",
    tag: "Beauty store", desc: "Shopify store design." },
  { slug: "momentumedu", title: "Momentum Edu", url: "http://momentumedu.org/", cat: "shopify", hue: "#f2a33a",
    tag: "Education", desc: "Website design." },
  { slug: "weworkremotely", title: "We Work Remotely", url: "https://weworkremotely.com/", cat: "shopify", hue: "#e04e39",
    tag: "Remote jobs board", desc: "Website design." },
  { slug: "voicerules", title: "VoiceRules", url: "https://www.voicerules.com/", cat: "shopify", hue: "#7b3fb8",
    tag: "Shopify", desc: "Store design." },
  { slug: "dropshippod", title: "Dropship POD", url: "https://dropshippod.ca/", cat: "shopify", hue: "#1d9a6c",
    tag: "Print on demand", desc: "Store design." },
   { slug: "histrips", title: "HiStrips", url: "https://histrips.com/", cat: "shopify", hue: "#0D1F17",
    tag: "Sports performance & sleep brand", desc: "Store design for a brand selling nasal strips, mouth tape and recovery gear to athletes." },
  { slug: "strandbags", title: "Strandbags", url: "https://www.strandbags.com.au/", cat: "shopify", hue: "#111111",
    tag: "Bags & luggage retail, Australia", desc: "E-commerce design work." },
   { slug: "neuro", title: "Neuro", url: "https://neurogum.com/", cat: "shopify", hue: "#1B3FE4",
    tag: "Supplements brand", desc: "E-commerce design work." },
{ slug: "loop-earplugs", title: "Loop Earplugs", url: "https://www.loopearplugs.com/", cat: "shopify", hue: "#F26B4E",
    tag: "Tech accessories brand", desc: "E-commerce design work." },
{ slug: "dulora", title: "Dulora", url: "https://dulora.com.au/", cat: "shopify", hue: "#C8A45C",
    tag: "Premium lighting brand", desc: "E-commerce design work." },
{ slug: "boldify", title: "Boldify", url: "https://getboldify.com/", cat: "shopify", hue: "#7A3FF2",
    tag: "Haircare brand", desc: "E-commerce design work." },
];

/* Graphic design: Amazon product design, posters, packaging.
   Real project covers are pulled from Behance automatically (see README).
   The keywords decide which Behance project gets which label. */
window.GRAPHIC = {
  behance: "https://www.behance.net/maryamzahoor",
  labels: [
    { label: "Amazon product design", match: ["amazon", "listing", "a+", "infographic", "product image"] },
    { label: "Packaging design", match: ["packag", "label", "box", "pouch", "bottle"] },
    { label: "Poster design", match: ["poster", "flyer", "campaign", "event"] },
    { label: "Branding", match: ["brand", "logo", "identity"] },
    { label: "Social media", match: ["social", "instagram", "post", "ads"] }
  ]
};
