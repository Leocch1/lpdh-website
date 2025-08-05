import Image from "next/image";
import { client, HISTORY_PAGE_QUERY, urlFor } from "@/lib/sanity";
import type { HistoryPage } from "@/types/sanity";

const HexagonImage = ({
  src,
  alt,
  dataAiHint,
  className = "",
}: {
  src: string;
  alt: string;
  dataAiHint?: string;
  className?: string;
}) => {
  return (
    <div
      className={`relative ${className}`}
      style={{
        clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
      }}
    >
      <Image
        src={src}
        alt={alt}
        data-ai-hint={dataAiHint}
        fill
        sizes="(max-width: 768px) 100vw, 220px"
        className="object-cover"
      />
    </div>
  );
};

export default async function HistoryPage() {
  const historyData: HistoryPage = await client.fetch(HISTORY_PAGE_QUERY, {}, { cache: 'no-store' });

  if (!historyData) {
    return (
      <div className="bg-background text-foreground py-12 md:py-24 w-full">
        <div className="container mx-auto px-4">
          <header className="text-center mb-12 md:mb-20">
            <h1 className="font-headline text-5xl md:text-6xl font-bold text-primary tracking-tight">
              History page content not found
            </h1>
            <p className="text-muted-foreground mt-4">
              Please add content through Sanity Studio.
            </p>
          </header>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground py-12 md:py-16 w-full">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12 md:mb-20">
          <h1 className="font-headline text-5xl md:text-6xl font-bold text-primary tracking-tight">
            {historyData.heroSection.headline}
          </h1>
        </header>

        <section className="py-2 mb-12 xl:mb-20">
          <div className="container mx-auto px-4 md:px-0">
            <div className="flex flex-col xl:flex-row items-center gap-8">
              
              {/* LEFT COLUMN: Hexagon Images */}
              <div className="relative flex flex-col items-center gap-4 xl:block xl:min-h-[400px] w-full xl:w-1/2">
                
                {/* MOBILE, TABLET & SMALL DESKTOP: Stack images */}
                <div className="block xl:hidden space-y-4">
                  {historyData.heroSection.images?.slice(0, 3).map((img, index) => (
                    <HexagonImage 
                      key={img._key}
                      src={urlFor(img.image).width(400).height(320).url()} 
                      alt={img.alt}
                      dataAiHint={img.aiHint}
                      className="w-96 h-80"
                    />
                  ))}
                </div>

                {/* LARGE DESKTOP ONLY: Layered/absolute layout */}
                <div className="hidden xl:block relative h-[400px] xl:bottom-[150px] xl:left-[200px]">
                  {historyData.heroSection.images?.slice(0, 3).map((img, index) => {
                    const positions = [
                      "absolute top-[90px] left-[100px] w-80 h-64",
                      "absolute bottom-8 right-[150px] w-80 h-64", 
                      "absolute bottom-[155px] left-[100px] w-80 h-64"
                    ];
                    return (
                      <HexagonImage 
                        key={img._key}
                        src={urlFor(img.image).width(320).height(256).url()} 
                        alt={img.alt}
                        dataAiHint={img.aiHint}
                        className={positions[index]}
                      />
                    );
                  })}
                </div>
              </div>

              {/* RIGHT COLUMN: Text Content */}
              <div className="w-full xl:w-1/2">
                <p className="text-muted-foreground mb-8">
                  {historyData.heroSection.description}
                </p>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  {historyData.heroSection.newEraTitle}
                </h2>
                <p className="text-muted-foreground">
                  {historyData.heroSection.newEraContent}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-0 text-left">
          {historyData.historySections?.map((section, index) => (
            <div 
              key={section._key}
              className={`py-12 md:py-16 ${
                index % 2 === 0 ? 'bg-secondary' : 'bg-background'
              }`}
            >
              <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-foreground mb-4">{section.title}</h2>
                <p className="text-muted-foreground">{section.content}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
