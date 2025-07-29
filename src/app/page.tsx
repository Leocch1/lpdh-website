
'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Heart, Smile, Scissors } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { PrivacyNotice } from "@/components/privacy-notice"
import React, { useEffect, useState } from "react"
import { client, urlFor, HOMEPAGE_QUERY, TEST_QUERY } from "@/lib/sanity"
import { HomepageData } from "@/types/sanity"

const ToothIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12.5 5.5c-1-2.5-3-3-4.5-3-2.5 0-4.5 2-4.5 4.5 0 2.43 1.97 4.5 4.5 4.5h4.5c2.5 0 4.5-2.07 4.5-4.5 0-2.5-2-4.5-4.5-4.5-1.5 0-3.5.5-4.5 3Z" />
    <path d="m18.5 11 .5 2.5" />
    <path d="m5 11-.5 2.5" />
    <path d="m17 16-1-1" />
    <path d="m7 16 1-1" />
    <path d="M15 19.5a2.5 2.5 0 0 1-5 0" />
  </svg>
)

const PillIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
    <path d="m8.5 8.5 7 7" />
  </svg>
)

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
              title,
              carouselImages,
              legacySection
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

  const services = [
    { name: "Internal Medicine", icon: PillIcon, description: "Expert care for your heart's health." },
    { name: "Dentistry", icon: ToothIcon, description: "Lorem ipsum dolor sit amet." },
    { name: "Pediatrics", icon: Smile, description: "Compassionate care for your little ones." },
    { name: "Surgery", icon: Scissors, description: "Lorem ipsum dolor sit amet." },
  ]

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

  const legacySection = homepageData?.legacySection
  const legacyImageSrc = homepageData?.legacySection?.image 
    ? urlFor(homepageData.legacySection.image.asset).width(600).height(400).url()
    : null

  const hmoPartnersSection = homepageData?.hmoPartnersSection
  const hmoImageSrc = homepageData?.hmoPartnersSection?.image 
    ? urlFor(homepageData.hmoPartnersSection.image.asset).fit('max').width(1400).quality(85).format('webp').url()
    : null

  return (
    <div className="flex flex-col">
      <PrivacyNotice />

      {/* Dynamic CSS for carousel timing */}
      {heroImages.length > 0 && (
        <style dangerouslySetInnerHTML={{ __html: generateCarouselCSS() }} />
      )}

      {/* Only show carousel if there are images from Sanity */}
      {heroImages.length > 0 && (
        <section className="w-full">
          <div className="fade-in-fade-out">
            {heroImages.map((image, index) => (
              <div key={index} className="dynamic-carousel-item">
                <Image
                  src={image.src}
                  alt={image.alt}
                  data-ai-hint={image.dataAiHint}
                  width={1600}
                  height={600}
                  className="mx-auto object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="services" className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Our Services</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We offer a wide range of specialties to meet your healthcare needs.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Card key={service.name} className="text-center transition-shadow duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <service.icon className="h-8 w-8" />
                  </div>
                  <CardTitle>{service.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Only show legacy section if there's data from Sanity */}
      {legacySection && legacyImageSrc && (
        <section className="bg-secondary py-12 md:py-24">
          <div className="container px-4 md:px-6">
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
          <div className="container px-4 text-center md:px-6">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
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
          <div className="container px-4 text-center md:px-6">
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
        <div className="container px-4 text-center md:px-6">
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
