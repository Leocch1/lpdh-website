"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { client, ABOUT_PAGE_QUERY, HEALTH_ADVISORIES_QUERY, NEWS_UPDATES_QUERY, urlFor } from "@/lib/sanity";
import type { AboutPage, HealthAdvisory, NewsUpdate } from "@/types/sanity";


const getCardsPerView = () => {
  if (typeof window === "undefined") return 1;
  const width = window.innerWidth;
  if (width >= 1024) return 3; // lg
  if (width >= 768) return 2;  // md
  return 1;                    // sm
};

const getHealthCardsPerView = () => {
  if (typeof window === "undefined") return 1;
  const width = window.innerWidth;
  if (width >= 1536) return 5; // 2xl - show 5 cards
  if (width >= 1280) return 4; // xl - show 4 cards  
  if (width >= 1024) return 3; // lg - show 3 cards
  if (width >= 768) return 2;  // md - show 2 cards
  return 1;                    // sm - show 1 card
};

// Custom hook to hide scrollbar
const useHideScrollbar = (ref: React.RefObject<HTMLElement | null>) => {
    useEffect(() => {
        const element = ref.current;
        if (element) {
            const style = document.createElement('style');
            style.innerHTML = `
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `;
            document.head.appendChild(style);
            element.classList.add('no-scrollbar');

            return () => {
                document.head.removeChild(style);
            };
        }
    }, [ref]);
};

// Generic carousel hook
const useCarousel = (totalItems: number, cardsPerView: number) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

    const totalSlides = Math.ceil(totalItems / cardsPerView);

    useHideScrollbar(containerRef);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let isDown = false;
        let startX: number;
        let scrollLeft: number;

        const onMouseDown = (e: MouseEvent) => {
            isDown = true;
            container.classList.add("cursor-grabbing");
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        };

        const onMouseLeaveOrUp = () => {
            isDown = false;
            container.classList.remove("cursor-grabbing");
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 1.5;
            container.scrollLeft = scrollLeft - walk;
        };

        const handleScroll = () => {
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }
            scrollTimeout.current = setTimeout(() => {
                if (container) {
                    const slideWidth = container.scrollWidth / totalSlides;
                    const newSlide = Math.round(container.scrollLeft / slideWidth);
                    if (newSlide !== currentSlide) {
                        setCurrentSlide(newSlide);
                    }
                }
            }, 150);
        };

        container.addEventListener("mousedown", onMouseDown);
        container.addEventListener("mouseleave", onMouseLeaveOrUp);
        container.addEventListener("mouseup", onMouseLeaveOrUp);
        container.addEventListener("mousemove", onMouseMove);
        container.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            container.removeEventListener("mousedown", onMouseDown);
            container.removeEventListener("mouseleave", onMouseLeaveOrUp);
            container.removeEventListener("mouseup", onMouseLeaveOrUp);
            container.removeEventListener("mousemove", onMouseMove);
            container.removeEventListener('scroll', handleScroll);
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }
        };
    }, [currentSlide, totalSlides]);

    const goToSlide = (slideIndex: number) => {
        setCurrentSlide(slideIndex);
        if (containerRef.current) {
            const slideWidth = containerRef.current.scrollWidth / totalSlides;
            containerRef.current.scrollTo({
                left: slideWidth * slideIndex,
                behavior: 'smooth'
            });
        }
    };

    return { containerRef, currentSlide, totalSlides, goToSlide };
};


