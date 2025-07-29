'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Stethoscope, Brain, Baby, Eye, Scissors, Pill, UserCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const services = [
  {
    icon: Heart,
    title: "Cardiology",
    description: "Comprehensive heart care with advanced diagnostic and treatment options for cardiovascular conditions.",
    features: ["ECG Testing", "Echocardiogram", "Stress Testing", "Heart Disease Management"]
  },
  {
    icon: Stethoscope,
    title: "Internal Medicine",
    description: "Complete adult healthcare focusing on prevention, diagnosis, and treatment of adult diseases.",
    features: ["Preventive Care", "Chronic Disease Management", "Health Screenings", "Vaccination"]
  },
  {
    icon: Brain,
    title: "Neurology",
    description: "Specialized care for disorders of the nervous system including brain, spinal cord, and nerves.",
    features: ["Neurological Exams", "EEG Testing", "Stroke Care", "Headache Treatment"]
  },
  {
    icon: Baby,
    title: "Pediatrics",
    description: "Comprehensive healthcare for infants, children, and adolescents with compassionate care.",
    features: ["Well-Child Visits", "Immunizations", "Growth Monitoring", "Developmental Assessments"]
  },
  {
    icon: Eye,
    title: "Ophthalmology",
    description: "Complete eye care services from routine exams to advanced surgical procedures.",
    features: ["Eye Exams", "Cataract Surgery", "Glaucoma Treatment", "Retinal Care"]
  },
  {
    icon: Scissors,
    title: "Surgery",
    description: "Advanced surgical procedures with state-of-the-art equipment and experienced surgeons.",
    features: ["Minimally Invasive Surgery", "Emergency Surgery", "Outpatient Procedures", "Post-operative Care"]
  },
  {
    icon: Pill,
    title: "Pharmacy",
    description: "Full-service pharmacy with prescription medications and health consultations.",
    features: ["Prescription Filling", "Drug Consultations", "Health Screenings", "Medication Management"]
  },
  {
    icon: UserCheck,
    title: "Emergency Care",
    description: "24/7 emergency medical services with rapid response and critical care capabilities.",
    features: ["24/7 Availability", "Trauma Care", "Critical Care", "Emergency Procedures"]
  }
];

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] md:h-[500px]">
        <Image
          src="/contact.jpg"
          alt="Hospital services"
          data-ai-hint="hospital services"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Our Medical Services
          </h1>
          <p className="mt-4 text-lg max-w-2xl">
            Comprehensive healthcare services delivered by our team of experienced medical professionals
          </p>
          <div className="mt-8 flex gap-4">
            <Button asChild size="lg">
              <Link href="#services">View Services</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/services/find-doctor">Find a Doctor</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Comprehensive Medical Care
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We offer a wide range of medical specialties to meet all your healthcare needs under one roof.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service) => (
              <Card key={service.title} className="h-full transition-shadow duration-300 hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <service.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="appointment" className="bg-secondary py-12 md:py-24">
        <div className="container px-4 text-center md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to Schedule Your Appointment?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Our medical professionals are here to provide you with the best possible care. Schedule your appointment today.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/services/find-doctor">Find a Doctor</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/services/schedule-lab">Schedule Lab Work</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
