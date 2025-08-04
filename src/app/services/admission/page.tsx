'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { client, urlFor, ADMISSION_QUERY } from "@/lib/sanity";
import { AdmissionData, AdmissionSection } from "@/types/sanity";

export default function AdmissionPage() {
  const [admissionData, setAdmissionData] = useState<AdmissionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

        if (projectId && projectId !== 'your-project-id-here') {
          const data = await client.fetch(ADMISSION_QUERY);
          setAdmissionData(data);
        } else {
          console.log('Project ID not configured properly');
        }
      } catch (error) {
        console.error('Error fetching admission data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to render different section types
  const renderSection = (section: AdmissionSection, index: number) => {
    if (!section.isActive) return null;

    const backgroundClass = section.backgroundColor === 'secondary'
      ? 'bg-secondary'
      : section.backgroundColor === 'white'
        ? 'bg-white'
        : 'bg-background';

    return (
      <section key={index} className={`py-12 md:py-20 ${backgroundClass}`}>
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-8">
              {section.sectionTitle}
            </h2>
          </div>

          {section.sectionType === 'imageInfo' && section.image ? (
            <div className={`flex flex-col ${section.imagePosition === 'left' ? 'md:flex-row' :
                section.imagePosition === 'right' ? 'md:flex-row-reverse' :
                  'items-center'
              } gap-8 items-center`}>
              <div className="flex-shrink-0">
                <Image
                  src={urlFor(section.image.asset).width(400).height(300).url()}
                  alt={section.sectionTitle}
                  width={400}
                  height={300}
                  className="rounded-lg"
                />
              </div>
              <div className="flex-1">
                {section.description?.map((paragraph, idx) => (
                  <p key={idx} className="text-muted-foreground mb-4">{paragraph}</p>
                ))}
                {section.guidelines && section.guidelines.length > 0 && (
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    {section.guidelines.map((guideline, idx) => (
                      <li key={idx}>{guideline.text}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <div className="text-left space-y-6">
              {section.description?.map((paragraph, idx) => (
                <p key={idx} className="text-muted-foreground">{paragraph}</p>
              ))}
              {section.guidelines && section.guidelines.length > 0 && (
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  {section.guidelines.map((guideline, idx) => (
                    <li key={idx}>{guideline.text}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </section>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-background text-foreground">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <p className="text-muted-foreground">Loading admission information...</p>
          </div>
        </section>
      </div>
    );
  }

  // Fallback content if no data
  if (!admissionData) {
    return (
      <div className="bg-background text-foreground">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              <span className="text-primary font-headline">Las Piñas Doctors Hospital</span>
              <br />
              Direct Admission
            </h1>
            <p className="mt-4 text-muted-foreground">Content not available at the moment.</p>
          </div>
        </section>
      </div>
    );
  }

  const { heroSection, admissionInfo, sections, dataPrivacySection, philhealthSection } = admissionData;

  // Filter and sort active sections with null checks
  const activeSections = sections?.filter(section =>
    section && section.isActive === true
  ).sort((a, b) => (a.order || 0) - (b.order || 0)) || [];

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl tracking-tight">
            <span className="text-primary font-headline">{heroSection?.title || 'Las Piñas Doctors Hospital'}</span>
            <br />
            <span className="font-bold">
              {heroSection?.subtitle || 'Direct Admission'}
            </span>
          </h1>
        </div>
      </section>

      {/* Main Admission Information */}
      {admissionInfo && (
        <section className="pb-12 md:pb-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-left space-y-6 text-muted-foreground">
              {admissionInfo.description?.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              {admissionInfo.guidelines && admissionInfo.guidelines.length > 0 && (
                <ul className="list-disc pl-6 space-y-2">
                  {admissionInfo.guidelines.map((guideline, index) => (
                    <li key={index}>{guideline.text}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Sections */}
      {activeSections.map((section, index) => renderSection(section, index))}

      {/* Data Privacy Section */}
      {dataPrivacySection?.isActive && (
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-headline text-primary mb-4">
              {dataPrivacySection.title}
            </h2>
            <h3 className="text-2xl md:text-3xl font-extrabold text-foreground mb-8">
              {dataPrivacySection.subtitle}
            </h3>
            <p className="text-muted-foreground text-center">
              {dataPrivacySection.description}
            </p>
          </div>
        </section>
      )}

      {/* PhilHealth Section */}
      {philhealthSection?.isActive && (
        <section className="py-12 md:py-20 bg-secondary">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="flex flex-col items-center gap-6">
              {philhealthSection.logo?.asset && (
                <Image
                  src={urlFor(philhealthSection.logo.asset).width(500).height(300).url()}
                  alt="PhilHealth Logo"
                  width={500}
                  height={300}
                  className="rounded-xl shadow-lg"
                />
              )}
              <p className="text-muted-foreground text-center max-w-2xl">
                {philhealthSection.description}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
