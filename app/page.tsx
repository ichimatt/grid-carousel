import Carousel from "./components/carousel"

const guides = [
  { title: "Eating your way through a city", tag: "Food" },
  { title: "Packing for four climates", tag: "Essentials" },
  { title: "Shoulder-season strategy", tag: "Planning" },
  { title: "Museums worth the queue", tag: "Culture" },
  { title: "Trains over planes", tag: "Transit" },
  { title: "Working from anywhere", tag: "Remote" },
]

const destinations = [
  {
    name: "Kyoto",
    region: "Japan",
    blurb: "Temples, tea houses, and quiet gardens.",
  },
  {
    name: "Lisbon",
    region: "Portugal",
    blurb: "Tiled hills and slow riverside evenings.",
  },
  {
    name: "Oaxaca",
    region: "Mexico",
    blurb: "Markets, mole, and mezcal country.",
  },
  {
    name: "Reykjavík",
    region: "Iceland",
    blurb: "A basecamp for waterfalls and lava fields.",
  },
  {
    name: "Marrakech",
    region: "Morocco",
    blurb: "Souks and courtyards behind pink walls.",
  },
  {
    name: "Queenstown",
    region: "New Zealand",
    blurb: "Alpine lakes with an adrenaline habit.",
  },
  {
    name: "Tbilisi",
    region: "Georgia",
    blurb: "Sulfur baths and supra feasts.",
  },
  {
    name: "Cartagena",
    region: "Colombia",
    blurb: "Color-soaked streets on the Caribbean.",
  },
]

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-white px-12 py-16 font-sans text-zinc-900 dark:bg-black dark:text-zinc-100 overflow-x-hidden">
      <main className="w-full max-w-2xl xl:max-w-7xl ">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">
            Featured destinations
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Swipe, scroll, or use the controls below — one page of slides at a
            time.
          </p>
        </header>
        <div className="mt-6">
          <Carousel
            label="Featured destinations"
            slidesPerView={{ 0: 1, 512: 2, 900: 3 }}
            bleed
            className="[--carousel-fade:white] dark:[--carousel-fade:black]"
          >
            {destinations.map((destination, index) => (
              <article
                key={destination.name}
                className="flex aspect-[4/3] flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <span className="text-6xl font-semibold text-zinc-200 dark:text-zinc-700">
                  {index + 1}
                </span>
                <div>
                  <h2 className="text-lg font-medium">{destination.name}</h2>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {destination.region} — {destination.blurb}
                  </p>
                </div>
              </article>
            ))}
          </Carousel>
        </div>

        <section className="mt-24 grid gap-8 xl:grid-cols-12 xl:gap-x-gutter">
          <div className="xl:col-span-3 py-12">
            <h2 className="text-2xl font-semibold tracking-tight">
              Guides for your next trip
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              The same carousel component beside other content. It sizes to its
              container, not the viewport, and this instance is configured to
              top out at two slides per page.
            </p>
          </div>
          <Carousel
            label="Travel guides"
            slidesPerView={{ 0: 1, 512: 2 }}
            peek="1rem"
            bleed
            className="xl:col-span-8 xl:col-start-5 [--carousel-fade:white] dark:[--carousel-fade:black]"
          >
            {guides.map((guide, index) => (
              <article
                key={guide.title}
                className="flex aspect-[4/3] flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <span className="w-fit rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {guide.tag}
                </span>
                <div>
                  <span className="text-sm text-zinc-400 dark:text-zinc-500">
                    Guide {index + 1}
                  </span>
                  <h3 className="mt-1 text-lg font-medium">{guide.title}</h3>
                </div>
              </article>
            ))}
          </Carousel>
        </section>
        <section className="hidden xl:flex justify-center fixed top-0 left-0 w-screen h-screen pointer-events-none px-12 z-50 opacity-20">
          <div className="grid grid-cols-12 gap-x-gutter w-full max-w-7xl">
            <div className="h-full col-span-4 border-x-amber-200 border-x"></div>
            <div className="h-full col-span-4 border-x-amber-200 border-x"></div>
            <div className="h-full col-span-4 border-x-amber-200 border-x"></div>
          </div>
        </section>
      </main>
    </div>
  )
}
