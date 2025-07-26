
'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Heart, Smile, Scissors } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { PrivacyNotice } from "@/components/privacy-notice"
import React from "react"

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
  const services = [
    { name: "Internal Medicine", icon: PillIcon, description: "Expert care for your heart's health." },
    { name: "Dentistry", icon: ToothIcon, description: "Lorem ipsum dolor sit amet." },
    { name: "Pediatrics", icon: Smile, description: "Compassionate care for your little ones." },
    { name: "Surgery", icon: Scissors, description: "Lorem ipsum dolor sit amet." },
  ]

  const heroImages = [
    { src: "/land1.png", alt: "Las Piñas Doctors Hospital exterior", dataAiHint: "hospital building" },
    { src: "/Facade 1.png", alt: "Hospital Facade 1", dataAiHint: "hospital building" },
    { src: "/Facade 2.png", alt: "Hospital Facade 2", dataAiHint: "hospital building" },
    { src: "/Facade 3.png", alt: "Hospital Facade 3", dataAiHint: "hospital building" },
    { src: "/Facade 5.png", alt: "Hospital Facade 5", dataAiHint: "hospital building" },
  ]

  return (
    <div className="flex flex-col">
      <PrivacyNotice />

      <section className="w-full">
         <Carousel
          opts={{ loop: true }}
          plugins={[]}
          className="relative"
        >
          <CarouselContent>
            {heroImages.map((image, index) => (
              <CarouselItem key={index}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  data-ai-hint={image.dataAiHint}
                  width={1600}
                  height={600}
                  className="mx-auto object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

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

      <section className="bg-secondary py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="flex justify-center">
              <Image
                src="/legacy.png"
                alt="Hospital building"
                data-ai-hint="hospital building"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                A Legacy of Healing and Trust
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                For decades, Las Piñas Doctors Hospital has been a cornerstone of health in our community. We combine state-of-the-art technology with a tradition of heartfelt care.
              </p>
              <div className="mt-8">
                <Button asChild>
                  <Link href="/about">Learn More About Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24">
        <div className="container px-4 text-center md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Our Accredited HMO Partners</h2>
          <div className="mt-12">
            <Image
              src="/logos.png"
              alt="HMO logos"
              data-ai-hint="logos"
              width={1200}
              height={500}
              className="mx-auto"
            />
          </div>
        </div>
      </section>

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