export default function AboutPage() {
  const [cardsPerView, setCardsPerView] = useState(3);
  const [healthCardsPerView, setHealthCardsPerView] = useState(5);
  const [aboutData, setAboutData] = useState<AboutPage | null>(null);
  const [healthAdvisories, setHealthAdvisories] = useState<HealthAdvisory[]>([]);
  const [newsUpdates, setNewsUpdates] = useState<NewsUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutPageData, healthAdvisoriesData, newsUpdatesData] = await Promise.all([
          client.fetch(ABOUT_PAGE_QUERY),
          client.fetch(HEALTH_ADVISORIES_QUERY),
          client.fetch(NEWS_UPDATES_QUERY)
        ]);
        
        setAboutData(aboutPageData);
        setHealthAdvisories(healthAdvisoriesData);
        setNewsUpdates(newsUpdatesData);
      } catch (error) {
        console.error('Error fetching about page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(getCardsPerView());
      setHealthCardsPerView(getHealthCardsPerView());
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { 
    containerRef: healthContainerRef, 
    currentSlide: currentHealthSlide, 
    totalSlides: totalHealthSlides, 
    goToSlide: goToHealthSlide 
  } = useCarousel(healthAdvisories.length, healthCardsPerView);

  const {
    containerRef: updatesContainerRef,
    currentSlide: currentUpdatesSlide,
    totalSlides: totalUpdatesSlides,
    goToSlide: goToUpdatesSlide
  } = useCarousel(newsUpdates.length, cardsPerView);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">About page content not found.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl"> 
      <section className="relative grid md:grid-cols-2 min-h-[60vh]">
        <div className="flex items-center justify-center bg-background order-2 md:order-1">
            <div className="p-8 lg:p-16 max-w-2xl text-center md:text-left">
              <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary">
                {aboutData.title}
              </h1>
              <p className="mt-2 text-xl md:text-2xl font-semibold text-foreground">{aboutData.subtitle}</p>
              <p className="mt-4 text-muted-foreground">
                {aboutData.description}
              </p>
              <Link href="/about/history">
                <Button variant="outline" className="mt-6">
                  See History
                </Button>
              </Link>
            </div>
        </div>
        <div className="relative order-1 md:order-2 min-h-[300px] md:min-h-0">
          {aboutData.heroImage ? (
            <Image
              src={urlFor(aboutData.heroImage).url()}
              alt={aboutData.heroImage.alt || "Las Pinas Doctors Hospital Building"}
              fill
              className="object-cover"
            />
          ) : (
            <Image
              src="/lpdh.jpg"
              alt="Las Pinas Doctors Hospital Building"
              data-ai-hint="hospital building exterior"
              fill
              className="object-cover"
            />
          )}
        </div>
      </section>

      <section className="text-primary-foreground py-12 md:py-6" style={{ backgroundColor: '#169A53' }}>
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
            
            {/* Vision */}
            <div className="flex flex-col justify-center text-center py-14 md:py-24 md:text-left md:border-r md:border-primary-foreground/30 md:pr-8">
              <div>
                <h3 className="font-headline text-2xl font-bold mb-4">Vision</h3>
                <p className="text-primary-foreground/90 text-base md:text-sm">
                  {aboutData.vision}
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="flex flex-col justify-center text-center py-14 md:py-24 md:text-left md:border-r md:border-primary-foreground/30 md:px-8">
              <div>
                <h3 className="font-headline text-2xl font-bold mb-4">Mission</h3>
                <ul className="space-y-3 text-primary-foreground/90 text-base md:text-sm">
                  {aboutData.mission.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Core Values */}
            <div className="flex flex-col justify-center text-center py-14 md:py-24 md:text-left md:pl-8">
              <div>
                <h3 className="font-headline text-2xl font-bold mb-6">Core Values</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-base md:text-sm">
                  {aboutData.coreValues.map(item => (
                    <div key={item.value} className="flex items-center">
                      <span className="font-bold text-lg">{item.letter}</span>
                      <span className="ml-2">- {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-12 md:grid-cols-2 max-w-5xl mx-auto">
            <div className="flex justify-center order-2 md:order-1">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1365.9538245878366!2d120.99304411579483!3d14.455905607615515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397ce0f2edbcfe3%3A0x9c937ce6d1bcb34b!2sLas%20Pi%C3%B1as%20Doctors%20Hospital!5e0!3m2!1sen!2sph!4v1753490446530!5m2!1sen!2sph"
                className="w-full max-w-[600px] h-[300px] md:h-[400px] border-0 rounded-lg shadow-lg"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="text-center md:text-left order-1 md:order-2">
              <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-primary">
                Find Us Here
              </h2>
              <p className="text-lg text-muted-foreground">
                #8009 CAA Road, Pulonglupa II, Las Pinas City, Metro Manila, Philippines, 1742
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16" style={{ backgroundColor: '#c2d7c9' }}>
        <div className="container mx-auto px-4 w-[80%] max-w-[1600px]">
          <h2 className="font-headline text-3xl font-bold text-center mb-8 text-foreground">What's Happening</h2>
          <div
          ref={healthContainerRef}
          className="flex items-stretch gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 cursor-grab select-none"
          style={{ minHeight: '400px' }}
        >
            {healthAdvisories.map((advisory, index) => (
              <div
                key={advisory._id}
                className="snap-center flex-shrink-0"
                style={{ width: `calc((100% / ${healthCardsPerView}) - 1rem)` }}
              >
                <Card className="h-full flex flex-col bg-white shadow-lg rounded-lg overflow-hidden min-h-[380px]">
                  <div className="relative h-48 w-full flex-shrink-0">
                    {advisory.image ? (
                      <Image
                        src={urlFor(advisory.image).url()}
                        alt={advisory.image.alt || advisory.title}
                        fill
                        className="object-cover pointer-events-none"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No image</span>
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold leading-tight">{advisory.title}</CardTitle>
                  </CardHeader>
                  {advisory.description && (
                    <CardContent className="flex-grow pt-0 pb-3">
                      <p className="text-sm text-muted-foreground line-clamp-3">{advisory.description}</p>
                    </CardContent>
                  )}
                  {advisory.link && (
                    <CardFooter className="pt-0 mt-auto">
                      <Link 
                        href={advisory.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        View <ArrowRight className="h-4 w-4" />
                      </Link>
                    </CardFooter>
                  )}
                </Card>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: totalHealthSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToHealthSlide(index)}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  index === currentHealthSlide ? "bg-primary" : "bg-gray-400 hover:bg-gray-500"
                )}
                aria-label={`Go to health slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16" style={{ backgroundColor: '#c2d7c9' }}>
        <div className="container mx-auto px-4 max-w-[1400px]">
          <h2 className="font-headline text-3xl font-bold text-center mb-8 text-foreground">News & Updates</h2>
          <div
            ref={updatesContainerRef}
            className="flex items-stretch gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 cursor-grab select-none"
          >
            {newsUpdates.map((update, index) => (
              <div
                key={update._id}
                className="snap-center flex-shrink-0"
                style={{ width: `calc((100% / ${cardsPerView}) - 1rem)` }}
              >
                {update.image ? (
                  update.link ? (
                    <a
                      href={update.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-[700px] relative group cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Image
                        src={urlFor(update.image).url()}
                        alt={update.image.alt || update.title}
                        width={300}
                        height={800}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Overlay for visual feedback */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-2">
                          <ArrowRight className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </a>
                  ) : (
                    <div className="w-full h-[700px] relative">
                      <Image
                        src={urlFor(update.image).url()}
                        alt={update.image.alt || update.title}
                        width={300}
                        height={800}
                        className="w-full h-full object-cover pointer-events-none"
                      />
                    </div>
                  )
                ) : (
                  <div className="w-full h-[700px] bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: totalUpdatesSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToUpdatesSlide(index)}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  index === currentUpdatesSlide ? "bg-primary" : "bg-gray-400 hover:bg-gray-500"
                )}
                aria-label={`Go to update slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      
    </div>
  );
}
