
'use client';

import { notFound, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { client, JOB_OPENING_QUERY } from "@/lib/sanity";
import { JobOpening } from "@/types/sanity";
import React, { useEffect, useState } from "react";

export default function JobApplicationPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const [job, setJob] = useState<JobOpening | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] = useState<FormData | null>(null);
  const [applicantName, setApplicantName] = useState('');

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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!job) return;
    
    // Prepare form data and show confirmation dialog
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    formData.append('jobSlug', slug);
    formData.append('position', job.title);
    
    // Get applicant name for confirmation
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const name = `${firstName} ${lastName}`.trim();
    
    if (!firstName || !lastName) {
      setSubmitMessage('Please fill in your first and last name.');
      return;
    }
    
    setApplicantName(name);
    setFormDataToSubmit(formData);
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    if (!formDataToSubmit) return;
    
    setShowConfirmDialog(false);
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {      
      const response = await fetch('/api/job-application', {
        method: 'POST',
        body: formDataToSubmit,
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSubmitMessage('Application submitted successfully! HR department has been notified and will contact you soon.');
        // Reset form
        const form = document.querySelector('form') as HTMLFormElement;
        if (form) form.reset();
      } else {
        setSubmitMessage(`Error: ${result.error || 'Failed to submit application. Please try again.'}`);
      }
    } catch (error) {
      console.error('Application submission error:', error);
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
      setFormDataToSubmit(null);
    }
  };

  const handleCancelSubmit = () => {
    setShowConfirmDialog(false);
    setFormDataToSubmit(null);
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
            
            {submitMessage && (
              <div className={`p-4 rounded-lg mb-6 ${
                submitMessage.includes('successfully') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {submitMessage}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="firstName" className="sr-only">First Name</Label>
                        <Input id="firstName" name="firstName" placeholder="First Name" required disabled={isSubmitting} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="middleName" className="sr-only">Middle Name</Label>
                        <Input id="middleName" name="middleName" placeholder="Middle Name" disabled={isSubmitting} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="lastName" className="sr-only">Last Name</Label>
                        <Input id="lastName" name="lastName" placeholder="Last Name" required disabled={isSubmitting} />
                    </div>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="position" className="sr-only">Position</Label>
                    <Input id="position" name="position" value={`POSITION: ${job.title.toUpperCase()}`} readOnly className="bg-secondary/50 font-semibold" />
                </div>
                
                <div className="space-y-1">
                    <Label htmlFor="email" className="sr-only">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="Email Address" required disabled={isSubmitting} />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="phone" className="sr-only">Contact Number</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="Contact Number" required disabled={isSubmitting} />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="message" className="sr-only">Email Message</Label>
                    <Textarea id="message" name="message" placeholder="Email Message" rows={6} disabled={isSubmitting} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="resume" className="font-semibold text-foreground">Upload Resume*</Label>
                    <Input 
                      id="resume" 
                      name="resume"
                      type="file" 
                      required 
                      accept=".pdf,.doc,.docx,.txt"
                      className="file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" 
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-muted-foreground">Max. file size: 50 MB. Accepted formats: PDF, DOC, DOCX, TXT</p>
                </div>
                
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                </Button>
            </form>
          </div>

        </div>
      </div>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md mx-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Submitting Application</h3>
            <p className="text-muted-foreground">
              Please wait while we process your application and send notifications to the HR department...
            </p>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Application Submission</DialogTitle>
            <DialogDescription className="text-left">
              Are you sure you want to submit your job application?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2 text-sm">
              <p><strong>Applicant:</strong> {applicantName}</p>
              <p><strong>Position:</strong> {job?.title}</p>
              <p className="text-muted-foreground mt-4">
                Once submitted, your application and resume will be sent to our HR department for review. 
                You will receive a confirmation and we'll contact you if you're selected for an interview.
              </p>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleCancelSubmit}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSubmit}>
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
