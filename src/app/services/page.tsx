'use client';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Stethoscope, Eye, Bone, Smile, Pill, Syringe, TestTube } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { ServiceCard } from "@/components/ServiceCard";
import { client, urlFor } from "@/lib/sanity";

// Custom Icon Components
const OtorhinolaryngologyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 12c0-2.209 1.791-4 4-4s4 1.791 4 4c0 1.503-.824 2.805-2 3.465V18h-4v-2.535c-1.176-.66-2-1.962-2-3.465z" />
    <path d="M10 4a2 2 0 1 1 4 0" />
    <path d="M12 18v2" />
    <path d="M8 10V8a4 4 0 0 1 4-4" />
    <path d="M16 10V8a4 4 0 0 0-4-4" />
  </svg>
);

const ObGyneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2C8.686 2 6 4.686 6 8c0 3.866 4.314 12 6 12s6-8.134 6-12c0-3.314-2.686-6-6-6z" />
    <circle cx="12" cy="8" r="2" />
  </svg>
);

const DentistryIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12.5 5.5c-1-2.5-3-3-4.5-3-2.5 0-4.5 2-4.5 4.5 0 2.43 1.97 4.5 4.5 4.5h4.5c2.5 0 4.5-2.07 4.5-4.5 0-2.5-2-4.5-4.5-4.5-1.5 0-3.5.5-4.5 3Z" />
    <path d="m18.5 11 .5 2.5" />
    <path d="m5 11-.5 2.5" />
    <path d="m17 16-1-1" />
    <path d="m7 16 1-1" />
    <path d="M15 19.5a2.5 2.5 0 0 1-5 0" />
  </svg>
);

const LungIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 20a4 4 0 0 0-4-4H6a2 2 0 0 0-2 2v2" />
    <path d="M12 20a4 4 0 0 1 4-4h2a2 2 0 0 1 2 2v2" />
    <path d="M12 4v5" />
    <path d="M10 9a2 2 0 0 1-2-2V5.5a2.5 2.5 0 0 1 5 0V7a2 2 0 0 1-2 2Z" />
    <path d="M18 10a2 2 0 0 1-2-2V5.5a2.5 2.5 0 0 1 5 0V7a2 2 0 0 1-2 2Z" />
  </svg>
);

// Icon mapping function
const getIcon = (iconName: string) => {
  const icons = {
    stethoscope: Stethoscope,
    eye: Eye,
    bone: Bone,
    smile: Smile,
    pill: Pill,
    syringe: Syringe,
    testtube: TestTube,
    ent: OtorhinolaryngologyIcon,
    lung: LungIcon,
    obgyne: ObGyneIcon,
    dentistry: DentistryIcon,
  };
  return icons[iconName as keyof typeof icons] || Stethoscope;
};

// Sanity query
const SERVICES_PAGE_QUERY = `*[_type == "servicesPage"][0] {
  _id,
  heroSection {
    title,
    description,
    heroImage {
      asset
    }
  },
  experienceSection {
    title,
    backgroundImage {
      asset
    }
  },
  whatWeOfferSection {
    title,
    description,
    ourServicesTab {
      tabTitle,
      services[] {
        title,
        subtitle,
        icon,
        details,
        order
      }
    },
    clinicalServicesTab {
      tabTitle,
      services[] {
        title,
        subtitle,
        icon,
        details,
        order
      }
    }
  },
  ctaSection {
    title,
    description,
    primaryButton {
      text,
      link
    },
    secondaryButton {
      text,
      link
    }
  }
}`;

// Types
interface Service {
  title: string;
  subtitle: string;
  icon: string;
  details: string[];
  order?: number;
}

interface ServicesPageData {
  _id: string;
  heroSection: {
    title: string;
    description: string;
    heroImage?: {
      asset: any;
    };
  };
  experienceSection: {
    title: string;
    backgroundImage?: {
      asset: any;
    };
  };
  whatWeOfferSection: {
    title: string;
    description: string;
    ourServicesTab: {
      tabTitle: string;
      services: Service[];
    };
    clinicalServicesTab: {
      tabTitle: string;
      services: Service[];
    };
  };
  ctaSection: {
    title: string;
    description: string;
    primaryButton: {
      text: string;
      link: string;
    };
    secondaryButton: {
      text: string;
      link: string;
    };
  };
}

// ResponsiveServices Component
const ResponsiveServices = ({ currentServices, openItems, toggleItem, activeTab }: {
  currentServices: Service[];
  openItems: Set<number>;
  toggleItem: (index: number) => void;
  activeTab: 'medical' | 'clinical';
}) => {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1024) setColumns(3);
      else if (window.innerWidth >= 768) setColumns(2);
      else setColumns(1);
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const columnsArray = Array.from({ length: columns });

  // Sort services by order
  const sortedServices = [...currentServices].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]">
      {columnsArray.map((_, colIndex) => (
        <div
          key={colIndex}
          className="flex-1 space-y-4 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
        >
          {sortedServices
            .filter((_, index) => index % columns === colIndex)
            .map((service, serviceIndex) => {
              const originalIndex = sortedServices.findIndex(s => s.title === service.title);
              const isOpen = openItems.has(originalIndex);

              // Convert service to format expected by ServiceCard
              const serviceForCard = {
                ...service,
                icon: getIcon(service.icon)
              };

              return (
                <div
                  key={`${activeTab}-${originalIndex}`}
                  className={`relative transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform 
                              ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-[0.98] opacity-90 translate-y-1'}
                             `}
                  style={{
                    zIndex: isOpen ? 20 : 1,
                  }}
                >
                  <ServiceCard
                    service={serviceForCard}
                    isOpen={isOpen}
                    onToggle={() => toggleItem(originalIndex)}
                  />
                </div>
              );
            })}
        </div>
      ))}
    </div>
  );
};

