
'use client';

import { notFound, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { client, JOB_OPENING_QUERY } from "@/lib/sanity";
import { JobOpening } from "@/types/sanity";
import React, { useEffect, useState } from "react";

export default function JobApplicationPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const [job, setJob] = useState<JobOpening | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
        
        if (projectId && projectId !== 'your-project-id-here' && slug) {
          const jobData = await client.fetch(JOB_OPENING_QUERY, { slug });
          setJob(jobData);
        }
      } catch (error) {
        console.error('Error fetching job data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-background py-12 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    notFound();
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Application submitted!');
  };

  return (
    <div className="bg-background py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Job Details Section */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold text-primary">{job.title.toUpperCase()}</h1>
            
            <div>
              <h2 className="text-lg font-semibold text-foreground tracking-widest mb-2">JOB SUMMARY</h2>
              <p className="text-muted-foreground">{job.summary}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground tracking-widest mb-2">SPECIFIC DUTIES & RESPONSIBILITIES</h2>
              {job.duties && job.duties.length > 0 ? (
                <ul className="list-decimal list-inside text-muted-foreground space-y-2">
                  {job.duties.filter(duty => duty && duty.text).map((duty, index) => (
                    <li key={index}>{duty.text}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No specific duties listed for this position.</p>
              )}
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-foreground tracking-widest mb-2">JOB SPECIFICATION</h2>
              {job.qualifications && job.qualifications.length > 0 ? (
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  {job.qualifications.filter(qual => qual && qual.text).map((qual, index) => (
                    <li key={index}>{qual.text}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No specific qualifications listed for this position.</p>
              )}
            </div>
          </div>
          
          {/* Application Form Section */}
          <div className="bg-card p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-primary mb-6">Application Form</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="firstName" className="sr-only">First Name</Label>
                        <Input id="firstName" placeholder="First Name" required />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="middleName" className="sr-only">Middle Name</Label>
                        <Input id="middleName" placeholder="Middle Name" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="lastName" className="sr-only">Last Name</Label>
                        <Input id="lastName" placeholder="Last Name" required />
                    </div>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="position" className="sr-only">Position</Label>
                    <Input id="position" value={`POSITION: ${job.title.toUpperCase()}`} readOnly className="bg-secondary/50 font-semibold" />
                </div>
                
                <div className="space-y-1">
                    <Label htmlFor="email" className="sr-only">Email Address</Label>
                    <Input id="email" type="email" placeholder="Email Address" required />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="phone" className="sr-only">Contact Number</Label>
                    <Input id="phone" type="tel" placeholder="Contact Number" required />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="message" className="sr-only">Email Message</Label>
                    <Textarea id="message" placeholder="Email Message" rows={6} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="resume" className="font-semibold text-foreground">Upload Resume*</Label>
                    <Input id="resume" type="file" required className="file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" />
                    <p className="text-xs text-muted-foreground">Max. file size: 50 MB.</p>
                </div>
                
                <Button type="submit" size="lg" className="w-full">
                    Submit Application
                </Button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
