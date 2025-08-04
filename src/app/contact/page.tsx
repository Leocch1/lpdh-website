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
            <Card className="overflow-hidden shadow-lg">
              <div className="grid md:grid-cols-3">
                <div className="relative w-80 h-64 md:h-auto md:col-span-1">
                  <Image
                    src="/contact.jpg"
                    alt="Contact background"
                    data-ai-hint="office interior"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 md:p-12 md:col-span-2">
                  <h2 className="font-headline text-3xl font-bold text-primary">
                    Send Us A Message
                  </h2>

                  {/* Replaces the paragraph with dropdown */}
                  <div className="mt-4">
                    <Label htmlFor="message-type" className="sr-only">Message Type</Label>
                    <Select defaultValue="inquiry" name="message-type">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select message type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inquiry">Inquiry</SelectItem>
                        <SelectItem value="complaint">Complaint</SelectItem>
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
                      <Button type="submit">Submit</Button>
                    </div>
                  </form>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
