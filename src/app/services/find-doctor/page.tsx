'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Phone, Calendar, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { client, DOCTORS_QUERY, DEPARTMENTS_QUERY, urlFor } from "@/lib/sanity";
import type { Doctor, Department } from "@/types/sanity";

export default function FindDoctorPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsData, departmentsData] = await Promise.all([
          client.fetch(DOCTORS_QUERY),
          client.fetch(DEPARTMENTS_QUERY)
        ]);
        
        setDoctors(doctorsData);
        setDepartments(departmentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doctor.medicalSpecialty && doctor.medicalSpecialty.some(specialty => 
                           specialty.name.toLowerCase().includes(searchTerm.toLowerCase())
                         ));
    const matchesSpecialty = selectedSpecialty === "All Specialties" || doctor.specialty.name === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const specialties = ["All Specialties", ...departments.map(dept => dept.name)];

  if (loading) {
    return (
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
          <Image
            src="/contact.jpg"
            alt="Find a doctor"
            data-ai-hint="hospital doctors"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Find a Doctor
            </h1>
            <p className="mt-4 text-lg max-w-3xl lg:text-xl">
              Connect with our experienced medical professionals and schedule your appointment
            </p>
          </div>
        </section>
        
        <section className="py-12 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-lg text-muted-foreground">Loading doctors...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
        <Image
          src="/contact.jpg"
          alt="Find a doctor"
          data-ai-hint="hospital doctors"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Find a Doctor
          </h1>
          <p className="mt-4 text-lg max-w-3xl lg:text-xl">
            Connect with our experienced medical professionals and schedule your appointment
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-12 bg-gray-50 min-h-screen mx-auto px-4">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Search and Department Selection */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h1 className="text-3xl font-bold text-green-600 mb-6">Find Doctor</h1>
                  
                  {/* Search Input */}
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search"
                      className="pl-10 h-12 text-base rounded-lg border-gray-300"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Department Selection */}
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-green-600 mb-4">Select Department</h2>
                    <div className="space-y-2">
                      {departments.map((department) => (
                        <Button
                          key={department._id}
                          variant={selectedSpecialty === department.name ? "default" : "outline"}
                          className={`w-full justify-start h-12 text-left ${
                            selectedSpecialty === department.name 
                              ? "bg-green-600 hover:bg-green-700 text-white" 
                              : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                          }`}
                          onClick={() => setSelectedSpecialty(department.name)}
                        >
                          <div className="mr-3 flex items-center">
                            {department.icon && department.icon.asset ? (
                              <div className="relative w-5 h-5">
                                <Image
                                  src={urlFor(department.icon).url()}
                                  alt={department.icon.alt || `${department.name} icon`}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            ) : (
                              <span className="text-green-600">$</span>
                            )}
                          </div>
                          {department.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Doctor Cards */}
            <div className="lg:col-span-3">
              {selectedSpecialty !== "All Specialties" && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
                    {filteredDoctors.length} Doctor{filteredDoctors.length !== 1 ? 's' : ''} Found
                  </h2>
                  <p className="text-muted-foreground lg:text-lg">
                    Showing {selectedSpecialty} specialists
                  </p>
                </div>
              )}

              {filteredDoctors.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
                  {filteredDoctors.map((doctor) => (
                    <Card key={doctor._id} className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-white">
                      <CardHeader className="pb-4">
                        <div className="flex flex-col items-center text-center gap-4">
                          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-secondary lg:w-20 lg:h-20">
                            {doctor.image ? (
                              <Image
                                src={urlFor(doctor.image).url()}
                                alt={doctor.image.alt || doctor.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-green-600 flex items-center justify-center">
                                <span className="text-white text-xl font-bold">
                                  {doctor.name.split(' ')[1]?.[0] || doctor.name[0]}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg lg:text-xl">{doctor.name}</CardTitle>
                            
                            {/* Display multiple specialties */}
                            <div className="mt-1 flex flex-wrap gap-1 justify-center">
                              {doctor.medicalSpecialty && doctor.medicalSpecialty.length > 0 ? (
                                doctor.medicalSpecialty.map((specialty) => (
                                  <Badge key={specialty._id} variant="secondary" className="text-xs">
                                    {specialty.name}
                                  </Badge>
                                ))
                              ) : null}
                            </div>
                            
                            {/* Strictly by Appointment Badge */}
                            {doctor.strictlyByAppointment && (
                              <div className="mt-2">
                                <Badge className="bg-red-100 text-red-700 text-xs px-2 py-1">
                                  Strictly by Appointment
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 text-left">
                        {/* Room Number */}
                        {doctor.roomNumber && (
                          <div>
                            <p className="text-sm text-muted-foreground">Room No.</p>
                            <p className="text-sm font-medium">{doctor.roomNumber}</p>
                          </div>
                        )}

                        {/* Phone/Tel Local */}
                        <div>
                          <p className="text-sm text-muted-foreground">Tel. Local</p>
                          <p className="text-sm font-medium">{doctor.phone}</p>
                        </div>

                        {/* Schedule */}
                        <div>
                          <p className="text-sm text-muted-foreground">Schedule</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {doctor.availableDays.map((day) => (
                              <Badge key={day} variant="outline" className="text-xs">
                                {day}
                              </Badge>
                            ))}
                          </div>
                          {doctor.availabilityTime && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {doctor.availabilityTime}
                            </p>
                          )}
                        </div>

                        {/* Secretary Info */}
                        {doctor.secretary && (
                          <div>
                            <p className="text-sm text-muted-foreground">Secretary</p>
                            <p className="text-xs font-medium">{doctor.secretary}</p>
                            {doctor.secretary2 && (
                              <p className="text-xs font-medium mt-1">{doctor.secretary2}</p>
                            )}
                          </div>
                        )}
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
          </div>
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
