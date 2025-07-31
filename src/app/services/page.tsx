
'use client';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Stethoscope, Eye, Bone, Smile, Pill, Syringe } from "lucide-react";
import Image from "next/image";
import React from "react";

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


const serviceCategories = [
  { title: "Internal Medicine", icon: Stethoscope, details: ["Primary care, consultations, and regular check-ups."] },
  { title: "Ophthalmology", icon: Eye, details: ["Advanced imaging and laboratory tests for accurate diagnosis."] },
  { title: "Anesthesiology", icon: Bone, details: ["Expert treatment in various medical fields."] },
  { title: "Pediatrics", icon: Smile, details: ["A wide range of inpatient and outpatient surgical options."] },
  { title: "Otorhinolaryngology", icon: OtorhinolaryngologyIcon, details: ["24/7 emergency room for immediate medical attention."] },
  { title: "Pulmonary Dept.", icon: LungIcon, details: ["Programs to help you recover and maintain a healthy lifestyle."] },
  { title: "OB Gyne", icon: ObGyneIcon, details: ["Details for OB Gyne services."] },
  { title: "Dentistry", icon: DentistryIcon, details: ["Details for Dentistry services."] },
  { title: "Others", icon: Pill, details: ["Details for Other services."] },
  { title: "Surgery", icon: Syringe, details: ["Details for Surgery services."] },
  { title: "Dermatology", icon: Stethoscope, details: ["Details for Dermatology services."] },
];

export default function ServicesPage() {
  return (
    <div className="flex flex-col mx-auto">
      <section className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 items-center">
            <div className="items-center ">
            <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary md:mx-24 md:text-left">
              SAFE AT<br />ALAGA KA
            </h1>
            <p className="mt-4 text-muted-foreground max-w-lg mx-auto md:mx-24 md:text-left">
            Las Piñas Doctors Hospital offers a wide range of medical services from checkups and 
            diagnostics to emergency and specialized care. With expert doctors and modern facilities,
             we're here to provide safe,fast, and compassionate healthcare for you and your family.
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
                  src="/contact.jpg"
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

      <section className="relative py-16 bg-gray-800 text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/contact.jpg')" }}
          data-ai-hint="abstract texture"
        ></div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-wider">
            Experience Trusted Care
          </h2>
        </div>
      </section>

      <section className="py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl font-bold text-primary">Services</h2>
          </div>
          <div className="mx-auto max-w-6xl">
            <Accordion type="single" collapsible className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              {serviceCategories.map((category, index) => (
                <AccordionItem 
                    value={`item-${index}`} 
                    key={index} 
                    className="bg-white p-4 rounded-lg shadow-md border-b-0"
                >
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline text-left">
                    <div className="flex items-center gap-4">
                      <category.icon className="h-6 w-6 text-primary" />
                      <span>{category.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 text-base text-muted-foreground">
                    {category.details.map((detail, i) => <p key={i}>{detail}</p>)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section id="appointment" className="bg-secondary py-12 md:py-24">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Ready to Schedule Your Appointment?
            </h2>
            <p className="mx-auto mt-4 max-w-4xl text-lg text-muted-foreground lg:text-xl">
              Our medical professionals are here to provide you with the best possible care. Schedule your appointment today.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:gap-6">
              <Button asChild size="lg" className="text-base lg:text-lg px-6 lg:px-8">
                <Link href="/services/find-doctor">Find a Doctor</Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="text-base lg:text-lg px-6 lg:px-8">
                <Link href="/services/schedule-lab">Schedule Lab Work</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base lg:text-lg px-6 lg:px-8">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
