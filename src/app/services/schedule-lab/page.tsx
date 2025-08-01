'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, Phone, MapPin, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const labTests = [
  {
    category: "Blood Tests",
    tests: [
      { name: "Complete Blood Count (CBC)", duration: "2-4 hours" },
      { name: "Blood Chemistry Panel", duration: "4-6 hours" },
      { name: "Lipid Profile", duration: "2-4 hours" },
      { name: "Thyroid Function Test", duration: "1-2 days" },
      { name: "Liver Function Test", duration: "4-6 hours" }
    ]
  },
  {
    category: "Urine Tests",
    tests: [
      { name: "Urinalysis", duration: "1-2 hours" },
      { name: "Urine Culture", duration: "2-3 days" },
      { name: "24-Hour Urine Collection", duration: "1-2 days" }
    ]
  },
  {
    category: "Imaging",
    tests: [
      { name: "X-Ray", duration: "30 minutes" },
      { name: "Ultrasound", duration: "1-2 hours" },
      { name: "CT Scan", duration: "2-4 hours" },
      { name: "MRI", duration: "1-2 days" }
    ]
  },
  {
    category: "Special Tests",
    tests: [
      { name: "ECG/EKG", duration: "30 minutes" },
      { name: "Stress Test", duration: "2-3 hours" },
      { name: "Endoscopy", duration: "Same day" },
      { name: "Colonoscopy", duration: "Same day" }
    ]
  }
];

const timeSlots = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
];

export default function ScheduleLabPage() {
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    notes: ""
  });

  const handleTestSelection = (testName: string) => {
    setSelectedTests(prev => 
      prev.includes(testName) 
        ? prev.filter(test => test !== testName)
        : [...prev, testName]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Lab appointment request submitted! We will contact you shortly to confirm.');
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
        <Image
          src="/contact.jpg"
          alt="Laboratory services"
          data-ai-hint="medical laboratory"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Schedule Lab Work
          </h1>
          <p className="mt-4 text-lg max-w-3xl lg:text-xl">
            Book your laboratory tests and imaging services with our experienced technicians
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
                <h2 className="text-2xl font-bold text-foreground mb-6 lg:text-3xl">Select Lab Tests</h2>
                
                {labTests.map((category) => (
                  <Card key={category.category} className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg lg:text-xl">{category.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 lg:space-y-4">
                        {category.tests.map((test) => (
                          <div 
                            key={test.name}
                            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                              selectedTests.includes(test.name) 
                                ? 'border-primary bg-primary/5 scale-[1.02]' 
                                : 'border-border hover:border-primary/50 hover:scale-[1.01]'
                            }`}
                            onClick={() => handleTestSelection(test.name)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <CheckCircle 
                                    className={`h-5 w-5 lg:h-6 lg:w-6 ${
                                      selectedTests.includes(test.name) 
                                        ? 'text-primary' 
                                        : 'text-muted-foreground'
                                    }`}
                                  />
                                  <h4 className="font-medium">{test.name}</h4>
                                </div>
                                <div className="flex gap-4 mt-2 ml-7">
                                  <Badge variant="outline">{test.duration}</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="date">Preferred Date</Label>
                      <Input
                        id="date"
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="time">Preferred Time</Label>
                      <Select value={formData.time} onValueChange={(value) => setFormData({...formData, time: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      disabled={selectedTests.length === 0}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Appointment
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>(02) 8825-5236</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>#8009 CAA Road, Pulanglupa II, Las Pinas City</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Mon-Sat: 8:00 AM - 5:00 PM</span>
                  </div>
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
            Important Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <FileText className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Preparation Instructions</h3>
              <p className="text-sm text-muted-foreground">
                Some tests require fasting or special preparation. We'll provide detailed instructions after booking.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Results Timeline</h3>
              <p className="text-sm text-muted-foreground">
                Most results are available within 24-48 hours. Complex tests may take longer.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Quality Assurance</h3>
              <p className="text-sm text-muted-foreground">
                All tests are performed using state-of-the-art equipment by certified technicians.
              </p>
            </div>
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
