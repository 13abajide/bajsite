// Central project data — used by the Work grid and by each project's
// detail page. Row order here is the display order on the Work page.

export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "personal", label: "Personal" },
  { id: "community", label: "Community" },
  { id: "school", label: "School" },
  { id: "ui-ux", label: "UI/UX Design" },
  { id: "graphic-design", label: "Graphic Design" },
];

export const CATEGORY_LABELS = Object.fromEntries(
  CATEGORIES.filter((cat) => cat.id !== "all").map((cat) => [cat.id, cat.label])
);

// Every project belongs to exactly one of these — it's the one shown on
// the card tag. "ui-ux"/"graphic-design" (or any future category) only
// drive the filter above and don't show up there.
export const PRIMARY_CATEGORIES = ["personal", "community", "school"];

// Turns a normal Figma file/design link into its embeddable iframe form.
function figmaEmbedUrl(figmaUrl) {
  return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(
    figmaUrl
  )}`;
}

// Prefixes a public/-relative path (e.g. "work/my-project.jpg") with the
// deployed base path. Plain "/work/..." strings work in dev but 404 once
// built for the GitHub Pages subpath (Vite only rewrites URLs it can see
// in index.html/JSX attributes, not string literals in this data file),
// so every asset path below goes through this instead.
function publicAsset(path) {
  return `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

