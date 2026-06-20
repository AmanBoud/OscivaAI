import { SectionHeading, Reveal } from "./_primitives";

/* Real brand marks via Simple Icons CDN (monochrome). Two honest groups:
 * the AI providers Osciva runs on, and the platforms you can embed the widget into. */
const providers = [
  { slug: "openai", name: "OpenAI" },
  { slug: "anthropic", name: "Anthropic" },
  { slug: "googlegemini", name: "Gemini" },
  { slug: "ollama", name: "OpenRouter" },
];

const platforms = [
  { slug: "wordpress", name: "WordPress" },
  { slug: "shopify", name: "Shopify" },
  { slug: "react", name: "React" },
  { slug: "webflow", name: "Webflow" },
  { slug: "wix", name: "Wix" },
  { slug: "framer", name: "Framer" },
  { slug: "squarespace", name: "Squarespace" },
  { slug: "html5", name: "Any website" },
];

function LogoTile({ slug, name }: { slug: string; name: string }) {
  return (
    <div className="group flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-[#EBEDF0] bg-white py-6 hover:border-[#0EC2A8]/40 hover:shadow-sm transition-all">
      <img
        src={`https://cdn.simpleicons.org/${slug}/0B0E14`}
        alt={name}
        className="h-7 w-7 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
        loading="lazy"
      />
      <span className="text-[12px] font-medium text-[#586072]">{name}</span>
    </div>
  );
}

export default function IntegrationsSection() {
  return (
    <section className="bg-[#F7F8FA] py-20 md:py-28 px-5 sm:px-6">
      <div className="max-w-[1100px] mx-auto">
        <SectionHeading
          title="Works with the tools you already use"
          subtitle="Run any major AI model on your own key, then drop your agent into any website or stack."
        />

        <Reveal i={1}>
          <p className="mt-12 mb-4 text-center text-[12px] font-semibold uppercase tracking-[0.14em] text-[#A2AAB6]">
            AI providers
          </p>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {providers.map((p, i) => (
            <Reveal key={p.name} i={i}>
              <LogoTile {...p} />
            </Reveal>
          ))}
        </div>

        <Reveal i={1}>
          <p className="mt-12 mb-4 text-center text-[12px] font-semibold uppercase tracking-[0.14em] text-[#A2AAB6]">
            Embed anywhere
          </p>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {platforms.map((p, i) => (
            <Reveal key={p.name} i={i}>
              <LogoTile {...p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