export default function ServicesPage() {
  const [pageData, setPageData] = useState<ServicesPageData | null>(null);
  const [activeTab, setActiveTab] = useState<'medical' | 'clinical'>('medical');
  const [openItems, setOpenItems] = useState(new Set<number>());
  const [loading, setLoading] = useState(true);

  // Handle hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash === "clinical-services") {
        setActiveTab('clinical');
      } else if (hash === "our-services") {
        setActiveTab('medical');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const data = await client.fetch(SERVICES_PAGE_QUERY);
        setPageData(data);
      } catch (error) {
        console.error('Error fetching services page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  const toggleItem = (index: number) => {
    setOpenItems(prevOpenItems => {
      const newOpenItems = new Set(prevOpenItems);
      if (newOpenItems.has(index)) {
        newOpenItems.delete(index);
      } else {
        newOpenItems.clear();
        newOpenItems.add(index);
      }
      return newOpenItems;
    });
  };

  const handleTabChange = (tab: 'medical' | 'clinical') => {
    setActiveTab(tab);
    setOpenItems(new Set());
    // Update URL hash
    const hashMap = { medical: 'our-services', clinical: 'clinical-services' };
    window.history.replaceState(null, '', `#${hashMap[tab]}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Failed to load page content.</p>
        </div>
      </div>
    );
  }

  const currentServices = activeTab === 'medical' 
    ? pageData.whatWeOfferSection.ourServicesTab.services 
    : pageData.whatWeOfferSection.clinicalServicesTab.services;

  const heroImageSrc = pageData.heroSection.heroImage 
    ? urlFor(pageData.heroSection.heroImage.asset).width(700).height(500).url()
    : "/contact.jpg";

  const experienceBackgroundSrc = pageData.experienceSection.backgroundImage 
    ? urlFor(pageData.experienceSection.backgroundImage.asset).width(1600).height(600).url()
    : "/contact.jpg";

  return (
    <div className="flex flex-col mx-auto">
      {/* Hero Section */}
      <section className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 items-center">
            <div className="items-center">
              <h1 className="font-headline text-5xl md:text-7xl text-primary md:mx-24 md:text-left">
                {pageData.heroSection.title}
              </h1>
              <p className="mt-4 text-muted-foreground max-w-lg mx-auto md:mx-24 md:text-left">
                {pageData.heroSection.description}
              </p>
            </div>
            <div className="relative flex justify-center items-center h-64 md:h-[500px]">
              <div className="relative w-64 h-64 md:w-[700px] md:h-[500px]">
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid meet"
                  className="absolute top-0 left-0 w-full h-full z-10"
                >
                  <defs>
                    <clipPath id="roundedHex" clipPathUnits="objectBoundingBox">
                      <path d="
                        M 0.3 0.05
                        L 0.7 0.05
                        Q 0.8 0.05 0.85 0.15
                        L 0.95 0.4
                        Q 1 0.5 0.95 0.6
                        L 0.85 0.85
                        Q 0.8 0.95 0.7 0.95
                        L 0.3 0.95
                        Q 0.2 0.95 0.15 0.85
                        L 0.05 0.6
                        Q 0 0.5 0.05 0.4
                        L 0.15 0.15
                        Q 0.2 0.05 0.3 0.05
                        Z
                      " />
                    </clipPath>
                  </defs>
                </svg>

                <Image
                  src={heroImageSrc}
                  alt="Hospital Interior"
                  fill
                  className="object-cover"
                  style={{ clipPath: 'url(#roundedHex)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="relative py-16 bg-gray-800 text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('${experienceBackgroundSrc}')` }}
        ></div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-wider">
            {pageData.experienceSection.title}
          </h2>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-16 bg-background" id="clinical-services">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">
              {pageData.whatWeOfferSection.title}
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {pageData.whatWeOfferSection.description}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12 transition-all duration-300 ease-in-out">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex">
              <button
                onClick={() => handleTabChange('medical')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === 'medical'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {pageData.whatWeOfferSection.ourServicesTab.tabTitle}
              </button>
              <button
                onClick={() => handleTabChange('clinical')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === 'clinical'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {pageData.whatWeOfferSection.clinicalServicesTab.tabTitle}
              </button>
            </div>
          </div>

          {/* Services Grid */}
          <ResponsiveServices
            currentServices={currentServices}
            openItems={openItems}
            toggleItem={toggleItem}
            activeTab={activeTab}
          />
          
          {/* Tab Indicator for Mobile */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-primary">
                {activeTab === 'medical' 
                  ? pageData.whatWeOfferSection.ourServicesTab.tabTitle 
                  : pageData.whatWeOfferSection.clinicalServicesTab.tabTitle
                }
              </span> • {currentServices.length} services available
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="appointment" className="bg-secondary py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {pageData.ctaSection.title}
            </h2>
            <p className="mx-auto mt-4 max-w-4xl text-lg text-muted-foreground lg:text-xl">
              {pageData.ctaSection.description}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:gap-6">
              <Button asChild size="lg" className="text-base lg:text-lg px-6 lg:px-8 [box-shadow:0_3px_5px_rgba(0,0,0,0.2)] hover:[box-shadow:0_6px_6px_rgba(0,0,0,0.15)] transition-shadow duration-300">
                <Link href={pageData.ctaSection.primaryButton.link}>
                  {pageData.ctaSection.primaryButton.text}
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="text-base lg:text-lg px-6 lg:px-8 hover:bg-transparent hover:text-primary transition-colors">
                <Link href={pageData.ctaSection.secondaryButton.link}>
                  {pageData.ctaSection.secondaryButton.text}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}