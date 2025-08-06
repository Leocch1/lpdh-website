'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, Phone, MapPin, CheckCircle, Upload, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { client, urlFor } from "@/lib/sanity";

// Simple native select to avoid Radix UI issues
interface SimpleSelectProps {
    value: string;
    onValueChange: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
    options: string[];
}

function SimpleSelect({ value, onValueChange, disabled, placeholder, options }: SimpleSelectProps) {
    return (
        <select
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            disabled={disabled}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
            <option value="" disabled>
                {placeholder}
            </option>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
}

// Sanity queries
const SCHEDULE_LAB_QUERY = `*[_type == "scheduleLabPage"][0] {
    _id,
    heroSection {
        title,
        subtitle,
        backgroundImage {
            asset
        }
    },
    mainContent {
        sectionTitle,
        description
    },
    infoSection {
        title,
        infoCards[] {
            _key,
            title,
            description,
            icon
        }
    }
}`;

const LAB_TESTS_QUERY = `*[_type == "labTest" && isActive == true] | order(category asc, order asc) {
  _id,
  name,
  category,
  duration,
  isActive,
  order,
  availableDays[],
  availableTimeSlots[],
  preparationNotes,
  resultTime
}`;

const BOOKED_APPOINTMENTS_QUERY = `*[_type == "appointment" && appointmentDate == $date && status != "cancelled"] {
    appointmentTime
}`;

// Updated interface to handle optional labDepartment
interface LabTest {
  _id: string;
  name: string;
  category: string;
  duration: string;
  isActive: boolean;
  order: number;
  availableDays: string[];
  availableTimeSlots: string[];
  preparationNotes?: string;
  resultTime?: string;
}

interface ScheduleLabPageData {
    _id: string;
    heroSection: {
        title: string;
        subtitle: string;
        backgroundImage?: {
            asset: any;
        };
    };
    mainContent: {
        sectionTitle: string;
        description: string;
    };
    infoSection: {
        title: string;
        infoCards: Array<{
            _key: string;
            title: string;
            description: string;
            icon: string;
        }>;
    };
}

// Add interfaces for custom alert
interface CustomAlert {
    isOpen: boolean;
    type: 'success' | 'error' | 'warning';
    title: string;
    message: string;
    action?: () => void;
}

export default function ScheduleLabPage() {
  const [pageData, setPageData] = useState<ScheduleLabPageData | null>(null);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  
  // Add missing state declarations
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [customAlert, setCustomAlert] = useState<CustomAlert | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    notes: "",
    hasDoctorRequest: true, // Set to true by default since it's required
    doctorRequestNotes: ""
  });
  const [doctorRequestFile, setDoctorRequestFile] = useState<File | null>(null);
  const [doctorRequestPreview, setDoctorRequestPreview] = useState<string | null>(null);

  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pageContent, testsData] = await Promise.all([
          client.fetch(SCHEDULE_LAB_QUERY),
          client.fetch(LAB_TESTS_QUERY)
        ]);
        
        setPageData(pageContent);
        setLabTests(testsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchBookedAppointments = async () => {
      if (!formData.date) {
        setBookedTimes([]);
        return;
      }

      try {
        const bookedAppointments = await client.fetch(BOOKED_APPOINTMENTS_QUERY, {
          date: formData.date
        });

        const bookedTimeSlots = bookedAppointments.map((apt: any) => apt.appointmentTime);
        setBookedTimes(bookedTimeSlots);
      } catch (error) {
        console.error('Error fetching booked appointments:', error);
        setBookedTimes([]);
      }
    };

    fetchBookedAppointments();
  }, [formData.date]);

  const handleTestSelection = (testId: string) => {
    setSelectedTests(prev =>
      prev.includes(testId)
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  const createAppointment = async (appointmentData: any) => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create appointment');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  };

  // Phone number validation function
  const validatePhoneNumber = (phone: string) => {
    // Remove any non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (digitsOnly.length === 0) {
      return "Phone number is required";
    } else if (digitsOnly.length !== 11) {
      return "Phone number must be exactly 11 digits";
    } else if (!/^\d+$/.test(digitsOnly)) {
      return "Phone number can only contain digits";
    }
    return "";
  };

  // Handle phone input change with validation
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow only digits and common phone number formatting characters
    const sanitized = value.replace(/[^\d\s\-\(\)\+]/g, '');
    
    // Update form data
    setFormData({...formData, phone: sanitized});
    
    // Validate and set error
    const error = validatePhoneNumber(sanitized);
    setPhoneError(error);
  };

  // Handle doctor's request file upload
  const handleDoctorRequestFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setCustomAlert({
          isOpen: true,
          type: 'error',
          title: 'Invalid File Type',
          message: 'Please select an image file (JPG, PNG, etc.)'
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setCustomAlert({
          isOpen: true,
          type: 'error',
          title: 'File Too Large',
          message: 'File size must be less than 5MB'
        });
        return;
      }

      setDoctorRequestFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setDoctorRequestPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove doctor's request file
  const removeDoctorRequestFile = () => {
    setDoctorRequestFile(null);
    setDoctorRequestPreview(null);
    // Clear file input
    const fileInput = document.getElementById('doctorRequest') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const uploadImageToSanity = async (file: File): Promise<any> => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const { asset } = await response.json()
      return asset
    } catch (error) {
      console.error('Error uploading image:', error)
      throw new Error('Failed to upload image')
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number before submission
    const phoneValidationError = validatePhoneNumber(formData.phone);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      return;
    }

    // Validate doctor's request is provided
    if (!doctorRequestFile) {
      setCustomAlert({
        isOpen: true,
        type: 'warning',
        title: 'Doctor\'s Request Required',
        message: 'Please upload a doctor\'s request/prescription image. This is required for all lab appointments.'
      });
      return;
    }

    setIsConfirmationModalOpen(true);
  };

  const handleConfirmSubmission = async () => {
    setSubmitting(true);
    setIsConfirmationModalOpen(false);

    try {
      // Double-check if the time slot is still available
      const recentBookedAppointments = await client.fetch(BOOKED_APPOINTMENTS_QUERY, {
        date: formData.date
      });
      
      const recentBookedTimes = recentBookedAppointments.map((apt: any) => apt.appointmentTime);
      
      if (recentBookedTimes.includes(formData.time)) {
        setCustomAlert({
          isOpen: true,
          type: 'warning',
          title: 'Time Slot Unavailable',
          message: 'Sorry, this time slot has been booked by another patient. Please select a different time.',
          action: () => {
            setBookedTimes(recentBookedTimes);
            setFormData(prev => ({ ...prev, time: "" }));
          }
        });
        return;
      }

      // Upload doctor's request image (now required)
      let doctorRequestImageAsset = null;
      try {
        doctorRequestImageAsset = await uploadImageToSanity(doctorRequestFile!);
      } catch (error) {
        setCustomAlert({
          isOpen: true,
          type: 'error',
          title: 'Upload Failed',
          message: 'Failed to upload doctor\'s request image. Please try again.'
        });
        return;
      }

      // Clean phone number (keep only digits) for submission
      const cleanPhone = formData.phone.replace(/\D/g, '');

      const appointmentData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: cleanPhone,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        selectedTests: selectedTests,
        hasDoctorRequest: true, // Always true now
        doctorRequestImage: doctorRequestImageAsset,
        doctorRequestNotes: formData.doctorRequestNotes
      };

      // Create appointment in Sanity using API route
      const newAppointment = await createAppointment(appointmentData);
      
      console.log('Appointment created successfully:', newAppointment);
      
      // Reset form and clear errors
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        notes: "",
        hasDoctorRequest: true, // Keep true since it's required
        doctorRequestNotes: ""
      });
      setSelectedTests([]);
      setPhoneError("");
      setDoctorRequestFile(null);
      setDoctorRequestPreview(null);
      
      setCustomAlert({
        isOpen: true,
        type: 'success',
        title: 'Appointment Scheduled!',
        message: `Lab appointment scheduled successfully! Your appointment number is: ${newAppointment.appointmentNumber}. We will contact you shortly to confirm.`
      });
      
    } catch (error) {
      console.error('Error submitting appointment:', error);
      
      // More detailed error handling
      if (error instanceof Error) {
        if (error.message.includes('Insufficient permissions')) {
          setCustomAlert({
            isOpen: true,
            type: 'error',
            title: 'Permission Error',
            message: 'Unable to schedule appointment due to permissions. Please contact us directly at (02) 8825-5236.'
          });
        } else if (error.message.includes('authentication')) {
          setCustomAlert({
            isOpen: true,
            type: 'error',
            title: 'Authentication Error',
            message: 'Authentication error. Please refresh the page and try again.'
          });
        } else {
          setCustomAlert({
            isOpen: true,
            type: 'error',
            title: 'Error',
            message: `Error: ${error.message}. Please try again or contact us directly.`
          });
        }
      } else {
        setCustomAlert({
          isOpen: true,
          type: 'error',
          title: 'Appointment Error',
          message: 'There was an error scheduling your appointment. Please try again or contact us directly.'
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Get available time slots for selected date (excluding booked times)
  const getAvailableTimeSlots = () => {
    if (!formData.date || selectedTests.length === 0) return [];
    
    const selectedDate = new Date(formData.date);
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Get time slots that are available for all selected tests
    const selectedTestData = labTests.filter(test => selectedTests.includes(test._id));
    
    if (selectedTestData.length === 0) return [];
    
    // Find common available days and time slots
    let availableSlots = selectedTestData[0].availableTimeSlots || [];
    
    for (const test of selectedTestData) {
      if (!test.availableDays.includes(dayName)) {
        return []; // If any test is not available on this day, no slots available
      }
      
      // Intersect time slots
      availableSlots = availableSlots.filter(slot => 
        test.availableTimeSlots?.includes(slot)
      );
    }
    
    // Filter out booked time slots
    return availableSlots.filter(slot => !bookedTimes.includes(slot));
  };

  // Group tests by category
  const groupedTests = labTests.reduce((acc, test) => {
    if (!acc[test.category]) {
      acc[test.category] = [];
    }
    acc[test.category].push(test);
    return acc;
  }, {} as Record<string, LabTest[]>);

  const availableTimeSlots = getAvailableTimeSlots();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const heroSection = pageData?.heroSection || {
    title: "Schedule Lab Work",
    subtitle: "Book your laboratory tests and imaging services with our experienced technicians"
  };

  const mainContent = pageData?.mainContent || {
    sectionTitle: "Select Lab Tests",
    description: ""
  };

  const infoSection = pageData?.infoSection || {
    title: "Important Information",
    infoCards: [
      {
        _key: "1",
        title: "Preparation Instructions",
        description: "Some tests require fasting or special preparation. We'll provide detailed instructions after booking.",
        icon: "preparation"
      },
      {
        _key: "2",
        title: "Results Timeline",
        description: "Most results are available within 24-48 hours. Complex tests may take longer.",
        icon: "timeline"
      },
      {
        _key: "3",
        title: "Quality Assurance",
        description: "All tests are performed using state-of-the-art equipment by certified technicians.",
        icon: "quality"
      }
    ]
  };

  const heroImageSrc = pageData?.heroSection?.backgroundImage
    ? urlFor(pageData.heroSection.backgroundImage.asset).width(1600).height(600).url()
    : "/contact.jpg";

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
        <Image
          src={heroImageSrc}
          alt="Laboratory services"
          data-ai-hint="medical laboratory"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {heroSection.title}
          </h1>
          <p className="mt-4 text-lg max-w-3xl lg:text-xl">
            {heroSection.subtitle}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
            
            {/* Test Selection */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6 lg:text-3xl">
                  {mainContent.sectionTitle}
                </h2>
                
                {Object.entries(groupedTests).map(([category, tests]) => (
                  <Card key={category} className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg lg:text-xl">{category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 lg:space-y-4">
                        {tests.map((test) => (
                          <div 
                            key={test._id}
                            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                              selectedTests.includes(test._id) 
                                ? 'border-primary bg-primary/5 scale-[1.02]' 
                                : 'border-border hover:border-primary/50 hover:scale-[1.01]'
                            }`}
                            onClick={() => handleTestSelection(test._id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <CheckCircle 
                                    className={`h-5 w-5 lg:h-6 lg:w-6 ${
                                      selectedTests.includes(test._id) 
                                        ? 'text-primary' 
                                        : 'text-muted-foreground'
                                    }`}
                                  />
                                  <h4 className="font-medium">{test.name}</h4>
                                </div>
                                <div className="flex gap-4 mt-2 ml-7">
                                  <Badge variant="outline">{test.duration}</Badge>
                                  {test.resultTime && (
                                    <Badge variant="secondary">Results: {test.resultTime}</Badge>
                                  )}
                                </div>
                                {test.preparationNotes && (
                                  <p className="text-xs text-muted-foreground mt-2 ml-7">
                                    {test.preparationNotes}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Show message when no tests available */}
                {Object.keys(groupedTests).length === 0 && !loading && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">No lab tests available at the moment.</p>
                      <p className="text-sm text-muted-foreground mt-2">Please check back later or contact us directly.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Booking Form */}
            <div className="space-y-6">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Schedule Your Appointment</CardTitle>
                  {selectedTests.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {selectedTests.length} test{selectedTests.length !== 1 ? 's' : ''} selected
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        placeholder="09xxxxxxxxx (11 digits)"
                        className={phoneError ? "border-red-500 focus:border-red-500" : ""}
                      />
                      {phoneError && (
                        <p className="text-xs text-red-500 mt-1">
                          {phoneError}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Enter 11-digit phone number (e.g., 09123456789)
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="date">Preferred Date</Label>
                      <Input
                        id="date"
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value, time: ""})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="time">Preferred Time</Label>
                      <SimpleSelect
                        value={formData.time}
                        onValueChange={(value) => setFormData({...formData, time: value})}
                        disabled={!formData.date || selectedTests.length === 0}
                        placeholder={
                          !formData.date 
                            ? "Select date first" 
                            : availableTimeSlots.length === 0 
                              ? "No available slots" 
                              : "Select time slot"
                        }
                        options={availableTimeSlots}
                      />
                      {formData.date && selectedTests.length > 0 && availableTimeSlots.length === 0 && (
                        <p className="text-xs text-red-500 mt-1">
                          {bookedTimes.length > 0 
                            ? "All time slots are booked for this date. Please choose another date."
                            : "Selected tests are not available on this date. Please choose another date."
                          }
                        </p>
                      )}
                      {bookedTimes.length > 0 && formData.date && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Booked hours: {bookedTimes.join(', ')}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="notes">Special Instructions (Optional)</Label>
                      <Textarea
                        id="notes"
                        rows={3}
                        placeholder="Any special requirements or notes..."
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      />
                    </div>

                    {/* Doctor's Request Section - Now Required */}
                    <div className="border-t pt-4">
                      <div className="mb-3">
                        <Label className="text-sm font-medium text-red-600">
                          Doctor's Request/Prescription *
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          A doctor's request or prescription is required for all lab appointments
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="doctorRequest" className="text-sm">
                            Upload Request Image *
                          </Label>
                          <div className="mt-1">
                            {!doctorRequestPreview ? (
                              <div className="border-2 border-dashed border-red-300 rounded-lg p-4 text-center hover:border-red-400 transition-colors">
                                <input
                                  type="file"
                                  id="doctorRequest"
                                  accept="image/*"
                                  onChange={handleDoctorRequestFile}
                                  className="hidden"
                                  required
                                />
                                <label htmlFor="doctorRequest" className="cursor-pointer">
                                  <Upload className="h-8 w-8 mx-auto text-red-400 mb-2" />
                                  <p className="text-sm text-gray-600">
                                    Click to upload doctor's request *
                                  </p>
                                  <p className="text-xs text-red-500 mt-1">
                                    Required: JPG, PNG up to 5MB
                                  </p>
                                </label>
                              </div>
                            ) : (
                              <div className="relative">
                                <div className="border rounded-lg p-2 border-green-300 bg-green-50">
                                  <Image
                                    src={doctorRequestPreview}
                                    alt="Doctor's request preview"
                                    width={200}
                                    height={150}
                                    className="w-full h-32 object-cover rounded"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={removeDoctorRequestFile}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Please upload a clear photo or scan of your doctor's prescription or request form
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="doctorRequestNotes" className="text-sm">
                            Additional Notes (Optional)
                          </Label>
                          <Textarea
                            id="doctorRequestNotes"
                            rows={2}
                            placeholder="Any additional information about the doctor's request..."
                            value={formData.doctorRequestNotes}
                            onChange={(e) => setFormData({...formData, doctorRequestNotes: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={
                        selectedTests.length === 0 || 
                        !formData.time || 
                        submitting || 
                        phoneError !== "" ||
                        !doctorRequestFile // Add this validation
                      }
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {submitting ? 'Scheduling...' : 'Schedule Appointment'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

             
            </div>
          </div>
        </div>
      </section>

      {/* General Info Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-12 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-12 lg:text-3xl">
            {infoSection.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {infoSection.infoCards.map(card => (
              <Card key={card._key} className="bg-white dark:bg-gray-800">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Confirmation Modal */}
      {isConfirmationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 relative m-4">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">Confirm Requests</h3>
            <p className="text-center text-gray-600 mb-6">
              Please review your appointment details before confirming.
            </p>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-green-500" />
                <span className="font-semibold">Tests:</span>
                <span>{selectedTests.map(testId => labTests.find(t => t._id === testId)?.name).join(', ')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-green-500" />
                <span className="font-semibold">Date:</span>
                <span>{formData.date}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-green-500" />
                <span className="font-semibold">Time:</span>
                <span>{formData.time}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-500" />
                <span className="font-semibold">Phone:</span>
                <span>{formData.phone}</span>
              </div>
            </div>
            <div className="mt-8 flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsConfirmationModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmSubmission}
                disabled={submitting}
              >
                {submitting ? 'Confirming...' : 'Confirm Appointment'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* General Modal for all alerts (success, error, warning) */}
      {customAlert?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[350px] flex flex-col p-4 relative items-center justify-center bg-white dark:bg-gray-800 border border-border rounded-2xl shadow-lg">
            <div className="text-center p-3 flex-auto justify-center">
              {customAlert.type === 'success' && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 flex items-center text-green-500 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              {customAlert.type === 'error' && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 flex items-center text-red-500 mx-auto"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
              {customAlert.type === 'warning' && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 flex items-center text-yellow-500 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              )}
              <h2 className="text-xl font-bold py-4 text-gray-800 dark:text-gray-200">{customAlert.title}</h2>
              <p className="text-sm text-gray-500 px-2">{customAlert.message}</p>
            </div>
            <div className="p-2 mt-2 text-center">
              <Button
                onClick={() => {
                  setCustomAlert(null);
                  if (customAlert.action) {
                    customAlert.action();
                  }
                }}
                className={`px-5 py-2 text-sm shadow-sm font-medium tracking-wider border-2 rounded-full transition ease-in duration-300 ${
                  customAlert.type === 'success' ? 'bg-green-500 hover:bg-green-600 border-green-400 hover:border-green-600 text-white' :
                  customAlert.type === 'error' ? 'bg-red-500 hover:bg-red-600 border-red-400 hover:border-red-600 text-white' :
                  'bg-yellow-500 hover:bg-yellow-600 border-yellow-400 hover:border-yellow-600 text-white'
                }`}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}