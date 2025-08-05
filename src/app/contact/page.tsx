import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Image from "next/image";

export default function ContactPage() {
  return (
    <div className="flex flex-col">
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
                
                {/* Form Section - Red Background */}
                <div className="col-span-1 md:col-span-3 p-8 md:p-12 flex flex-col justify-center">
                  <h2 className="font-headline text-3xl text-primary">
                    Send Us A Message
                  </h2>

                  {/* Message Type Dropdown */}
                  <div className="mt-4">
                    <Label htmlFor="message-type" className="sr-only">Message Type</Label>
                    <Select defaultValue="inquiry" name="message-type">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select message type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inquiry">General Inquiry</SelectItem>
                        <SelectItem value="complaint">Submit a Complaint</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <form className="mt-8 space-y-6">
                    <div>
                      <Label htmlFor="name" className="sr-only">Full Name</Label>
                      <Input id="name" placeholder="Full Name" />
                    </div>
                    <div>
                      <Label htmlFor="email-contact" className="sr-only">Email Address</Label>
                      <Input id="email-contact" type="email" placeholder="Email Address" />
                    </div>
                    <div>
                      <Label htmlFor="subject" className="sr-only">Subject</Label>
                      <Input id="subject" placeholder="Subject" />
                    </div>
                    <div>
                      <Label htmlFor="message" className="sr-only">Message</Label>
                      <Textarea id="message" placeholder="Message" rows={5} />
                    </div>
                    <div className="flex justify-start">
                      <Button type="submit" className="bg-green-600 hover:bg-green-700 [box-shadow:0_3px_5px_rgba(0,0,0,0.2)] hover:[box-shadow:0_6px_6px_rgba(0,0,0,0.15)]">Submit</Button>
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