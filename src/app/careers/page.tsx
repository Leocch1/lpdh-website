'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { client, urlFor, CAREERS_QUERY, JOB_OPENINGS_QUERY } from "@/lib/sanity";
import { CareersData, JobOpening } from "@/types/sanity";

// Add query for job categories
const JOB_CATEGORIES_QUERY = `*[_type == "jobCategory" && isActive == true] | order(order asc) {
  _id,
  value,
  label,
  order
}`;

export default function CareersPage() {
  const [careersData, setCareersData] = useState<CareersData | null>(null)
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([])
  const [jobCategories, setJobCategories] = useState<any[]>([])
  const [filteredJobs, setFilteredJobs] = useState<JobOpening[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  // Dynamic jobs per page based on screen size
  const jobsPerPage = isMobile ? 6 : 12; // 2x3 mobile, 4x3 desktop

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
        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
        
        if (projectId && projectId !== 'your-project-id-here') {
          // Fetch careers page data
          const careersContent = await client.fetch(CAREERS_QUERY)
          setCareersData(careersContent)
          
          // Fetch job openings with category references
          const jobsQuery = `*[_type == "jobOpening" && isActive == true] | order(_createdAt desc) {
            _id,
            title,
            slug,
            department,
            type,
            summary,
            category->{
              _id,
              value,
              label
            }
          }`;
          const jobs = await client.fetch(jobsQuery)
          setJobOpenings(jobs || [])
          
          // Fetch job categories
          const categories = await client.fetch(JOB_CATEGORIES_QUERY)
          setJobCategories(categories || [])
        } else {
          console.log('Project ID not configured properly')
        }
      } catch (error) {
        console.error('Error fetching careers data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // Filter jobs based on category and search term
  useEffect(() => {
    let filtered = jobOpenings

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(job => job.category?.value === selectedCategory)
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.department.toLowerCase().includes(searchLower) ||
        job.summary?.toLowerCase().includes(searchLower) ||
        job.category?.label.toLowerCase().includes(searchLower)
      )
    }

    setFilteredJobs(filtered)
  }, [jobOpenings, selectedCategory, searchTerm])

  // Reset to first page when filters change or screen size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, isMobile]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to job listings section
    document.getElementById('openings')?.scrollIntoView({ behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSelectedCategory("all")
    setSearchTerm("")
    setCurrentPage(1)
  }

  // Get hero section data
  const heroSection = careersData?.heroSection
  const heroImageSrc = heroSection?.backgroundImage 
    ? urlFor(heroSection.backgroundImage.asset).width(1600).height(600).url()
    : "/contact.jpg" // fallback image

  // Get job listings section data
  const jobListingsSection = careersData?.jobListingsSection

  return (
    <div className="flex flex-col">
      {/* Hero Section - Only show if data exists */}
      {heroSection && (
        <section className="relative w-full h-[400px] md:h-[500px]">
          <Image
              src={heroImageSrc}
              alt="Hospital interior"
              data-ai-hint="hospital interior"
              fill
              className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
            <h1 className="font-headline text-4xl tracking-tight sm:text-5xl md:text-6xl [text-shadow:0_3px_5px_rgba(0,0,0,0.2)]">
              {heroSection.heroTitle}
            </h1>
            <Button asChild className="mt-8 [box-shadow:0_3px_5px_rgba(0,0,0,0.2)] hover:bg-accent  hover:[box-shadow:0_6px_6px_rgba(0,0,0,0.15)]" size="lg">
              <Link href="#openings">{heroSection.buttonText}</Link>
            </Button>
          </div>
        </section>
      )}
      
      {/* Job Listings Section - Only show if data exists */}
      {jobListingsSection && (
        <section id="openings" className="py-12 md:py-24 mx-auto px-4">
          <div className="container">
            <h2 className="font-headline text-center text-3xl tracking-tight text-primary sm:text-4xl">
              {jobListingsSection.sectionTitle}
            </h2>
            <div className="mt-8 mx-auto max-w-2xl flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder={jobListingsSection.searchPlaceholder || "Search jobs..."}
                    className="pl-10"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder={jobListingsSection.categoryPlaceholder || "Select Category"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {jobCategories.map((category) => (
                      <SelectItem key={category._id} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
            
            {/* Results count */}
            {!loading && (
              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  {filteredJobs.length === 0 
                    ? "No jobs found matching your criteria"
                    : `Showing ${startIndex + 1}-${Math.min(endIndex, filteredJobs.length)} of ${filteredJobs.length} job${filteredJobs.length !== 1 ? 's' : ''}`
                  }
                  {totalPages > 1 && (
                    <span> - Page {currentPage} of {totalPages}</span>
                  )}
                </p>
              </div>
            )}
            
            {/* Job Cards - Show current page results */}
            {currentJobs.length > 0 && (
              <>
                <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 lg:gap-8">
                  {currentJobs.map((job) => (
                    <Card key={job._id} className="flex flex-col group hover:shadow-lg transition-shadow">
                      <CardHeader className="p-3 md:p-6">
                        <div className="flex flex-col gap-2">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="group-hover:text-primary transition-colors text-sm md:text-base leading-tight truncate">
                              {job.title}
                            </CardTitle>
                            {/* Category badge - Show under title on both mobile and desktop */}
                            {job.category && (
                              <div className="mt-1">
                                <span className="inline-block px-1.5 py-0.5 md:px-2 md:py-1 text-xs bg-primary/10 text-primary rounded-full">
                                  {job.category.label}
                                </span>
                              </div>
                            )}
                            {/* Job type - Show on mobile only */}
                            {job.type && (
                              <div className="mt-1 md:hidden">
                                <p className="text-xs text-muted-foreground capitalize truncate">{job.type.replace('-', ' ')}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Job type - Show on desktop only */}
                        <div className="hidden md:block space-y-1 mt-2">
                          {job.type && (
                            <p className="text-xs text-muted-foreground capitalize truncate">{job.type.replace('-', ' ')}</p>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow p-3 md:p-6 pt-0">
                        <p className="text-muted-foreground line-clamp-2 md:line-clamp-3 text-xs md:text-sm">{job.summary}</p>
                      </CardContent>
                      <CardFooter className="p-3 md:p-6 pt-0">
                        <Button asChild className="w-full h-8 md:h-10 text-xs md:text-sm [box-shadow:0_3px_5px_rgba(0,0,0,0.2)] hover:[box-shadow:0_6px_6px_rgba(0,0,0,0.15)]">
                          <Link href={`/careers/${job.slug.current}`}>
                            <Briefcase className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                            <span className="truncate">Apply Now</span>
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex flex-col items-center gap-4">
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
                      Showing {startIndex + 1}-{Math.min(endIndex, filteredJobs.length)} of {filteredJobs.length} jobs
                    </p>
                  </div>
                )}
              </>
            )}
            
            {/* No jobs message */}
            {filteredJobs.length === 0 && !loading && jobOpenings.length > 0 && (
              <div className="mt-12 text-center">
                <p className="text-muted-foreground mt-2">Try adjusting your search or category selection.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {/* No jobs at all message */}
            {jobOpenings.length === 0 && !loading && (
              <div className="mt-12 text-center">
                <p className="text-muted-foreground text-lg">No job openings available at the moment.</p>
                <p className="text-muted-foreground mt-2">Please check back later for new opportunities.</p>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="mt-12 text-center">
                <p className="text-muted-foreground text-lg">Loading job openings...</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
