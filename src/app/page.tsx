'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { PrivacyNotice } from "@/components/privacy-notice"
import React, { useEffect, useState } from "react"
import { client, urlFor, HOMEPAGE_QUERY } from "@/lib/sanity"
import { HomepageData } from "@/types/sanity"

export default function Home() {
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [hmoImageError, setHmoImageError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Only fetch if we have valid project ID (not placeholder)
         const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
        
        if (projectId && projectId !== 'your-project-id-here') {
          // Now try the main query
          const data = await client.fetch(HOMEPAGE_QUERY)
          
          // If main query returns null, try alternative approach
          if (!data) {
            const altQuery = `*[_type == "homepage"]{
              _id,
              carouselImages,
              servicesSection,
              legacySection,
              hmoPartnersSection
            }`
            const altData = await client.fetch(altQuery)
            if (altData && altData.length > 0) {
              setHomepageData(altData[0])
            }
          } else {
            setHomepageData(data)
          }
        } else {
          console.log('Project ID not configured properly')
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // Only use Sanity data - no fallbacks
  const heroImages = homepageData?.carouselImages?.filter(img => img?.asset).map(img => ({
    src: urlFor(img.asset).width(1600).height(600).url(),
    alt: img.alt,
    dataAiHint: img.dataAiHint || "hospital building"
  })) || []

  // Dynamic animation timing based on number of images (6 seconds per image)
  const imageCount = heroImages.length
  const intervalPerImage = 6 // seconds
  const totalAnimationDuration = imageCount * intervalPerImage

  // Generate dynamic CSS for carousel timing
  const generateCarouselCSS = () => {
    if (imageCount === 0) return ''
    
    const fadeInOutDuration = (intervalPerImage / totalAnimationDuration) * 100 // percentage
    const stayVisibleDuration = fadeInOutDuration * 0.8 // 80% visible, 20% for fade transition
    
    let css = `
      @keyframes dynamic-fade-in-out {
        0% { opacity: 0; }
        ${(fadeInOutDuration * 0.1)}% { opacity: 1; }
        ${stayVisibleDuration}% { opacity: 1; }
        ${fadeInOutDuration}% { opacity: 0; }
        100% { opacity: 0; }
      }
      
      .dynamic-carousel-item {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        animation: dynamic-fade-in-out ${totalAnimationDuration}s linear infinite;
        opacity: 0;
      }
    `
    
    // Generate delays for each image
    for (let i = 0; i < imageCount; i++) {
      const delay = (imageCount - 1 - i) * intervalPerImage
      css += `
        .dynamic-carousel-item:nth-child(${i + 1}) {
          animation-delay: ${delay}s;
        }
      `
    }
    
    return css
  }

  const servicesSection = homepageData?.servicesSection
  const legacySection = homepageData?.legacySection
  const legacyImageSrc = homepageData?.legacySection?.image 
    ? urlFor(homepageData.legacySection.image.asset).width(600).height(400).url()
    : null

  const hmoPartnersSection = homepageData?.hmoPartnersSection
  const hmoImageSrc = homepageData?.hmoPartnersSection?.image 
    ? urlFor(homepageData.hmoPartnersSection.image.asset).fit('max').width(1400).quality(85).format('webp').url()
    : null

  // Only use services from Sanity - no fallbacks
  const services = servicesSection?.services?.map(service => ({
    name: service.name,
    description: service.description,
    iconSrc: service.icon ? urlFor(service.icon.asset).width(80).height(80).url() : null,
    backgroundImageSrc: service.backgroundImage ? urlFor(service.backgroundImage.asset).width(400).height(300).quality(60).url() : null,
    linkUrl: service.linkUrl || '#'
  })) || []

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen flex flex-col overflow-x-hidden bg-background">
      <PrivacyNotice />

      {/* Dynamic CSS for carousel timing */}
      {heroImages.length > 0 && (
        <style dangerouslySetInnerHTML={{ __html: generateCarouselCSS() }} />
      )}

      {/* Only show carousel if there are images from Sanity */}
      {heroImages.length > 0 && (
        <section className="w-full p-0 m-0 bg-white" style={{ margin: 0, padding: 0 }}>
          <div
            className="relative w-full"
            style={{ 
              maxWidth: '100vw', 
              overflow: 'hidden', 
              margin: 0, 
              padding: 0,
              aspectRatio: '1920/880', // Maintain exact aspect ratio
              width: '100%'
            }}
          >
            {heroImages.map((image, index) => (
              <div key={index} className="dynamic-carousel-item">
                <Image
                  src={image.src}
                  alt={image.alt}
                  data-ai-hint={image.dataAiHint}
                  width={1920}
                  height={880}
                  className="object-contain w-full h-full select-none pointer-events-none"
                  sizes="100vw"
                  priority={index === 0}
                  draggable={false}
                  style={{ maxWidth: '100%', height: '100%', margin: 0, padding: 0 }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Only show services section if there's data from Sanity */}
      {servicesSection && services.length > 0 && (
        <section id="services" className="py-16 md:py-32">
          <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {servicesSection.title}
              </h2>
              <p className="mt-6 text-xl text-muted-foreground lg:text-2xl">
                {servicesSection.description}
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
              {services.map((service, index) => {
                const isClickable = service.linkUrl && service.linkUrl !== '#'

                if (isClickable) {
                  return (
                    <Link key={service.name} href={service.linkUrl}>
                      <Card 
                        className="text-center transition-all duration-300 hover:shadow-lg relative overflow-hidden group min-h-[340px] md:min-h-[360px] cursor-pointer hover:scale-105"
                      >
                        {/* Background image with lower opacity */}
                        {service.backgroundImageSrc && (
                          <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                            <Image
                              src={service.backgroundImageSrc}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                            />
                          </div>
                        )}
                        
                        {/* Card content */}
                        <div className="relative z-10 h-full flex flex-col">
                          <CardHeader className="pb-3 flex-shrink-0">
                            <div className="mx-auto mb-4 flex size-24 md:size-28 items-center justify-center rounded-full bg-white group-hover:bg-secondary text-primary transition-colors duration-300">
                              {service.iconSrc && (
                                <Image
                                  src={service.iconSrc}
                                  alt={`${service.name} icon`}
                                  width={56}
                                  height={56}
                                  className="object-contain"
                                />
                              )}
                            </div>
                            <CardTitle className="text-2xl md:text-3xl font-bold leading-tight">
                              {service.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="px-6 pb-4 flex-grow flex flex-col justify-between">
                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-center mb-4">
                              {service.description}
                            </p>
                            
                            {/* Learn More button inside card */}
                            <div className="flex justify-center mt-auto">
                              <div className="inline-flex items-center gap-2 text-primary font-medium text-sm transition-colors">
                                <span>LEARN MORE</span>
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </Link>
                  )
                }

                return (
                  <Card 
                    key={service.name}
                    className="text-center transition-all duration-300 hover:shadow-lg relative overflow-hidden group min-h-[340px] md:min-h-[360px]"
                  >
                    {/* Background image with lower opacity */}
                    {service.backgroundImageSrc && (
                      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                        <Image
                          src={service.backgroundImageSrc}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                        />
                      </div>
                    )}
                    
                    {/* Card content */}
                    <div className="relative z-10 h-full flex flex-col">
                      <CardHeader className="pb-3 flex-shrink-0">
                        <div className="mx-auto mb-4 flex size-24 md:size-28 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          {service.iconSrc && (
                            <Image
                              src={service.iconSrc}
                              alt={`${service.name} icon`}
                              width={56}
                              height={56}
                              className="object-contain"
                            />
                          )}
                        </div>
                        <CardTitle className="text-2xl md:text-3xl font-bold leading-tight">
                          {service.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-6 pb-4 flex-grow flex flex-col justify-center">
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-center">
                          {service.description}
                        </p>
                      </CardContent>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Only show legacy section if there's data from Sanity */}
      {legacySection && legacyImageSrc && (
        <section className="bg-secondary py-12 md:py-24">
          <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-8">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div className="flex justify-center">
                <Image
                  src={legacyImageSrc}
                  alt="Hospital building"
                  data-ai-hint="hospital building"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {legacySection.title}
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  {legacySection.description}
                </p>
                <div className="mt-8">
                  <Button asChild>
                    <Link href={legacySection.linkUrl}>{legacySection.linkText}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Only show HMO Partners section if there's data from Sanity */}
      {hmoPartnersSection && hmoImageSrc && !hmoImageError && (
        <section className="py-12 md:py-24">
          <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-center">
              {hmoPartnersSection.title}
            </h2>
            <div className="mt-12">
              <Image
                src={hmoImageSrc}
                alt={hmoPartnersSection.alt}
                data-ai-hint="hmo partner logos"
                width={1400}
                height={400}
                className="mx-auto max-w-full h-auto object-contain"
                priority={false}
                onError={() => {
                  console.log('HMO image failed to load')
                  setHmoImageError(true)
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Fallback HMO Partners section if image fails to load */}
      {hmoPartnersSection && hmoImageError && (
        <section className="py-12 md:py-24">
          <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {hmoPartnersSection.title}
            </h2>
            <div className="mt-12">
              <p className="text-muted-foreground">
                Image temporarily unavailable. Please check back later.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="bg-secondary py-12 md:py-24">
        <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Ready to Take the Next Step?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Your journey to better health starts here. Contact us to learn more or to schedule your appointment with one of our specialists.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/services#appointment">Book an Appointment</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}