'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Phone, Calendar, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const doctors = [
  {
    id: 1,
    name: "Dr. Maria Santos",
    specialty: "Cardiology",
    experience: "15 years",
    education: "MD, University of the Philippines",
    rating: 4.8,
    reviews: 124,
    availableDays: ["Monday", "Wednesday", "Friday"],
    phone: "(02) 8825-5236",
    image: "/contact.jpg"
  },
  {
    id: 2,
    name: "Dr. John Rodriguez",
    specialty: "Internal Medicine",
    experience: "12 years",
    education: "MD, Ateneo School of Medicine",
    rating: 4.9,
    reviews: 98,
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    phone: "(02) 8825-5237",
    image: "/contact.jpg"
  },
  {
    id: 3,
    name: "Dr. Anna Cruz",
    specialty: "Pediatrics",
    experience: "10 years",
    education: "MD, De La Salle Medical Center",
    rating: 4.7,
    reviews: 156,
    availableDays: ["Monday", "Tuesday", "Thursday"],
    phone: "(02) 8825-5238",
    image: "/contact.jpg"
  },
  {
    id: 4,
    name: "Dr. Michael Tan",
    specialty: "Surgery",
    experience: "18 years",
    education: "MD, University of Santo Tomas",
    rating: 4.9,
    reviews: 89,
    availableDays: ["Wednesday", "Friday", "Saturday"],
    phone: "(02) 8825-5239",
    image: "/contact.jpg"
  },
  {
    id: 5,
    name: "Dr. Sarah Lopez",
    specialty: "Neurology",
    experience: "14 years",
    education: "MD, Manila Central University",
    rating: 4.8,
    reviews: 112,
    availableDays: ["Monday", "Wednesday", "Friday"],
    phone: "(02) 8825-5240",
    image: "/contact.jpg"
  },
  {
    id: 6,
    name: "Dr. Robert Garcia",
    specialty: "Ophthalmology",
    experience: "16 years",
    education: "MD, Far Eastern University",
    rating: 4.6,
    reviews: 78,
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    phone: "(02) 8825-5241",
    image: "/contact.jpg"
  }
];

const specialties = [
  "All Specialties",
  "Cardiology",
  "Internal Medicine",
  "Pediatrics",
  "Surgery",
  "Neurology",
  "Ophthalmology",
  "Emergency Care"
];

export default function FindDoctorPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "All Specialties" || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[300px] md:h-[400px]">
        <Image
          src="/contact.jpg"
          alt="Find a doctor"
          data-ai-hint="hospital doctors"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Find a Doctor
          </h1>
          <p className="mt-4 text-lg max-w-2xl">
            Connect with our experienced medical professionals and schedule your appointment
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-secondary/50">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by doctor name or specialty"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder="Select Specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {filteredDoctors.length} Doctor{filteredDoctors.length !== 1 ? 's' : ''} Found
            </h2>
            <p className="text-muted-foreground">
              {selectedSpecialty !== "All Specialties" && `Showing ${selectedSpecialty} specialists`}
            </p>
          </div>

          {filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-secondary">
                        <Image
                          src={doctor.image}
                          alt={doctor.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{doctor.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {doctor.specialty}
                        </Badge>
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{doctor.rating}</span>
                          <span className="text-sm text-muted-foreground">({doctor.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Education</p>
                      <p className="text-sm font-medium">{doctor.education}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Experience</p>
                      <p className="text-sm font-medium">{doctor.experience}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Available Days</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {doctor.availableDays.map((day) => (
                          <Badge key={day} variant="outline" className="text-xs">
                            {day}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{doctor.phone}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        Book Appointment
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No doctors found matching your criteria.</p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSpecialty("All Specialties");
                }}
                variant="outline"
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary py-12 md:py-24">
        <div className="container px-4 text-center md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Need Help Finding the Right Doctor?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Our patient coordinators are here to help you find the right specialist for your needs.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
