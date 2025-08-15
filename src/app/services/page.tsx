'use client';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Stethoscope, Eye, Bone, Smile, Pill, Syringe, TestTube, Heart, Brain, Shield, Activity } from "lucide-react";
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
    heart: Heart,
    brain: Brain,
    shield: Shield,
    activity: Activity,
    ent: OtorhinolaryngologyIcon,
    lung: LungIcon,
    obgyne: ObGyneIcon,
    dentistry: DentistryIcon,
  };
  return icons[iconName as keyof typeof icons] || Stethoscope;
};

// Updated Sanity query to include both legacy and new fields
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
    // Legacy fields
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
    },
    // New flexible tabs
    serviceTabs[] {
      tabTitle,
      tabKey,
      tabDescription,
      services[] {
        title,
        subtitle,
        icon,
        details,
        order
      },
      order
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

// Types - Updated for backward compatibility
interface Service {
  title: string;
  subtitle: string;
  icon: string;
  details: string[];
  order?: number;
}

interface ServiceTab {
  tabTitle: string;
  tabKey: string;
  tabDescription?: string;
  services: Service[];
  order?: number;
}

interface LegacyTab {
  tabTitle: string;
  services: Service[];
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
    // Legacy fields
    ourServicesTab?: LegacyTab;
    clinicalServicesTab?: LegacyTab;
    // New flexible tabs
    serviceTabs?: ServiceTab[];
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
const ResponsiveServices = ({ currentServices, openItems, toggleItem, activeTabKey, setOpenItems }: {
  currentServices: Service[];
  openItems: Set<number>;
  toggleItem: (index: number) => void;
  activeTabKey: string;
  setOpenItems: React.Dispatch<React.SetStateAction<Set<number>>>;
}) => {
  const [columns, setColumns] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate services per page based on screen size
  const getServicesPerPage = (cols: number) => {
    if (cols >= 3) return 12; // Desktop: 4x3 grid
    if (cols === 2) return 8;  // Tablet: 4x2 grid
    return 4; // Mobile: 1x4 grid
  };

  const servicesPerPage = getServicesPerPage(columns);

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

  // Reset to first page when active tab changes
  useEffect(() => {
    setCurrentPage(1);
    setOpenItems(new Set()); // Close all open items when changing tabs
  }, [activeTabKey]);

  // Reset to first page when columns change (responsive)
  useEffect(() => {
    setCurrentPage(1);
  }, [columns]);

  const columnsArray = Array.from({ length: columns });

  // Sort services by order
  const sortedServices = [...currentServices].sort((a, b) => (a.order || 0) - (b.order || 0));

  // Calculate pagination
  const totalPages = Math.ceil(sortedServices.length / servicesPerPage);
  const startIndex = (currentPage - 1) * servicesPerPage;
  const endIndex = startIndex + servicesPerPage;
  const currentPageServices = sortedServices.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
    setOpenItems(new Set()); // Close all open items when changing pages
    // Scroll to top of services section
    const servicesSection = document.getElementById('services-grid');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (sortedServices.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No services available in this category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Services Grid */}
      <div id="services-grid" className="flex flex-col md:flex-row gap-4 md:gap-6 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]">
        {columnsArray.map((_, colIndex) => (
          <div
            key={colIndex}
            className="flex-1 space-y-4 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
          >
            {currentPageServices
              .filter((_, index) => index % columns === colIndex)
              .map((service, serviceIndex) => {
                const originalIndex = startIndex + currentPageServices.findIndex(s => s.title === service.title);
                const isOpen = openItems.has(originalIndex);

                // Convert service to format expected by ServiceCard
                const serviceForCard = {
                  ...service,
                  icon: getIcon(service.icon)
                };

                return (
                  <div
                    key={`${activeTabKey}-${originalIndex}`}
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center space-y-4">
          {/* Page Info */}
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, sortedServices.length)} of {sortedServices.length} services
          </div>

          {/* Pagination Buttons */}
          <div className="flex items-center space-x-2">
            {/* Previous Button */}
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-lg border transition-colors duration-200 ${
                currentPage === 1
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {/* First page if not visible */}
              {getPageNumbers()[0] > 1 && (
                <>
                  <button
                    onClick={() => goToPage(1)}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
                  >
                    1
                  </button>
                  {getPageNumbers()[0] > 2 && (
                    <span className="px-2 text-gray-400">...</span>
                  )}
                </>
              )}

              {/* Visible page numbers */}
              {getPageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`px-3 py-2 rounded-lg border transition-colors duration-200 ${
                    currentPage === pageNum
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              {/* Last page if not visible */}
              {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                <>
                  {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                    <span className="px-2 text-gray-400">...</span>
                  )}
                  <button
                    onClick={() => goToPage(totalPages)}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-lg border transition-colors duration-200 ${
                currentPage === totalPages
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Mobile: Simple Previous/Next */}
          <div className="flex md:hidden items-center justify-between w-full max-w-xs">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-primary hover:bg-primary/10'
              }`}
            >
              ← Previous
            </button>
            
            <span className="text-sm text-muted-foreground">
              {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-primary hover:bg-primary/10'
              }`}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ServicesPage() {
  const [pageData, setPageData] = useState<ServicesPageData | null>(null);
  const [activeTabKey, setActiveTabKey] = useState<string>('');
  const [openItems, setOpenItems] = useState(new Set<number>());
  const [loading, setLoading] = useState(true);

  // Function to get all tabs (combine legacy and new)
  const getAllTabs = (): ServiceTab[] => {
    if (!pageData?.whatWeOfferSection) return [];
    
    // Use new system if available and has data
    if (pageData.whatWeOfferSection.serviceTabs && pageData.whatWeOfferSection.serviceTabs.length > 0) {
      return pageData.whatWeOfferSection.serviceTabs;
    }
    
    // Fallback to legacy system
    const legacyTabs: ServiceTab[] = [];
    
    if (pageData.whatWeOfferSection.ourServicesTab?.services && pageData.whatWeOfferSection.ourServicesTab.services.length > 0) {
      legacyTabs.push({
        tabTitle: pageData.whatWeOfferSection.ourServicesTab.tabTitle || 'Our Services',
        tabKey: 'our-services',
        services: pageData.whatWeOfferSection.ourServicesTab.services,
        order: 0
      });
    }
    
    if (pageData.whatWeOfferSection.clinicalServicesTab?.services && pageData.whatWeOfferSection.clinicalServicesTab.services.length > 0) {
      legacyTabs.push({
        tabTitle: pageData.whatWeOfferSection.clinicalServicesTab.tabTitle || 'Clinical Services',
        tabKey: 'clinical-services',
        services: pageData.whatWeOfferSection.clinicalServicesTab.services,
        order: 1
      });
    }
    
    return legacyTabs;
  };

  // Handle hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash && pageData?.whatWeOfferSection) {
        const allTabs = getAllTabs();
        const foundTab = allTabs.find(tab => tab.tabKey === hash);
        if (foundTab) {
          setActiveTabKey(hash);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [pageData]);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const data = await client.fetch(SERVICES_PAGE_QUERY);
        setPageData(data);
        
        // Set initial active tab
        if (data?.whatWeOfferSection) {
          // Check for new system first
          if (data.whatWeOfferSection.serviceTabs?.length > 0) {
            const sortedTabs = [...data.whatWeOfferSection.serviceTabs].sort((a, b) => (a.order || 0) - (b.order || 0));
            const hash = window.location.hash.substring(1);
            const foundTab = sortedTabs.find(tab => tab.tabKey === hash);
            setActiveTabKey(foundTab ? hash : sortedTabs[0].tabKey);
          } else {
            // Fallback to legacy system
            const hash = window.location.hash.substring(1);
            if (hash === 'clinical-services' && data.whatWeOfferSection.clinicalServicesTab?.services?.length > 0) {
              setActiveTabKey('clinical-services');
            } else if (data.whatWeOfferSection.ourServicesTab?.services?.length > 0) {
              setActiveTabKey('our-services');
            } else if (data.whatWeOfferSection.clinicalServicesTab?.services?.length > 0) {
              setActiveTabKey('clinical-services');
            }
          }
        }
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

  const handleTabChange = (tabKey: string) => {
    setActiveTabKey(tabKey);
    setOpenItems(new Set());
    // Update URL hash
    window.history.replaceState(null, '', `#${tabKey}`);
    
    // Smooth scroll to services section
    const servicesSection = document.getElementById('services-section');
    if (servicesSection) {
      servicesSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
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

  if (!pageData?.whatWeOfferSection) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">No page data found.</p>
          <p className="text-sm text-muted-foreground mt-2">Please check your Sanity Studio configuration.</p>
        </div>
      </div>
    );
  }

  const allTabs = getAllTabs();

  if (allTabs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">No services available.</p>
          <p className="text-sm text-muted-foreground mt-2">Please add services in your Sanity Studio.</p>
        </div>
      </div>
    );
  }

  // Sort tabs by order
  const sortedTabs = [...allTabs].sort((a, b) => (a.order || 0) - (b.order || 0));
  const activeTab = sortedTabs.find(tab => tab.tabKey === activeTabKey) || sortedTabs[0];
  const currentServices = activeTab?.services || [];

  const heroImageSrc = pageData.heroSection?.heroImage 
    ? urlFor(pageData.heroSection.heroImage.asset).width(700).height(500).url()
    : "/contact.jpg";

  const experienceBackgroundSrc = pageData.experienceSection?.backgroundImage 
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
                {pageData.heroSection?.title || 'Our Services'}
              </h1>
              <p className="mt-4 text-muted-foreground max-w-lg mx-auto md:mx-24 md:text-left">
                {pageData.heroSection?.description || 'Comprehensive healthcare services for your wellbeing.'}
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
            {pageData.experienceSection?.title || 'Experience Excellence'}
          </h2>
        </div>
      </section>

      {/* What We Offer Section */}
      <section id="services-section" className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">
              {pageData.whatWeOfferSection?.title || 'What We Offer'}
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {pageData.whatWeOfferSection?.description || 'Comprehensive healthcare services tailored to your needs.'}
            </p>
          </div>

          {/* Dynamic Tab Navigation */}
          <div className="flex justify-center mb-12 transition-all duration-300 ease-in-out">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex flex-wrap gap-1">
              {sortedTabs.map((tab) => (
                <button
                  key={tab.tabKey}
                  onClick={() => handleTabChange(tab.tabKey)}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all duration-200 text-sm lg:text-base ${
                    activeTabKey === tab.tabKey
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {tab.tabTitle}
                </button>
              ))}
            </div>
          </div>

          {/* Active Tab Description */}
          {activeTab?.tabDescription && (
            <div className="text-center mb-8">
              <p className="text-muted-foreground max-w-3xl mx-auto">
                {activeTab.tabDescription}
              </p>
            </div>
          )}
          {/* Services Grid */}
          <ResponsiveServices
            currentServices={currentServices}
            openItems={openItems}
            toggleItem={toggleItem}
            activeTabKey={activeTabKey}
            setOpenItems={setOpenItems}
          />
          
          
          {/* Tab Indicator for Mobile - Updated to show pagination info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-primary">
                {activeTab?.tabTitle}
              </span> • {currentServices.length} service{currentServices.length !== 1 ? 's' : ''} total
              {Math.ceil(currentServices.length / (window.innerWidth >= 1024 ? 12 : window.innerWidth >= 768 ? 8 : 4)) > 1 && (
                <> • {Math.ceil(currentServices.length / (window.innerWidth >= 1024 ? 12 : window.innerWidth >= 768 ? 8 : 4))} page{Math.ceil(currentServices.length / (window.innerWidth >= 1024 ? 12 : window.innerWidth >= 768 ? 8 : 4)) !== 1 ? 's' : ''}</>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="appointment" className="bg-secondary py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {pageData.ctaSection?.title || 'Ready to Get Started?'}
            </h2>
            <p className="mx-auto mt-4 max-w-4xl text-lg text-muted-foreground lg:text-xl">
              {pageData.ctaSection?.description || 'Contact us today to schedule your appointment.'}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:gap-6">
              <Button asChild size="lg" className="text-base lg:text-lg px-6 lg:px-8 [box-shadow:0_3px_5px_rgba(0,0,0,0.2)] hover:[box-shadow:0_6px_6px_rgba(0,0,0,0.15)] transition-shadow duration-300">
                <Link href={pageData.ctaSection?.primaryButton?.link || '/appointments'}>
                  {pageData.ctaSection?.primaryButton?.text || 'Book Appointment'}
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="hover:bg-transparent hover:text-primary transition-colors">
                <Link href={pageData.ctaSection?.secondaryButton?.link || '/contact'}>
                  {pageData.ctaSection?.secondaryButton?.text || 'Contact Us'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}