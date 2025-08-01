'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Phone, Calendar, Star, ChevronLeft, ChevronRight, Building2, ChevronDown } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Dynamic doctors per page based on screen size
  const doctorsPerPage = isMobile ? 6 : 9;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Reset to first page when filters change or screen size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSpecialty, isMobile]);
  
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doctor.medicalSpecialty && doctor.medicalSpecialty.some(specialty => 
                           specialty.name.toLowerCase().includes(searchTerm.toLowerCase())
                         ));
    const matchesSpecialty = selectedSpecialty === "All Specialties" || doctor.specialty.name === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const startIndex = (currentPage - 1) * doctorsPerPage;
  const endIndex = startIndex + doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(startIndex, endIndex);

  const specialties = ["All Specialties", ...departments.map(dept => dept.name)];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of results
    document.getElementById('doctors-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSpecialty("All Specialties");
    setCurrentPage(1);
  };

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
      <section id="doctors-section" className="py-12 bg-gray-50 min-h-screen mx-auto px-4">
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
                    
                    {/* Mobile Dropdown */}
                    <div className="block md:hidden">
                      <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                        <SelectTrigger className="w-full h-12 text-left border-gray-300">
                          <div className="flex items-center gap-3">
                            {selectedSpecialty === "All Specialties" ? (
                              <Building2 className="h-5 w-5 text-green-600" />
                            ) : (
                              departments.find(dept => dept.name === selectedSpecialty)?.icon?.asset ? (
                                <div className="relative w-5 h-5">
                                  <Image
                                    src={urlFor(departments.find(dept => dept.name === selectedSpecialty)!.icon!).url()}
                                    alt={departments.find(dept => dept.name === selectedSpecialty)!.icon!.alt || `${selectedSpecialty} icon`}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              ) : (
                                <span className="text-green-600">$</span>
                              )
                            )}
                            <SelectValue placeholder="Select Department" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Specialties">
                            <div className="flex items-center gap-3">
                              <div className="relative w-4 h-4">
                                <Image
                                  src="/lpdh profile.png"
                                  alt="LPDH Hospital Logo"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <span>All Departments</span>
                            </div>
                          </SelectItem>
                          {departments.map((department) => (
                            <SelectItem key={department._id} value={department.name}>
                              <div className="flex items-center gap-3">
                                <div className="w-4 h-4 flex items-center justify-center">
                                  <span className="text-green-600 text-sm">•</span>
                                </div>
                                <span>{department.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Desktop Button List */}
                    <div className="hidden md:block space-y-2">
                      {/* All Specialties Button */}
                      <Button
                        variant={selectedSpecialty === "All Specialties" ? "default" : "outline"}
                        className={`w-full justify-start h-12 text-left ${
                          selectedSpecialty === "All Specialties" 
                            ? "bg-green-600 hover:bg-green-700 text-white" 
                            : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                        }`}
                        onClick={() => setSelectedSpecialty("All Specialties")}
                      >
                        <div className="mr-3 flex items-center">
                          <Building2 className={`h-5 w-5 ${
                            selectedSpecialty === "All Specialties" 
                              ? "text-white" 
                              : "text-green-600"
                          }`} />
                        </div>
                        All Departments
                      </Button>
                      
                      {/* Department Buttons */}
                      {departments.map((department) => (
                        <Button
                          key={department._id}
                          variant={selectedSpecialty === department.name ? "default" : "outline"}
                          className={`w-full justify-start h-12 text-left ${
                            selectedSpecialty === department.name 
                              ? "bg-green-600 hover:bg-green-700 text-white" 
                              : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                          }`}
                          onClick={() => {
                            // If clicking on already selected department, unselect it
                            if (selectedSpecialty === department.name) {
                              setSelectedSpecialty("All Specialties");
                            } else {
                              setSelectedSpecialty(department.name);
                            }
                          }}
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
              {/* Results Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
                  {filteredDoctors.length} Doctor{filteredDoctors.length !== 1 ? 's' : ''} Found
                </h2>
                <p className="text-muted-foreground lg:text-lg">
                  {selectedSpecialty !== "All Specialties" 
                    ? `Showing ${selectedSpecialty} specialists` 
                    : "Showing all doctors"
                  }
                  {totalPages > 1 && (
                    <span> - Page {currentPage} of {totalPages}</span>
                  )}
                </p>
              </div>

              {currentDoctors.length > 0 ? (
                <>
                  {/* Doctor Cards Grid - Responsive: 2 cols on mobile, 2 on md, 3 on xl */}
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-8 mb-8">
                    {currentDoctors.map((doctor) => (
                      <Card key={doctor._id} className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-white">
                        <CardHeader className="pb-3 md:pb-4">
                          <div className="flex flex-col items-center text-center gap-2 md:gap-4">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-secondary md:w-16 md:h-16 lg:w-20 lg:h-20">
                              {doctor.image ? (
                                <Image
                                  src={urlFor(doctor.image).url()}
                                  alt={doctor.image.alt || doctor.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-green-600 flex items-center justify-center">
                                  <span className="text-white text-sm md:text-xl font-bold">
                                    {doctor.name.split(' ')[1]?.[0] || doctor.name[0]}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-sm md:text-lg lg:text-xl leading-tight">
                                {doctor.name}
                              </CardTitle>
                              
                              {/* Display multiple specialties */}
                              <div className="mt-1 flex flex-wrap gap-1 justify-center">
                                {doctor.medicalSpecialty && doctor.medicalSpecialty.length > 0 ? (
                                  doctor.medicalSpecialty.slice(0, isMobile ? 1 : 2).map((specialty) => (
                                    <Badge key={specialty._id} variant="secondary" className="text-xs">
                                      {specialty.name}
                                    </Badge>
                                  ))
                                ) : null}
                              </div>
                              
                              {/* Strictly by Appointment Badge */}
                              {doctor.strictlyByAppointment && (
                                <div className="mt-1 md:mt-2">
                                  <Badge className="bg-red-100 text-red-700 text-xs px-1 py-0.5 md:px-2 md:py-1">
                                    By Appointment
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2 md:space-y-4 text-left p-3 md:p-6">
                          {/* Room Number */}
                          {doctor.roomNumber && (
                            <div>
                              <p className="text-xs md:text-sm text-muted-foreground">Room No.</p>
                              <p className="text-xs md:text-sm font-medium">{doctor.roomNumber}</p>
                            </div>
                          )}

                          {/* Phone/Tel Local */}
                          <div>
                            <p className="text-xs md:text-sm text-muted-foreground">Tel. Local</p>
                            <p className="text-xs md:text-sm font-medium">{doctor.phone}</p>
                          </div>

                          {/* Schedule */}
                          <div>
                            <p className="text-xs md:text-sm text-muted-foreground">Schedule</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {doctor.availableDays.slice(0, isMobile ? 3 : 7).map((day) => (
                                <Badge key={day} variant="outline" className="text-xs">
                                  {isMobile ? day.slice(0, 3) : day}
                                </Badge>
                              ))}
                            </div>
                            {doctor.availabilityTime && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {doctor.availabilityTime}
                              </p>
                            )}
                          </div>

                          {/* Secretary Info - Show only on larger screens */}
                          {doctor.secretary && !isMobile && (
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="flex items-center gap-2"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span className="hidden sm:inline">Previous</span>
                          <span className="sm:hidden">Prev</span>
                        </Button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            // Show first page, last page, current page, and pages around current page
                            const shouldShow = 
                              page === 1 ||
                              page === totalPages ||
                              (page >= currentPage - 1 && page <= currentPage + 1);

                            if (!shouldShow) {
                              // Show ellipsis for gaps
                              if (page === currentPage - 2 || page === currentPage + 2) {
                                return (
                                  <span key={page} className="px-2 text-muted-foreground">
                                    ...
                                  </span>
                                );
                              }
                              return null;
                            }

                            return (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(page)}
                                className={`w-8 h-8 md:w-10 md:h-10 ${
                                  currentPage === page 
                                    ? "bg-green-600 hover:bg-green-700 text-white" 
                                    : ""
                                }`}
                              >
                                {page}
                              </Button>
                            );
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="flex items-center gap-2"
                        >
                          <span className="hidden sm:inline">Next</span>
                          <span className="sm:hidden">Next</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        Showing {startIndex + 1}-{Math.min(endIndex, filteredDoctors.length)} of {filteredDoctors.length} doctors
                      </p>
                    </div>
                  )}
                </>
              ) : ( 
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">No doctors found matching your criteria.</p>
                  <Button 
                    onClick={clearFilters}
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
        <div className="container mx-auto max-w-4xl px-4 text-center md:px-6">
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
