'use client';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Stethoscope, Eye, Bone, Smile, Pill, Syringe, Plus, Minus } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

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

// Service Card Component - FIXED for proper expansion
const ServiceCard = ({ service, isOpen, onToggle }: { service: any, isOpen: boolean, onToggle: () => void }) => {
  const IconComponent = service.icon;
  
  return (
    <div className="w-full bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg hover:border-primary/50 transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset rounded-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                isOpen ? 'bg-primary text-white' : 'bg-secondary text-primary hover:bg-secondary/80'
              }`}>
                <IconComponent className="h-6 w-6" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className={`text-lg font-semibold transition-colors duration-200 ${
                isOpen ? 'text-primary' : 'text-foreground hover:text-primary'
              }`}>
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 truncate">
                {service.subtitle || "Professional healthcare services"}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 ml-4">
            {isOpen ? (
              <Minus className="h-5 w-5 text-primary transition-colors duration-200" />
            ) : (
              <Plus className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors duration-200" />
            )}
          </div>
        </div>
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100">
          <div className="border-l-4 border-primary/30 pl-4 mt-2">
            {service.details.map((detail: string, index: number) => (
              <p key={index} className="text-muted-foreground leading-relaxed mb-2 last:mb-0 text-sm">
                {detail}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Updated service data with better descriptions
const medicalServices = [
  { 
    title: "Internal Medicine", 
    icon: Stethoscope, 
    subtitle: "Primary Care",
    details: [
      "Comprehensive primary care consultations and regular health check-ups",
      "Preventive medicine and health screenings",
      "Management of chronic conditions and adult diseases"
    ] 
  },
  { 
    title: "Ophthalmology", 
    icon: Eye, 
    subtitle: "Eye Care",
    details: [
      "Complete eye examinations and vision assessments",
      "Advanced diagnostic imaging and retinal analysis",
      "Treatment of eye diseases and vision correction"
    ] 
  },
  { 
    title: "Anesthesiology", 
    icon: Bone, 
    subtitle: "Surgical Support",
    details: [
      "Pre-operative assessment and consultation",
      "Safe anesthesia administration for all surgical procedures",
      "Post-operative pain management and recovery monitoring"
    ] 
  },
  { 
    title: "Pediatrics", 
    icon: Smile, 
    subtitle: "Child Healthcare",
    details: [
      "Comprehensive pediatric care from infancy to adolescence",
      "Childhood immunizations and developmental assessments",
      "Treatment of childhood illnesses and growth monitoring"
    ] 
  },
  { 
    title: "Otorhinolaryngology", 
    icon: OtorhinolaryngologyIcon, 
    subtitle: "ENT Services",
    details: [
      "Diagnosis and treatment of ear, nose, and throat conditions",
      "Hearing assessments and audiology services",
      "Surgical and non-surgical ENT procedures"
    ] 
  },
  { 
    title: "Pulmonary Dept.", 
    icon: LungIcon, 
    subtitle: "Lung Care",
    details: [
      "Comprehensive respiratory system evaluation and treatment",
      "Pulmonary function testing and sleep studies",
      "Management of asthma, COPD, and other lung conditions"
    ] 
  },
  { 
    title: "OB Gyne", 
    icon: ObGyneIcon, 
    subtitle: "Women's Health",
    details: [
      "Comprehensive women's healthcare and reproductive services",
      "Prenatal care, delivery, and postpartum support",
      "Gynecological examinations and women's wellness programs"
    ] 
  },
  { 
    title: "Dentistry", 
    icon: DentistryIcon, 
    subtitle: "Oral Health",
    details: [
      "Complete dental examinations and oral health assessments",
      "Preventive dentistry and professional cleanings",
      "Restorative and cosmetic dental procedures"
    ] 
  },
  { 
    title: "Surgery", 
    icon: Syringe, 
    subtitle: "Surgical Care",
    details: [
      "Wide range of inpatient and outpatient surgical procedures",
      "Minimally invasive laparoscopic surgery options",
      "Expert surgical care with modern techniques and equipment"
    ] 
  },
  { 
    title: "Dermatology", 
    icon: Stethoscope, 
    subtitle: "Skin Care",
    details: [
      "Comprehensive skin health evaluations and treatments",
      "Dermatological procedures and cosmetic services",
      "Treatment of skin conditions and preventive care"
    ] 
  },
  { 
    title: "Others", 
    icon: Pill, 
    subtitle: "Additional Services",
    details: [
      "Specialized medical services and consultations",
      "Multidisciplinary care and treatment options",
      "Additional healthcare services as needed"
    ] 
  }
];

const clinicalServices = [
  { 
    title: "Laboratory Services", 
    icon: Pill, 
    subtitle: "Diagnostic Testing",
    details: [
      "Complete blood chemistry panels and hematology testing",
      "Microbiology and infectious disease diagnostics",
      "Specialized laboratory tests and rapid result processing"
    ] 
  },
  { 
    title: "Radiology & Imaging", 
    icon: Eye, 
    subtitle: "Medical Imaging",
    details: [
      "Digital X-rays, CT scans, and MRI imaging services",
      "Ultrasound and Doppler studies",
      "Advanced imaging interpretation by certified radiologists"
    ] 
  },
  { 
    title: "Emergency Services", 
    icon: Stethoscope, 
    subtitle: "24/7 Emergency Care",
    details: [
      "Round-the-clock emergency medical services",
      "Trauma care and critical patient stabilization",
      "Emergency diagnostic and treatment capabilities"
    ] 
  },
  { 
    title: "Pharmacy Services", 
    icon: Pill, 
    subtitle: "Medication Management",
    details: [
      "In-house pharmacy with comprehensive medication dispensing",
      "Medication counseling and drug interaction screening",
      "Specialized pharmaceutical compounding services"
    ] 
  },
  { 
    title: "Physical Therapy", 
    icon: Bone, 
    subtitle: "Rehabilitation",
    details: [
      "Comprehensive rehabilitation and physical therapy programs",
      "Post-surgical recovery and mobility restoration",
      "Pain management and therapeutic exercise programs"
    ] 
  },
  { 
    title: "Cardiology Services", 
    icon: Stethoscope, 
    subtitle: "Heart Care",
    details: [
      "Comprehensive cardiac evaluations and diagnostics",
      "ECG, echocardiography, and stress testing",
      "Heart disease prevention and management programs"
    ] 
  }
];

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<'medical' | 'clinical'>('medical');
  const [openItems, setOpenItems] = useState(new Set<number>());

  const toggleItem = (index: number) => {
    // If clicking the currently open item, close it
    if (openItems.has(index)) {
      setOpenItems(new Set());
    } else {
      // Otherwise, close any open item and open the clicked one
      setOpenItems(new Set([index]));
    }
  };

  const handleTabChange = (tab: 'medical' | 'clinical') => {
    setActiveTab(tab);
    setOpenItems(new Set()); // Close all items when switching tabs
  };

  const currentServices = activeTab === 'medical' ? medicalServices : clinicalServices;

  return (
    <div className="flex flex-col mx-auto">
      <section className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 items-center">
            <div className="items-center ">
            <h1 className="font-headline text-5xl md:text-7xl text-primary md:mx-24 md:text-left">
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

      {/* What We Offer Section - FIXED CARD EXPANSION */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">
              What We Offer
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive healthcare services delivered by our expert medical professionals
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex">
              <button
                onClick={() => handleTabChange('medical')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === 'medical'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                Our Services
              </button>
              <button
                onClick={() => handleTabChange('clinical')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === 'clinical'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                Clinical Services
              </button>
            </div>
          </div>

          {/* Services Grid - FIXED LAYOUT WITH STABLE POSITIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-auto">
            {currentServices.map((service, index) => (
              <div 
                key={`${activeTab}-${index}`} 
                style={{ gridRow: `span ${openItems.has(index) ? 2 : 1}` }}
              >
                <ServiceCard
                  service={service}
                  isOpen={openItems.has(index)}
                  onToggle={() => toggleItem(index)}
                />
              </div>
            ))}
          </div>

          {/* Tab Indicator for Mobile */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-primary">
                {activeTab === 'medical' ? 'Our Services' : 'Clinical Services'}
              </span> • {currentServices.length} services available
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="appointment" className="bg-secondary py-12 md:py-24">
        <div className="container mx-auto px-4  ">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Ready to Schedule Your Appointment?
            </h2>
            <p className="mx-auto mt-4 max-w-4xl text-lg text-muted-foreground lg:text-xl">
              Our medical professionals are here to provide you with the best possible care. Schedule your appointment today.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:gap-6">
              <Button asChild size="lg" className="text-base lg:text-lg px-6 lg:px-8 [box-shadow:0_3px_5px_rgba(0,0,0,0.2)] hover:[box-shadow:0_6px_6px_rgba(0,0,0,0.15)] transition-shadow duration-300">
                <Link href="/services/find-doctor">Find a Doctor</Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="text-base lg:text-lg px-6 lg:px-8 hover:bg-transparent hover:text-primary transition-colors">
                <Link href="/services/schedule-lab">Schedule Lab Work</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}