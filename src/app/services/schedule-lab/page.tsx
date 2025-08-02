'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, Phone, MapPin, CheckCircle } from "lucide-react";
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

// Query to check booked appointments for a specific date
const BOOKED_APPOINTMENTS_QUERY = `*[_type == "appointment" && appointmentDate == $date && status != "cancelled"] {
  appointmentTime
}`;

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

export default function ScheduleLabPage() {
  const [pageData, setPageData] = useState<ScheduleLabPageData | null>(null);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    notes: ""
  });

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

  // Fetch booked appointments when date changes
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
        throw new Error('Failed to create appointment');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number before submission
    const phoneValidationError = validatePhoneNumber(formData.phone);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      return;
    }

    setSubmitting(true);

    try {
      // Double-check if the time slot is still available using read client
      const recentBookedAppointments = await client.fetch(BOOKED_APPOINTMENTS_QUERY, {
        date: formData.date
      });
      
      const recentBookedTimes = recentBookedAppointments.map((apt: any) => apt.appointmentTime);
      
      if (recentBookedTimes.includes(formData.time)) {
        alert('Sorry, this time slot has been booked by another patient. Please select a different time.');
        setBookedTimes(recentBookedTimes);
        setFormData(prev => ({ ...prev, time: "" }));
        return;
      }

      // Clean phone number (keep only digits) for submission
      const cleanPhone = formData.phone.replace(/\D/g, '');

      const appointmentData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: cleanPhone, // Submit only digits
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        selectedTests: selectedTests
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
        notes: ""
      });
      setSelectedTests([]);
      setPhoneError("");
      
      alert(`Lab appointment scheduled successfully! Your appointment number is: ${newAppointment.appointmentNumber}. We will contact you shortly to confirm.`);
      
    } catch (error) {
      console.error('Error submitting appointment:', error);
      
      // More detailed error handling
      if (error instanceof Error) {
        if (error.message.includes('Insufficient permissions')) {
          alert('Unable to schedule appointment due to permissions. Please contact us directly at (02) 8825-5236.');
        } else if (error.message.includes('authentication')) {
          alert('Authentication error. Please refresh the page and try again.');
        } else {
          alert(`Error: ${error.message}. Please try again or contact us directly.`);
        }
      } else {
        alert('There was an error scheduling your appointment. Please try again or contact us directly.');
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

  // Fallback values when pageData is not available
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

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={selectedTests.length === 0 || !formData.time || submitting || phoneError !== ""}
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

      {/* Info Section */}
      <section className="bg-secondary py-12 md:py-24">
        <div className="container px-4 text-center md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8">
            {infoSection.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {infoSection.infoCards.map((card) => (
              <div key={card._key} className="flex flex-col items-center">
                {card.icon === 'preparation' && <FileText className="h-12 w-12 text-primary mb-4" />}
                {card.icon === 'timeline' && <Clock className="h-12 w-12 text-primary mb-4" />}
                {card.icon === 'quality' && <CheckCircle className="h-12 w-12 text-primary mb-4" />}
                <h3 className="font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Button asChild variant="outline" size="lg">
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
