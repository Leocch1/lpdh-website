'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Search } from "lucide-react";
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
        job.title.toLowerCase().includes(searchLower) ||           // ✅ Job Title
        job.department.toLowerCase().includes(searchLower) ||
        job.summary?.toLowerCase().includes(searchLower) ||
        job.category?.label.toLowerCase().includes(searchLower)   // ✅ Category
      )
    }

    setFilteredJobs(filtered)
  }, [jobOpenings, selectedCategory, searchTerm])

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
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
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              {heroSection.heroTitle}
            </h1>
            <Button asChild className="mt-8" size="lg">
              <Link href="#openings">{heroSection.buttonText}</Link>
            </Button>
          </div>
        </section>
      )}
      
      {/* Job Listings Section - Only show if data exists */}
      {jobListingsSection && (
        <section id="openings" className="py-12 md:py-24 mx-auto px-4">
          <div className="container">
            <h2 className="font-headline text-center text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              {jobListingsSection.sectionTitle}
            </h2>
            <div className="mt-8 mx-auto max-w-2xl flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder={jobListingsSection.searchPlaceholder || "Search jobs..."}
                    className="pl-10"
                    value={searchTerm}
                    onChange={handleSearchChange}  // Updates searchTerm state
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
                    : `Showing ${filteredJobs.length} of ${jobOpenings.length} job${jobOpenings.length !== 1 ? 's' : ''}`
                  }
                </p>
              </div>
            )}
            
            {/* Job Cards - Show filtered results */}
            {filteredJobs.length > 0 && (
              <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredJobs.map((job) => (
                      <Card key={job._id} className="flex flex-col group hover:shadow-lg transition-shadow">
                          <CardHeader>
                              <div className="flex items-start justify-between gap-2">
                                <CardTitle className="group-hover:text-primary transition-colors">
                                  {job.title}
                                </CardTitle>
                                {job.category && (
                                  <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full whitespace-nowrap">
                                    {job.category.label}
                                  </span>
                                )}
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">{job.department}</p>
                                {job.type && (
                                  <p className="text-xs text-muted-foreground capitalize">{job.type.replace('-', ' ')}</p>
                                )}
                              </div>
                          </CardHeader>
                          <CardContent className="flex-grow">
                             <p className="text-muted-foreground line-clamp-3 text-sm">{job.summary}</p>
                          </CardContent>
                          <CardFooter>
                             <Button asChild className="w-full">
                                  <Link href={`/careers/${job.slug.current}`}>
                                    <Briefcase className="h-4 w-4 mr-2" />
                                    Apply Now
                                  </Link>
                             </Button>
                          </CardFooter>
                      </Card>
                  ))}
              </div>
            )}
            
            {/* No jobs message */}
            {filteredJobs.length === 0 && !loading && jobOpenings.length > 0 && (
              <div className="mt-12 text-center">
                <p className="text-muted-foreground text-lg">No jobs match your current filters.</p>
                <p className="text-muted-foreground mt-2">Try adjusting your search or category selection.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSelectedCategory("all")
                    setSearchTerm("")
                  }}
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