// Replace each entry below with a real project. `categories` is an array
// of one or more of "personal", "community", "school", "ui-ux", or
// "graphic-design" — a project can fall under multiple at once, and it'll
// show up under each in the filter above. Add a `thumbnail` (built with
// publicAsset, e.g. `publicAsset("work/my-project.jpg")`, dropped in
// public/work/) once you have an image — it doubles as the large image on
// the project's detail page — until then a placeholder tile is shown in
// both places. `embedUrl` (built with figmaEmbedUrl, or publicAsset for a
// self-hosted static page dropped in public/work/) takes over from
// `thumbnail` in both spots when a live embed is more useful than a
// static image.
//
// `context`/`problem`/`process`/`outcome` are the four case-study blocks
// shown on the detail page. `processImages` holds publicAsset paths for
// the marquee under the Process block (public/work/, like thumbnail);
// leave it empty for placeholder tiles. Set `hideProcessMarquee: true` to drop the
// marquee under Process entirely instead of showing placeholder tiles.
export const PROJECTS = [
  {
    id: 1,
    title: "Columbia Build Lab (Doppel Market)",
    categories: ["school", "ui-ux"],
    year: "2026",
    thumbnail: null,
    embedUrl: figmaEmbedUrl(
      "https://www.figma.com/proto/WjtcK6km7S61QyKOMJZhNt/Figma-progress-thus-far?node-id=1161-3062&t=9vp07jZ5LSTY6RJU-0&scaling=scale-down-width&content-scaling=fixed&page-id=1161%3A5805"
    ),
    context: "Columbia Build Lab is an incubator program that matches Columbia University undergraduate/graduate students with Columbia Business School student-founders. Through the program, students are able to get hands-on experience in building a minimum viable product (MVP) with an early-stage startup. I had the pleasure of being matched with the founders of Doppel Market, a company that believes in consumers having more agency over their data.",
    problem: "When I joined the team, Doppel Market did not have a defined brand identity. This was most apparent in our website at the time, as it felt generic and disconnected from who we were. The same could be said about our logo, which was the only unique asset that had been created thus far in terms of product design.",
    process: "I sat down with the founders to learn about their story, principles, and goals for the company. I used this to create sketches of what I thought the website should look like to better reflect the ethos of the brand and showed these to the team to get feedback.",
    outcome: "Firstly, I decided to change the color of the company logo. Perhaps this seems like an inconsequential tweak, but this ended up realigning the brand's entire color story with the founders' vision. I used this new and improved color palette to build a high-fidelity prototype of the website on Figma, and worked with the engineering team to implement my design just in time for a conference where the founders presented it to potential stakeholders. I also pushed for the development of a brand identity document so it'd be easier in the future to build upon the foundation I helped to establish.",
    processImages: [],
  },
  {
    id: 4,
    title: "User Interface Design Midterm Project",
    categories: ["school", "ui-ux"],
    year: "2026",
    thumbnail: null,
    embedUrl: publicAsset("work/babajides-library.html"),
    hideProcessMarquee: true,
    context: "In the spring of 2026, I took a class called User Interface Design taught by professor Celeste Layne. For our midterm, I built a Flask-based personal music catalog, titled “babájide's library.”",
    problem: "We had to demonstrate our design skills and build a fully-featured interface with the following requisites:\nFour distinct states (home, search, add, edit)\nClear information hierarchy through Gestalt-based grouping\nA simple, limited color palette (base, accent, light grey, dark grey)\nAccessible alt text\nScannable search feedback\nAJAX-driven forms\nInline validation\nConfirmation dialogs before destructive actions",
    process: "I used a warmer, sage green color palette alongside Bebas Neue and DM Sans to create a more personal feel for my project. The home page leads with a hero and tagline into a \"popular this week\" card grid; search results highlight matched substrings inline across title, artist, album, description, and producer fields; add and edit forms validate per field, show a success banner with a direct link to the new entry, clear themselves, and refocus the first input for fast re-entry; discarding an edit prompts a confirmation dialog instead of silently dropping changes. I built the interface in Flask and Jinja2, styled it with a custom CSS variable system layered over Bootstrap's grid, and used jQuery/AJAX for the adding and editing of data. I also wrote and curated the content of the library (real songs with original descriptions).",
    outcome: "A fully functional working Flask application, submitted alongside a narrated walkthrough video demonstrating the full flow and capability of the website.",
    processImages: [],
  },
  {
    id: 5,
    title: "Jumpstarting Aspiring Developers and Entrepreneurs (JADE) 2026 Sweater",
    categories: ["community", "graphic-design"],
    year: "2026",
    thumbnail: publicAsset("work/jade-sweater-thumb.jpg"),
    context: "Jumpstarting Aspiring Developers and Entrepreneurs (JADE, for short) is a week-long immersive program for 20 first-year Columbia students after their first semester to introduce them to the tech and startup ecosystem through company visits, web development lessons, and networking with founders, investors, and alumni. After I participated in the program in winter of 2025, I returned as a program leader in the winter of 2026.",
    problem: "Each cohort of JADE gets a custom sweater for their year, and I was tasked with designing what the sweater looked like this year. The sweater is meant to be a timeless keepsake for the experience.",
    process: "The design had to be a solid color and include the cohort year, ‘JADE’, & ‘Jumpstarting Aspiring Developers and Entrepreneurs.’ I sketched out an idea on my iPad, showed it to my supervisor and got the OK, and cleaned it up in Adobe Illustrator.",
    outcome: "My supervisor got the sweaters made with my design on them, and everyone liked them a lot!",
    processImages: [
      publicAsset("work/jade-sweater-process-3.jpg"),
      publicAsset("work/jade-sweater-process-1.jpg"),
      publicAsset("work/jade-sweater-process-2.jpg"),
    ],
  },
  {
    id: 2,
    title: "Columbia Daily Spectator LGBTQ 2025 Digital Special Edition",
    categories: ["school", "ui-ux"],
    year: "2025",
    thumbnail: null,
    embedUrl: "https://lgbtq2025.columbiaspectator.com",
    context: "The Columbia Daily Spectator is one of Columbia University’s student newspapers, published by the student-led Spectator Publishing Company. During the winter of 2025, I joined the Product team of Spectator's B&I department, which oversees the design, strategy, and management of the company’s product portfolio. This portfolio includes tools that most (if not all) of the Columbia community rely on, explaining why they receive over 350,000 visitors per month.",
    problem: "I was given about a week to design the 2025 digital special edition for LGBTQ+ History Month with llitte to no direction besides the general layout of the page.",
    process: "I first created a moodboard with images, colors, and typography to express to the team what I thought the general vibe of the special edition should be. Once I got the OK from my supervisor, I created a low-fidelity prototype of the site on Figma. My supervisor built upon this to make it higher-fidelity, and I added finishing touches before sending the Figma file over to the Engineering team so they could turn the design into code.",
    outcome: "The head of the Product team tod me that this special edition was (in her opinion, of course) our best one yet, and everyone else on the team was similarly happy with the result.",
    processImages: [],
  },
  {
    id: 3,
    title: "Human-Centered Design & Innovation Project (Aspire)",
    categories: ["school", "ui-ux", "graphic-design"],
    year: "2025",
    thumbnail: null,
    context: "In the fall of 2025, I took a class called Human-Centered Design & innovation taught by Harry West (cool guy!). In the class, I learned the vocab of design methods and gained a new understanding of the design process for both simple and more complex products and services. We were put into groups of 4 and tasked with creating a product, so me and my group developed Aspire, an AI-powered styling application that generates personalized, budget-conscious fashion recommendations.",
    problem: "Our work in the class centered around a shared challenge, which first asked us to ponder upon people’s relationship with their clothes. My group and I found, through research, that our clothes often reflect who we used to be, instead of who we're becoming. This led us to the following problem statement:\n\n“While clothing serves as a practical necessity, it also functions as a symbolic language through which individuals express identity, mood, and belonging. However, while one's identity is constantly evolving, their wardrobe can't evolve with them — creating real dissatisfaction when people don't feel like any of their clothes align with who they currently are. How might we help individuals bridge the gap between who they are, who they aspire to be, and what they own?”",
    process: "Each member of the team did their own research before we came together and reflected upon our findings. We then conducted interviews to see if closet dissatisfaction was something experienced by others than ourselves. I came up with our problem statement after compiling all of our qualitative data and pulling out the recurring themes. I then designed our app icon, which set the visual and tonal direction for the prototype of our product which we worked together to build using a mix of code and artificial intelligence upon our professor’s instruction. After we had a working prototype, I improved upon the UI components after getting feedback from friends while my other team members refined the underlying AI logic.",
    outcome: "We got a favorable final evaluation and compliments from classmates on our name, logo, and ad, all of which I contributed significantly to.",
    processImages: [],
  },
  {
    id: 6,
    title: "Morningside Art Exchange (MAE) Matchboxes",
    categories: ["community", "graphic-design"],
    year: "2025",
    thumbnail: null,
    context: "The Morningside Art Exchange (also known as MAE) is a grassroots, student-led arts collective that brings together student artists and local residents. We have our titular event, the Morningside Art Exchange, quarterly at nearby parks and operate on a barter-and-donation model. We also sell merchandise that we design ourselves.",
    problem: "We were struggling to think of merchandise we could design that people could use in day-to-day life, when an idea came to me: matchboxes. The challenge from there was translating our brand identity into a small, pretty design.",
    process: "I used Photoshop to tweak an old illustration of Morningside Park I found in a Columbia University newspaper from over 50 years ago and handwrote our organization name in the top right corner.",
    outcome: "We debuted the matchboxes at the Morningside Art Exchange we had in late 2025, and they sold out! People loved the design.",
    processImages: [],
  },
  {
    id: 7,
    title: "Morningside Art Exchange (MAE) Bacchanal Shirt",
    categories: ["community", "graphic-design"],
    year: "2025",
    thumbnail: null,
    context: "The Morningside Art Exchange (also known as MAE) is a grassroots, student-led arts collective that brings together student artists and local residents. We have our titular event, the Morningside Art Exchange, quarterly at nearby parks and operate on a barter-and-donation model. We also sell merchandise that we design ourselves.",
    problem: "Bacchanal is Columbia University's spring semester music festival, run by a student organization of the same name. I wasn't the biggest fan of the merchandise they released in 2025, so I designed my own.",
    process: "I used Illustrator to design the type featured on the shirt and used Photoshop to create a promotional poster. We then created a screen out of my design and screenprinted a few blank shirts we got from thrift stores.",
    outcome: "We sold the shirts the day of Bacchanal and sold out! The shirts were well received by the team and our community.",
    processImages: [],
  },
  {
    id: 8,
    title: "Morningside Art Exchange (MAE) Stickers/Temporary Tattoo",
    categories: ["community", "graphic-design"],
    year: "2025",
    thumbnail: null,
    context: "The Morningside Art Exchange (also known as MAE) is a grassroots, student-led arts collective that brings together student artists and local residents. We have our titular event, the Morningside Art Exchange, quarterly at nearby parks and operate on a barter-and-donation model. We also sell merchandise that we design ourselves.",
    problem: "We always are looking for new merchandise we can give away at events and ways to do experential marketing.",
    process: "I sketched out a lipstick kiss mark with 'MAE' hidden in it on my iPad before cleaning it up on Illustrator. I printed them out as stickers at my school's design center and on temporary tattoo paper.",
    outcome: "This is arguably our most popular merch item, and I'm quite proud of the design.",
    processImages: [],
  },
  {
    id: 9,
    title: "The Crown Recruitment Poster",
    categories: ["community", "graphic-design"],
    year: "2025",
    thumbnail: null,
    context: "The Crown Magazine is a Columbia University organization meant to highlight the soul and drive of the Black Columbia community.",
    problem: "My friend who runs the organization requested I make a flyer for recruitment that had a newspaper clippings collage kinda vibe.",
    process: "I used Photoshop and images from Black magazines to create a visually striking collage.",
    outcome: "When I sent the flyer back, my friend replied with \"God will bless your family tenfold. this is exquisite,\" which I took as confirmation that he liked it. It was subsequently posted on the organization's Instagram and printed out to display across campus.",
    processImages: [],
  },
  {
    id: 11,
    title: "Decision Day Photoshoot",
    categories: ["personal", "graphic-design"],
    year: "2024",
    thumbnail: null,
    context: "In December of 2023, I was accepted to Columbia University on a full ride scholarship through the Questbridge National College Match.",
    problem: "I wanted to do a photoshoot to celebrate my academic achievement.",
    process: "I created a moodboard, booked a studio and asked my friend to take my pictures, and edited them on Photoshhop.",
    outcome: "I posted my photoshoot on TikTok & Instagram and went viral, amassing over 35,000 likes across both platforms.",
    processImages: [],
  },
  {
    id: 10,
    title: "Baji Buck",
    categories: ["school", "graphic-design"],
    year: "2023",
    thumbnail: null,
    context: "In 2022, I ran for treasurer of my high school's student council and created the 'Baji Buck' as a means of merchandise marketing. After winning, I ran for president the following year.",
    problem: "I wanted to improve upon my original design with my increased knowledge in Photoshop.",
    process: "I used Photoshop to redesign the one dollar bill and hundred dollar bill to have my face and high school on it.",
    outcome: "I won the presidency!",
    processImages: [],
  },
];
