"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { CheckCircle, X } from "lucide-react";
import Image from "next/image";

// Modal component for "Message Sent" confirmation
const MessageSentModal = ({ isOpen, onOpenChange }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-6 text-center">
        <div className="relative">
          <DialogClose className="absolute -right-6 -top-6 z-20 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-md">
            <X className="h-5 w-5 text-gray-500" />
          </DialogClose>
          <div className="flex flex-col items-center p-4">
            <CheckCircle className="h-10 w-10 mb-4 text-green-500" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h3>
            <p className="text-sm text-slate-600 mb-6">
              Thank you for reaching out to us. We will get back to you shortly.
            </p>
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full py-3 px-4 rounded-lg font-bold text-white transition-colors text-lg bg-green-500 hover:bg-green-600"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    messageType: "inquiry",
    name: "",
    "email-contact": "",
    subject: "",
    message: "",
  });
  const [isMessageSentModalOpen, setIsMessageSentModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes for text inputs
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle value change for the Select component
  const handleSelectChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      messageType: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Log the form data to the console
    console.log("Form submitted with data:", formData);

    // Reset the form fields
    setFormData({
      messageType: "inquiry",
      name: "",
      "email-contact": "",
      subject: "",
      message: "",
    });

    setIsSubmitting(false);
    setIsMessageSentModalOpen(true);
  };

  return (
    <div className="flex flex-col">
      <MessageSentModal
        isOpen={isMessageSentModalOpen}
        onOpenChange={setIsMessageSentModalOpen}
      />
      <section className="py-12 md:py-12 mx-auto px-4">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="overflow-hidden shadow-lg rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-5 min-h-[600px] bg-card">
                {/* Photo Section - Full Height */}
                <div className="relative w-80 h-64 md:h-auto md:col-span-2">
                  <Image
                    src="/contact.jpg"
                    alt="Contact background"
                    data-ai-hint="office interior"
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Form Section */}
                <div className="col-span-1 md:col-span-3 p-8 md:p-12 flex flex-col justify-center">
                  <h2 className="font-headline text-3xl text-primary">
                    Send Us A Message
                  </h2>

                  {/* Message Type Dropdown */}
                  <div className="mt-4">
                    <Label htmlFor="message-type" className="sr-only">Message Type</Label>
                    <Select
                      value={formData.messageType}
                      onValueChange={handleSelectChange}
                      name="message-type"
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select message type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inquiry">General Inquiry</SelectItem>
                        <SelectItem value="complaint">Submit a Complaint</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                      <Label htmlFor="name" className="sr-only">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email-contact" className="sr-only">Email Address</Label>
                      <Input
                        id="email-contact"
                        type="email"
                        placeholder="Email Address"
                        value={formData["email-contact"]}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject" className="sr-only">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="message" className="sr-only">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Message"
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex justify-start">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700 [box-shadow:0_3px_5px_rgba(0,0,0,0.2)] hover:[box-shadow:0_6px_6px_rgba(0,0,0,0.15)]"
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}