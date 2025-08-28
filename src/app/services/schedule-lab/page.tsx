'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, CalendarCheck, Clock, FileText, Phone, MapPin, CheckCircle, Upload, X, Mail, TestTube, Loader2, Building2, TestTube2, Stethoscope, AlertTriangle, Info } from "lucide-react";
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
            <option value="" disabled>{placeholder}</option>
            {options.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    );
}

interface LabTest {
  _id: string;
  name: string;
  duration?: string;
  resultTime?: string;
  preparationNotes?: string[];
  allowOnlineBooking?: boolean;
  bookingUnavailableMessage?: string;
  requiresEligibilityCheck?: boolean;
  availableDays?: string[];
  availableTimeSlots?: string[];
  eligibilityQuestions?: Array<{
    _key: string;
    question: string;
    warningMessage?: string;
    riskLevel?: 'low' | 'medium' | 'high';
  }>;
  labDepartment?: {
    name: string;
  };
}

interface ScheduleLabPageData {
  heroSection: {
    title: string;
    subtitle: string;
    backgroundImage?: {
      asset: any;
    };
  };
  mainContent: {
    sectionTitle: string;
    description?: string;
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

// Add interface for custom alert modal
interface CustomAlert {
  isOpen: boolean;
  type: 'success' | 'error' | 'warning';
  title: string;
  message: string;
  action?: () => void;
}

// Sanity queries
const SCHEDULE_LAB_PAGE_QUERY = `*[_type == "scheduleLabPage"][0]{
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

const LAB_DEPARTMENTS_QUERY = `*[_type == "labDepartment" && isActive == true] | order(order asc) {
  _id,
  name,
  slug,
  description,
  email,
  phoneNumber,
  location
}`;

const LAB_TESTS_QUERY = `*[_type == "labTest"] | order(labDepartment.name asc) {
  _id,
  name,
  duration,
  resultTime,
  preparationNotes,
  allowOnlineBooking,
  bookingUnavailableMessage,
  requiresEligibilityCheck,
  availableDays,
  availableTimeSlots,
  eligibilityQuestions[] {
    _key,
    question,
    warningMessage,
    riskLevel
  },
  labDepartment-> {
    _id,
    name,
    email
  }
}`;

const BOOKED_APPOINTMENTS_QUERY = `*[_type == "appointment" && appointmentDate == $date] {
  appointmentTime
}`;

export default function ScheduleLabPage() {
  const [pageData, setPageData] = useState<ScheduleLabPageData | null>(null);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [labDepartments, setLabDepartments] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submissionStep, setSubmissionStep] = useState<'idle' | 'uploading' | 'scheduling' | 'complete'>('idle');
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  
  // Add missing state declarations
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [customAlert, setCustomAlert] = useState<CustomAlert | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    notes: "",
    hasDoctorRequest: true,
    doctorRequestNotes: ""
  });
  
  // Temporary form data for editing in confirmation modal
  const [tempFormData, setTempFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    notes: "",
    doctorRequestNotes: ""
  });
  
  const [doctorRequestFile, setDoctorRequestFile] = useState<File | null>(null);
  const [doctorRequestPreview, setDoctorRequestPreview] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState("");
  
  // Eligibility check state
  const [eligibilityAnswers, setEligibilityAnswers] = useState<Record<string, Record<string, boolean>>>({});
  const [eligibilityWarnings, setEligibilityWarnings] = useState<string[]>([]);
  const [canProceed, setCanProceed] = useState(true);
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pageResult, testsResult, departmentsResult] = await Promise.all([
          client.fetch(SCHEDULE_LAB_PAGE_QUERY),
          client.fetch(LAB_TESTS_QUERY),
          client.fetch(LAB_DEPARTMENTS_QUERY)
        ]);
        
        setPageData(pageResult);
        setLabTests(testsResult || []);
        setLabDepartments(departmentsResult || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchBookedTimes = async () => {
      if (formData.date) {
        try {
          const bookedAppointments = await client.fetch(BOOKED_APPOINTMENTS_QUERY, {
            date: formData.date
          });
          setBookedTimes(bookedAppointments.map((apt: any) => apt.appointmentTime));
        } catch (error) {
          console.error('Error fetching booked times:', error);
        }
      }
    };

    fetchBookedTimes();
  }, [formData.date]);

  // Eligibility check functions
  const checkEligibility = () => {
    const warnings: string[] = [];
    let canContinue = true;
    
    Object.entries(eligibilityAnswers).forEach(([testId, answers]) => {
      const test = labTests.find(t => t._id === testId);
      if (!test?.eligibilityQuestions) return;
      
      test.eligibilityQuestions.forEach(question => {
        if (answers[question._key] === true && question.warningMessage) {
          warnings.push(`${test.name}: ${question.warningMessage}`);
          if (question.riskLevel === 'high') {
            canContinue = false;
          }
        }
      });
    });
    
    setEligibilityWarnings(warnings);
    setCanProceed(canContinue);
    
    if (canContinue) {
      // Proceed with confirmation modal
      setTempFormData({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        doctorRequestNotes: formData.doctorRequestNotes
      });
      setIsConfirmationModalOpen(true);
    } else {
      setCustomAlert({
        isOpen: true,
        type: 'error',
        title: 'Cannot Proceed',
        message: 'Your answers indicate high-risk conditions that prevent scheduling this appointment. Please consult with your doctor first.'
      });
    }
  };
  
  const handleEligibilityAnswer = (testId: string, questionKey: string, answer: boolean) => {
    setEligibilityAnswers(prev => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        [questionKey]: answer
      }
    }));
  };

  const handleTestSelection = (testId: string) => {
    const isCurrentlySelected = selectedTests.includes(testId);
    
    if (isCurrentlySelected) {
      // Remove test from selection
      setSelectedTests(prev => prev.filter(id => id !== testId));
    } else {
      // Replace current selection with just this test (single selection)
      setSelectedTests([testId]);
    }
    
    // Reset form data when test selection changes
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      notes: "",
      hasDoctorRequest: true,
      doctorRequestNotes: ""
    });
    
    // If selecting a test that requires eligibility check, initialize answers
    if (!isCurrentlySelected) {
      const test = labTests.find(t => t._id === testId);
      if (test?.requiresEligibilityCheck && test.eligibilityQuestions) {
        const initialAnswers: Record<string, boolean> = {};
        test.eligibilityQuestions.forEach(question => {
          initialAnswers[question._key] = false;
        });
        setEligibilityAnswers(prev => ({
          ...prev,
          [testId]: initialAnswers
        }));
      }
    }
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
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
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
    } else if (!/^09\d{9}$/.test(digitsOnly)) {
      return "Phone number must be 11 digits and start with '09'";
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
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setCustomAlert({
          isOpen: true,
          type: 'error',
          title: 'File Too Large',
          message: 'Please select a file smaller than 5MB.'
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setCustomAlert({
          isOpen: true,
          type: 'error',
          title: 'Invalid File Type',
          message: 'Please select an image file (JPG, PNG, etc.).'
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
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.asset;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
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
        type: 'error',
        title: 'Doctor\'s Request Required',
        message: 'Please upload a doctor\'s request or prescription image before proceeding.'
      });
      return;
    }

    // Validate appointment date is at least 2 days in advance
    const selectedDate = new Date(formData.date);
    const today = new Date();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(today.getDate() + 2);
    twoDaysFromNow.setHours(0, 0, 0, 0); // Set to start of day
    selectedDate.setHours(0, 0, 0, 0); // Set to start of day
    
    if (selectedDate < twoDaysFromNow) {
      setCustomAlert({
        isOpen: true,
        type: 'error',
        title: 'Invalid Date',
        message: 'Appointments must be scheduled at least 2 days in advance.'
      });
      return;
    }

    // Check if any selected tests require eligibility checking
    const testsRequiringCheck = labTests.filter(test => 
      selectedTests.includes(test._id) && test.requiresEligibilityCheck
    );
    
    if (testsRequiringCheck.length > 0) {
      // Initialize eligibility answers for tests that need checking
      const initialAnswers: Record<string, Record<string, boolean>> = {};
      testsRequiringCheck.forEach(test => {
        if (test.eligibilityQuestions) {
          initialAnswers[test._id] = {};
          test.eligibilityQuestions.forEach(question => {
            initialAnswers[test._id][question._key] = false;
          });
        }
      });
      setEligibilityAnswers(initialAnswers);
      setShowEligibilityModal(true);
      return;
    }

    // If no eligibility check needed, proceed directly to confirmation
    setTempFormData({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      date: formData.date,
      time: formData.time,
      notes: formData.notes,
      doctorRequestNotes: formData.doctorRequestNotes
    });
    setIsBookingModalOpen(false); // Close booking modal
    setIsConfirmationModalOpen(true); // Open confirmation modal
  };

  const handleConfirmSubmission = async () => {
    setSubmitting(true);
    setSubmissionStep('uploading');
    setIsConfirmationModalOpen(false);

    try {
      // Use tempFormData for the final submission if it was edited
      const finalFormData = editMode ? tempFormData : formData;

      // Double-check if the time slot is still available
      const recentBookedAppointments = await client.fetch(BOOKED_APPOINTMENTS_QUERY, {
        date: finalFormData.date
      });
      
      const recentBookedTimes = recentBookedAppointments.map((apt: any) => apt.appointmentTime);
      
      if (recentBookedTimes.includes(finalFormData.time)) {
        setCustomAlert({
          isOpen: true,
          type: 'error',
          title: 'Time Slot No Longer Available',
          message: 'This time slot was just booked by another patient. Please select a different time.'
        });
        setSubmitting(false);
        setSubmissionStep('idle');
        return;
      }

      // Upload doctor's request image (now required)
      let doctorRequestImageAsset = null;
      try {
        setSubmissionStep('uploading');
        doctorRequestImageAsset = await uploadImageToSanity(doctorRequestFile!);
        console.log('Doctor request image uploaded:', doctorRequestImageAsset);
      } catch (error) {
        console.error('Error uploading doctor request image:', error);
        setCustomAlert({
          isOpen: true,
          type: 'error',
          title: 'Upload Failed',
          message: 'Failed to upload doctor\'s request image. Please try again.'
        });
        setSubmitting(false);
        setSubmissionStep('idle');
        return;
      }

      setSubmissionStep('scheduling');

      // Clean phone number (keep only digits) for submission
      const cleanPhone = finalFormData.phone.replace(/\D/g, '');

      const appointmentData = {
        firstName: finalFormData.firstName,
        lastName: finalFormData.lastName,
        email: finalFormData.email,
        phone: cleanPhone,
        date: finalFormData.date,
        time: finalFormData.time,
        notes: finalFormData.notes,
        selectedTests: selectedTests,
        hasDoctorRequest: true,
        doctorRequestImage: doctorRequestImageAsset,
        doctorRequestNotes: finalFormData.doctorRequestNotes
      };

      // Create appointment in Sanity using API route
      const newAppointment = await createAppointment(appointmentData);
      
      setSubmissionStep('complete');
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
        hasDoctorRequest: true,
        doctorRequestNotes: ""
      });
      setTempFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        notes: "",
        doctorRequestNotes: ""
      });
      setSelectedTests([]);
      setPhoneError("");
      setDoctorRequestFile(null);
      setDoctorRequestPreview(null);
      setEditMode(false);
      setIsBookingModalOpen(false);
      
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
        setCustomAlert({
          isOpen: true,
          type: 'error',
          title: 'Appointment Failed',
          message: `Failed to schedule appointment: ${error.message}`
        });
      } else {
        setCustomAlert({
          isOpen: true,
          type: 'error',
          title: 'Appointment Failed',
          message: 'An unexpected error occurred. Please try again.'
        });
      }
    } finally {
      setSubmitting(false);
      setSubmissionStep('idle');
    }
  };

  // Handle saving changes in confirmation modal
  const handleSaveChanges = () => {
    // Update the main form data with temp data
    setFormData({
      ...formData,
      firstName: tempFormData.firstName,
      lastName: tempFormData.lastName,
      email: tempFormData.email,
      phone: tempFormData.phone,
      date: tempFormData.date,
      time: tempFormData.time,
      notes: tempFormData.notes,
      doctorRequestNotes: tempFormData.doctorRequestNotes
    });
    setEditMode(false);
  };

  // Handle canceling changes in confirmation modal
  const handleCancelChanges = () => {
    // Revert temp data to original form data
    setTempFormData({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      date: formData.date,
      time: formData.time,
      notes: formData.notes,
      doctorRequestNotes: formData.doctorRequestNotes
    });
    setEditMode(false);
  };

  // Get available days based on selected tests and existing appointments
  const getAvailableDays = () => {
    if (selectedTests.length === 0) return [];
    
    const selectedTestData = labTests.filter(test => selectedTests.includes(test._id));
    if (selectedTestData.length === 0) return [];
    
    // Find common available days for all selected tests
    let commonDays = selectedTestData[0].availableDays || [];
    
    for (const test of selectedTestData) {
      commonDays = commonDays.filter(day => test.availableDays?.includes(day));
    }
    
    return commonDays;
  };

  // Check if a specific date is available for selected tests
  const isDateAvailable = (date: string) => {
    if (selectedTests.length === 0) return false;
    
    const selectedDate = new Date(date);
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    const availableDays = getAvailableDays();
    
    // Check if the day is in available days
    if (!availableDays.includes(dayName)) return false;
    
    // Check if it's at least 2 days from today
    const today = new Date();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(today.getDate() + 2);
    
    if (selectedDate < twoDaysFromNow) return false;
    
    return true;
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
      if (!test.availableDays?.includes(dayName)) {
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

  // Generate next 30 available dates for calendar preview
  const getNextAvailableDates = () => {
    const availableDates = [];
    const today = new Date();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(today.getDate() + 2);
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(twoDaysFromNow);
      checkDate.setDate(twoDaysFromNow.getDate() + i);
      
      const dateString = checkDate.toISOString().split('T')[0];
      if (isDateAvailable(dateString)) {
        availableDates.push({
          date: dateString,
          dayName: checkDate.toLocaleDateString('en-US', { weekday: 'short' }),
          dayNumber: checkDate.getDate(),
          month: checkDate.toLocaleDateString('en-US', { month: 'short' })
        });
      }
    }
    
    return availableDates;
  };

  // Filter tests by selected department
  const filteredTests = selectedDepartment === "All Departments" 
    ? labTests 
    : labTests.filter(test => test.labDepartment?.name === selectedDepartment);

  // Group tests by category
  const groupedTests = filteredTests.reduce((acc, test) => {
    const departmentName = test.labDepartment?.name || 'Other Tests';
    if (!acc[departmentName]) {
      acc[departmentName] = [];
    }
    acc[departmentName].push(test);
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
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="font-headline text-4xl tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
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
          <div className="lg:grid lg:grid-cols-4 lg:gap-8 max-w-7xl mx-auto">
            
            {/* Left Sidebar - Lab Departments */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg lg:text-xl flex items-center gap-2">
                      <Building2 className="w-6 h-6 text-green-600" />
                      Lab Departments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {/* Mobile Dropdown */}
                    <div className="lg:hidden p-4">
                      <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="All Departments">All Departments</option>
                        {labDepartments.map((department) => (
                          <option key={department._id} value={department.name}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Desktop Button List */}
                    <div className="hidden lg:block space-y-1 p-2">
                      {/* All Departments Button */}
                      <Button
                        variant={selectedDepartment === "All Departments" ? "default" : "outline"}
                        className={`w-full justify-start h-12 text-left text-sm ${
                          selectedDepartment === "All Departments" 
                            ? "bg-green-600 hover:bg-green-700 text-white" 
                            : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                        }`}
                        onClick={() => setSelectedDepartment("All Departments")}
                      >
                        <div className="mr-3 flex items-center">
                          <Building2 className={`h-5 w-5 ${
                            selectedDepartment === "All Departments" 
                              ? "text-white" 
                              : "text-green-600"
                          }`} />
                        </div>
                        All Departments
                      </Button>
                      
                      {/* Department Buttons */}
                      {labDepartments.map((department) => (
                        <Button
                          key={department._id}
                          variant={selectedDepartment === department.name ? "default" : "outline"}
                          className={`w-full justify-start h-12 text-left text-sm ${
                            selectedDepartment === department.name 
                              ? "bg-green-600 hover:bg-green-700 text-white" 
                              : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                          }`}
                          onClick={() => {
                            if (selectedDepartment === department.name) {
                              setSelectedDepartment("All Departments");
                            } else {
                              setSelectedDepartment(department.name);
                            }
                          }}
                        >
                          <div className="mr-3 flex items-center">
                            <TestTube2 className={`h-5 w-5 ${
                              selectedDepartment === department.name 
                                ? "text-white" 
                                : "text-green-600"
                            }`} />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">{department.name}</div>
                            {department.location && (
                              <div className="text-xs opacity-75">{department.location}</div>
                            )}
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Content - Lab Tests */}
            <div className="lg:col-span-3">
              {/* Results Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2 lg:text-3xl">
                  {filteredTests.length} Test{filteredTests.length !== 1 ? 's' : ''} Available
                </h2>
                <p className="text-muted-foreground lg:text-lg">
                  {selectedDepartment !== "All Departments" 
                    ? `Showing tests from ${selectedDepartment}` 
                    : "Showing tests from all departments"
                  }
                </p>
              </div>

              {/* Lab Tests */}
              {Object.entries(groupedTests).map(([departmentName, tests]) => (
                <Card key={departmentName} className="mb-6">
                  <CardHeader className="border-b">
                    <CardTitle className="text-lg lg:text-xl flex items-center gap-2">
                      <TestTube2 className="w-6 h-6 text-green-600" />
                      {departmentName}
                      <Badge variant="outline" className="ml-auto">
                        {tests.length} {tests.length === 1 ? 'test' : 'tests'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Responsive test cards */}
                    <div className="flex flex-col gap-4">
                      {tests.map((test) => (
                        <div
                          key={test._id}
                          className={`p-4 border rounded-lg transition-all duration-200 ${
                            selectedTests.includes(test._id)
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          {/* Stack content vertically on mobile */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <CheckCircle
                                  className={`h-5 w-5 lg:h-6 lg:w-6 ${
                                    selectedTests.includes(test._id)
                                      ? 'text-primary'
                                      : 'text-muted-foreground'
                                  }`}
                                />
                                <h4 className="font-medium flex items-center gap-2">
                                  {test.name}
                                  {test.requiresEligibilityCheck && (
                                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800 flex items-center gap-1">
                                      <Stethoscope className="h-3 w-3" />
                                      Screening Required
                                    </Badge>
                                  )}
                                  {test.allowOnlineBooking === false && (
                                    <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600 flex items-center gap-1">
                                      <Info className="h-3 w-3" />
                                      Contact Required
                                    </Badge>
                                  )}
                                </h4>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-2 ml-7">
                                <Badge variant="outline">{test.duration}</Badge>
                                {test.resultTime && (
                                  <Badge variant="secondary">Results: {test.resultTime}</Badge>
                                )}
                              </div>
                              {test.preparationNotes && test.preparationNotes.length > 0 && (
                                <ul className="text-xs text-muted-foreground mt-2 ml-7 list-disc list-inside">
                                  {test.preparationNotes.map((note, index) => (
                                    <li key={index}>{note}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                            <div className="w-full sm:w-auto">
                              {test.allowOnlineBooking !== false ? (
                                <Button
                                  onClick={() => {
                                    handleTestSelection(test._id);
                                    setIsBookingModalOpen(true);
                                  }}
                                  variant={selectedTests.includes(test._id) ? "default" : "outline"}
                                  size="sm"
                                  className="w-full sm:w-auto"
                                >
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Book Your Appointment
                                </Button>
                              ) : (
                                <div className="text-center">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled
                                    className="mb-2 w-full sm:w-auto"
                                  >
                                    <Phone className="h-4 w-4 mr-2" />
                                    Contact Required
                                  </Button>
                                  <p className="text-xs text-muted-foreground max-w-32 mx-auto">
                                    {test.bookingUnavailableMessage || 'Please contact the hospital directly to schedule this test'}
                                  </p>
                                </div>
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
                    <p className="text-muted-foreground">
                      {selectedDepartment === "All Departments" 
                        ? "No tests available at the moment." 
                        : `No tests available for ${selectedDepartment} at the moment.`
                      }
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">Please check back later or contact us directly.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* General Info Section */}
      <section className="bg-secondary dark:bg-gray-900 py-12 md:py-24">
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

      {/* Booking Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Schedule Lab Appointment
            </DialogTitle>
          </DialogHeader>
          
          {/* Selected Test Display */}
          {selectedTests.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Selected Test:</h3>
              <div className="space-y-2">
                {selectedTests.map((testId) => {
                  const test = labTests.find(t => t._id === testId);
                  if (!test) return null;
                  return (
                    <div key={test._id} className="flex items-start justify-between bg-white dark:bg-gray-800 p-3 rounded border">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{test.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{test.labDepartment?.name}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Booking Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>
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
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="09xxxxxxxxx (11 digits)"
                />
              </div>
            </div>

            {/* Appointment Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Appointment Details</h3>
              
              {/* Available Days Preview */}
              {selectedTests.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Available Days
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {getAvailableDays().map((day) => (
                      <span key={day} className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-sm rounded">
                        {day}
                      </span>
                    ))}
                  </div>
                  {getAvailableDays().length === 0 && (
                    <p className="text-blue-700 dark:text-blue-300 text-sm">Select tests to see available days</p>
                  )}
                </div>
              )}

              {/* Next Available Dates */}
              {selectedTests.length > 0 && getNextAvailableDates().length > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4" />
                    Next Available Dates (2+ days advance)
                  </h4>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                    {getNextAvailableDates().slice(0, 12).map((dateObj) => (
                      <button
                        key={dateObj.date}
                        type="button"
                        onClick={() => setFormData({...formData, date: dateObj.date, time: ""})}
                        className={`p-2 text-xs rounded border-2 transition-all ${
                          formData.date === dateObj.date
                            ? 'border-green-500 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100'
                            : 'border-green-200 dark:border-green-700 hover:border-green-400 bg-white dark:bg-green-900/30 text-green-700 dark:text-green-200'
                        }`}
                      >
                        <div className="font-medium">{dateObj.dayNumber}</div>
                        <div className="text-xs">{dateObj.month}</div>
                        <div className="text-xs">{dateObj.dayName}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <Label htmlFor="date">Preferred Date</Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={formData.date}
                  min={(() => {
                    const today = new Date();
                    today.setDate(today.getDate() + 2);
                    return today.toISOString().split('T')[0];
                  })()}
                  onChange={(e) => setFormData({...formData, date: e.target.value, time: ""})}
                  className={!isDateAvailable(formData.date) && formData.date ? 'border-red-500' : ''}
                />
                {formData.date && !isDateAvailable(formData.date) && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    Selected date is not available. Please choose from available dates above or select a different date.
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="time">Preferred Time</Label>
                <SimpleSelect
                  value={formData.time}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, time: value }))}
                  placeholder={availableTimeSlots.length > 0 ? "Select time slot" : "Select date first"}
                  options={availableTimeSlots}
                  disabled={availableTimeSlots.length === 0}
                />
                {formData.date && availableTimeSlots.length === 0 && (
                  <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                    No available time slots for selected date. Please choose another date.
                  </p>
                )}
                {availableTimeSlots.length > 0 && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    {availableTimeSlots.length} time slot{availableTimeSlots.length !== 1 ? 's' : ''} available
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
            </div>

            {/* Doctor's Prescription/Request Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Doctor's Request/Prescription
              </h3>
              
              <div>
                <Label htmlFor="doctorRequest">Upload Doctor's Request (Required)</Label>
                <div className="mt-2">
                  {!doctorRequestFile ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Upload an image of your doctor's prescription or request form
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
                        Accepted formats: JPG, PNG, GIF (Max size: 5MB)
                      </p>
                      <input
                        id="doctorRequest"
                        type="file"
                        accept="image/*"
                        onChange={handleDoctorRequestFile}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('doctorRequest')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 bg-green-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-green-900">
                              {doctorRequestFile.name}
                            </p>
                            <p className="text-xs text-green-600">
                              {(doctorRequestFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeDoctorRequestFile}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Image Preview */}
                      {doctorRequestPreview && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 mb-2">Preview:</p>
                          <div className="relative w-full max-w-xs">
                            <Image
                              src={doctorRequestPreview}
                              alt="Doctor's request preview"
                              width={300}
                              height={200}
                              className="rounded border object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="doctorRequestNotes">Additional Notes about Doctor's Request (Optional)</Label>
                <Textarea
                  id="doctorRequestNotes"
                  rows={2}
                  placeholder="Any additional information about the doctor's request..."
                  value={formData.doctorRequestNotes}
                  onChange={(e) => setFormData({...formData, doctorRequestNotes: e.target.value})}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={
                  selectedTests.length === 0 || 
                  !formData.time || 
                  submitting || 
                  uploading ||
                  phoneError !== "" ||
                  !doctorRequestFile
                }
              >
                {submitting || uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {uploading ? 'Uploading...' : 'Scheduling Appointment...'}
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      {isConfirmationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-6 relative m-4 max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">
                {editMode ? 'Edit Appointment Details' : 'Confirm Appointment'}
              </h3>
              <p className="text-center text-gray-600 mb-6">
                {editMode ? 'Make changes to your appointment details below.' : 'Please review your appointment details before confirming.'}
              </p>
                  
              {!editMode ? (
                // Display mode
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-green-500" />
                    <div>
                      <span className="font-medium">Patient:</span> {tempFormData.firstName} {tempFormData.lastName}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-green-500" />
                    <div>
                      <span className="font-medium">Email:</span> {tempFormData.email}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-green-500" />
                    <div>
                      <span className="font-medium">Date:</span> {new Date(tempFormData.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-green-500" />
                    <div>
                      <span className="font-medium">Time:</span> {tempFormData.time}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-green-500" />
                    <div>
                      <span className="font-medium">Phone:</span> {tempFormData.phone}
                    </div>
                  </div>
                  {tempFormData.notes && (
                    <div className="flex items-start space-x-3">
                      <FileText className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <span className="font-medium">Notes:</span> {tempFormData.notes}
                      </div>
                    </div>
                  )}
                  {tempFormData.doctorRequestNotes && (
                    <div className="flex items-start space-x-3">
                      <FileText className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <span className="font-medium">Doctor's Request Notes:</span> {tempFormData.doctorRequestNotes}
                      </div>
                    </div>
                  )}
                  <div className="flex items-start space-x-3">
                    <TestTube className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <span className="font-medium">Selected Tests:</span>
                      <ul className="mt-1 ml-4 list-disc">
                        {selectedTests.map(testId => {
                          const test = labTests.find(t => t._id === testId);
                          return (
                            <li key={testId}>{test?.name}</li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                // Edit mode
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="editFirstName">First Name</Label>
                      <Input
                        id="editFirstName"
                        value={tempFormData.firstName}
                        onChange={(e) => setTempFormData({...tempFormData, firstName: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="editLastName">Last Name</Label>
                      <Input
                        id="editLastName"
                        value={tempFormData.lastName}
                        onChange={(e) => setTempFormData({...tempFormData, lastName: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="editEmail">Email</Label>
                    <Input
                      id="editEmail"
                      type="email"
                      value={tempFormData.email}
                      onChange={(e) => setTempFormData({...tempFormData, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editPhone">Phone Number</Label>
                    <Input
                      id="editPhone"
                      type="tel"
                      value={tempFormData.phone}
                      onChange={(e) => {
                        const sanitized = e.target.value.replace(/[^\d\s\-\(\)\+]/g, '');
                        setTempFormData({...tempFormData, phone: sanitized});
                      }}
                      placeholder="09XXXXXXXXX"
                      required
                      className={validatePhoneNumber(tempFormData.phone) !== "" ? "border-red-500" : ""}
                    />
                    {validatePhoneNumber(tempFormData.phone) !== "" && (
                      <p className="text-red-500 text-sm mt-1">
                        {validatePhoneNumber(tempFormData.phone)}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="editDate">Date</Label>
                      <Input
                        id="editDate"
                        type="date"
                        value={tempFormData.date}
                        onChange={(e) => setTempFormData({...tempFormData, date: e.target.value})}
                        min={(() => {
                          const today = new Date();
                          // Add 2 days to today
                          today.setDate(today.getDate() + 2);
                          // Ensure we're working with local timezone
                          const year = today.getFullYear();
                          const month = String(today.getMonth() + 1).padStart(2, '0');
                          const day = String(today.getDate()).padStart(2, '0');
                          return `${year}-${month}-${day}`;
                        })()}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="editTime">Time</Label>
                      <SimpleSelect
                        value={tempFormData.time}
                        onValueChange={(value) => setTempFormData({...tempFormData, time: value})}
                        placeholder="Select time"
                        options={availableTimeSlots}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="editNotes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="editNotes"
                      value={tempFormData.notes}
                      onChange={(e) => setTempFormData({...tempFormData, notes: e.target.value})}
                      placeholder="Any additional information or special requirements"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editDoctorRequestNotes">Doctor's Request Notes (Optional)</Label>
                    <Textarea
                      id="editDoctorRequestNotes"
                      value={tempFormData.doctorRequestNotes}
                      onChange={(e) => setTempFormData({...tempFormData, doctorRequestNotes: e.target.value})}
                      placeholder="Additional notes about the doctor's request"
                      rows={2}
                    />
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex justify-between">
                {!editMode ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditMode(true)}
                    >
                      Edit Details
                    </Button>
                    <div className="flex space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsConfirmationModalOpen(false);
                          setEditMode(false);
                          // Reset temp form data to original
                          setTempFormData({
                            firstName: formData.firstName,
                            lastName: formData.lastName,
                            email: formData.email,
                            phone: formData.phone,
                            date: formData.date,
                            time: formData.time,
                            notes: formData.notes,
                            doctorRequestNotes: formData.doctorRequestNotes
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleConfirmSubmission}
                        disabled={submitting || uploading}
                        className="min-w-[140px]"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Confirm Appointment'
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelChanges}
                    >
                      Cancel Changes
                    </Button>
                    <Button
                      onClick={handleSaveChanges}
                      disabled={
                        !tempFormData.firstName || 
                        !tempFormData.lastName || 
                        !tempFormData.email || 
                        !tempFormData.phone || 
                        !tempFormData.date || 
                        !tempFormData.time ||
                        validatePhoneNumber(tempFormData.phone) !== ""
                      }
                    >
                      Save Changes
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* General Modal for all alerts (success, error, warning) */}
      {customAlert?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[350px] flex flex-col p-4 relative items-center justify-center bg-white dark:bg-gray-800 border border-border rounded-2xl shadow-lg">
            <div className="text-center p-3 flex-auto justify-center">
              {customAlert?.type === 'success' && (
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
              {customAlert?.type === 'error' && (
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
              {customAlert?.type === 'warning' && (
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
              <h2 className="text-xl font-bold py-4 text-gray-800 dark:text-gray-200">{customAlert?.title}</h2>
              <p className="text-sm text-gray-500 px-2">{customAlert?.message}</p>
            </div>
            <div className="p-2 mt-2 text-center">
              <Button
                onClick={() => {
                  const actionToExecute = customAlert?.action;
                  setCustomAlert(null);
                  if (actionToExecute) {
                    actionToExecute();
                  }
                }}
                className={`px-5 py-2 text-sm shadow-sm font-medium tracking-wider border-2 rounded-full transition ease-in duration-300 ${
                  customAlert?.type === 'success' ? 'bg-green-500 hover:bg-green-600 border-green-400 hover:border-green-600 text-white' :
                  customAlert?.type === 'error' ? 'bg-red-500 hover:bg-red-600 border-red-400 hover:border-red-600 text-white' :
                  'bg-yellow-500 hover:bg-yellow-600 border-yellow-400 hover:border-yellow-600 text-white'
                }`}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Eligibility Check Modal */}
      {showEligibilityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6 relative m-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">
              Medical Screening Questions
            </h3>
            <p className="text-center text-gray-600 mb-6">
              Please answer the following questions to ensure your safety during the examination.
            </p>
            
            <div className="space-y-6">
              {labTests
                .filter(test => selectedTests.includes(test._id) && test.requiresEligibilityCheck)
                .map(test => (
                  <div key={test._id} className="border rounded-lg p-4">
                    <h4 className="font-bold text-lg text-gray-800 mb-3 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-500" />
                      {test.name}
                    </h4>
                    
                    <div className="space-y-3">
                      {test.eligibilityQuestions?.map(question => (
                        <div key={question._key} className="border-l-4 border-gray-200 pl-4">
                          <p className="font-medium text-gray-700 mb-2">{question.question}</p>
                          <div className="flex space-x-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`${test._id}_${question._key}`}
                                value="no"
                                checked={eligibilityAnswers[test._id]?.[question._key] === false}
                                onChange={() => handleEligibilityAnswer(test._id, question._key, false)}
                                className="text-green-600 focus:ring-green-500"
                              />
                              <span className="text-green-700 font-medium">No</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`${test._id}_${question._key}`}
                                value="yes"
                                checked={eligibilityAnswers[test._id]?.[question._key] === true}
                                onChange={() => handleEligibilityAnswer(test._id, question._key, true)}
                                className="text-red-600 focus:ring-red-500"
                              />
                              <span className="text-red-700 font-medium">Yes</span>
                            </label>
                          </div>
                          
                          {eligibilityAnswers[test._id]?.[question._key] === true && question.warningMessage && (
                            <div className={`mt-2 p-3 rounded-lg ${
                              question.riskLevel === 'high' 
                                ? 'bg-red-50 border border-red-200 text-red-800'
                                : question.riskLevel === 'medium'
                                ? 'bg-orange-50 border border-orange-200 text-orange-800'
                                : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                            }`}>
                              <div className="flex items-start space-x-2">
                                {question.riskLevel === 'high' ? (
                                  <AlertTriangle className="flex-shrink-0 text-red-500 h-4 w-4 mt-0.5" />
                                ) : question.riskLevel === 'medium' ? (
                                  <AlertTriangle className="flex-shrink-0 text-orange-500 h-4 w-4 mt-0.5" />
                                ) : (
                                  <Info className="flex-shrink-0 text-blue-500 h-4 w-4 mt-0.5" />
                                )}
                                <p className="text-sm">{question.warningMessage}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
            
            {eligibilityWarnings.length > 0 && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h5 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Important Warnings:
                </h5>
                <ul className="text-sm text-red-700 space-y-1">
                  {eligibilityWarnings.map((warning, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-8 flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEligibilityModal(false)}
              >
                Review Answers
              </Button>
              <Button
                onClick={() => {
                  checkEligibility();
                  setShowEligibilityModal(false);
                }}
                disabled={!canProceed}
                className={!canProceed ? 'bg-red-500 hover:bg-red-600' : ''}
              >
                {canProceed ? 'Continue to Booking' : 'Cannot Proceed - High Risk'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Loading Overlay */}
      {(submitting || uploading) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md mx-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {submissionStep === 'uploading' && 'Uploading Document'}
              {submissionStep === 'scheduling' && 'Scheduling Appointment'}
              {submissionStep === 'complete' && 'Almost Done!'}
              {(submissionStep === 'idle' || !submissionStep) && uploading && 'Uploading Document'}
              {(submissionStep === 'idle' || !submissionStep) && !uploading && submitting && 'Processing Request'}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {submissionStep === 'uploading' && 'Please wait while we securely upload your doctor\'s request document...'}
              {submissionStep === 'scheduling' && 'Scheduling your lab appointment and sending confirmation emails...'}
              {submissionStep === 'complete' && 'Finalizing your appointment details...'}
              {(submissionStep === 'idle' || !submissionStep) && uploading && 'Uploading your document securely...'}
              {(submissionStep === 'idle' || !submissionStep) && !uploading && submitting && 'Processing your appointment request...'}
            </p>
            
            {/* Progress Steps */}
            <div className="flex justify-center items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                submissionStep === 'uploading' || submissionStep === 'scheduling' || submissionStep === 'complete' 
                  ? 'bg-primary' : 'bg-gray-300'
              }`}></div>
              <div className={`w-2 h-2 rounded-full ${
                submissionStep === 'scheduling' || submissionStep === 'complete' 
                  ? 'bg-primary' : 'bg-gray-300'
              }`}></div>
              <div className={`w-2 h-2 rounded-full ${
                submissionStep === 'complete' ? 'bg-primary' : 'bg-gray-300'
              }`}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {submissionStep === 'uploading' && 'Step 1 of 3'}
              {submissionStep === 'scheduling' && 'Step 2 of 3'}
              {submissionStep === 'complete' && 'Step 3 of 3'}
              {(submissionStep === 'idle' || !submissionStep) && 'Processing...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
