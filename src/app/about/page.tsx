
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const missionPoints = [
  "Deliver the best cost-effective and sustainable health care for the customers using state-of-the-art equipment and facilities.",
  "Respond of continuing health problems and changing priorities of the times.",
  "Deliver globally-competitive health service with compassion.",
  "Advocate highest standards of ethics in medical and nursing services.",
  "Offer opportunity for staff development through continuing education programs.",
  "Provide a safe and healthy environment for all stakeholders of the facility."
];

const coreValues = [
  { letter: "L", value: "Loyalty" },
  { letter: "P", value: "Passion" },
  { letter: "D", value: "Discipline" },
  { letter: "H", value: "Honesty" },
  { letter: "C", value: "Caring" },
  { letter: "O", value: "Outstanding" },
  { letter: "R", value: "Responsive" },
  { letter: "E", value: "Efficient" },
];

const updates = [
  {
    title: "MBD June 2025",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "",
    dataAiHint: "people meeting",
    link: "#",
  },
  {
    title: "MBD June 2025",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "",
    dataAiHint: "people meeting",
    link: "#",
  },
  {
    title: "MBD June 2025",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "",
    dataAiHint: "people meeting",
    link: "#",
  },
];

const healthAdvisories = [
    {
        title: "Motherhood Begins! Maternity Packages",
        image: "",
        dataAiHint: "mother child",
        link: "#",
    },
    {
        title: "Signs and Symptoms of Leptospirosis",
        image: "",
        dataAiHint: "health advisory",
        link: "#",
    }
]


export default function AboutPage() {
  return (
    <div className="flex flex-col text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl"> 
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-8 md:gap-12 md:grid-cols-2 max-w-5xl mx-auto">
            <div className="text-center md:text-left">
              <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-primary">
                Las Pinas Doctors Hospital
              </h2>
              <p className="mt-4 font-semibold text-foreground">A Premier Customer-Friendly Level III Hospital Providing Quality Health Care Services</p>
              <p className="mt-4 text-muted-foreground">
                LPDH is an organization that is committed to continually improve for the benefit of its patients, as well as, its employees and Core Group members. In addition, it showcases its dedication in enhancing customer satisfaction whether thru its various services or its products. Furthermore, this brings LPDH at the forefront of healthcare organizations in the country for its efforts in prioritizing its sustainability by raising its efficiency, reducing waste and being cost-efficient.
              </p>
            </div>
            <div className="flex justify-center">
              <Image
                src="/lpdh.jpg"
                alt="Las Pinas Doctors Hospital Building"
                data-ai-hint="hospital building exterior"
                width={600}
                height={400}
                className="rounded-lg shadow-xl w-full h-auto max-w-[500px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 max-w-5xl mx-auto">
            <div className="space-y-8">
              <h3 className="font-headline text-3xl font-bold text-primary text-center md:text-left">Mission</h3>
              <ul className="space-y-4 text-left">
                {missionPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-12">
              <div>
                <h3 className="font-headline text-3xl font-bold text-primary mb-4 text-center md:text-left">Vision</h3>
                <p className="text-muted-foreground text-left">By 2030, LPDH is envisioned to be a premiere patient-friendly tertiary hospital with cost-effective medical services anchored on highest medical and ethical standards utilizing state-of-the-art equipment and facilities.</p>
              </div>
              <div>
                <h3 className="font-headline text-3xl font-bold text-primary mb-6 text-center md:text-left">Core Values</h3>
                <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:gap-x-8">
                  {coreValues.map(item => (
                    <div key={item.value} className="flex items-center">
                      <span className="font-bold text-primary mr-2 text-lg">{item.letter}</span>
                      <span className="text-muted-foreground">- {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-12 md:grid-cols-2 max-w-5xl mx-auto">
            <div className="flex justify-center order-2 md:order-1">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1365.9538245878366!2d120.99304411579483!3d14.455905607615515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397ce0f2edbcfe3%3A0x9c937ce6d1bcb34b!2sLas%20Pi%C3%B1as%20Doctors%20Hospital!5e0!3m2!1sen!2sph!4v1753490446530!5m2!1sen!2sph"
                className="w-full max-w-[600px] h-[300px] md:h-[400px] border-0 rounded-lg shadow-lg"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="text-center md:text-left order-1 md:order-2">
              <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-primary">
                Find Us Here
              </h2>
              <p className="text-lg text-muted-foreground">
                #8009 CAA Road, Pulonglupa II, Las Pinas City, Metro Manila, Philippines, 1742
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-4 md:py-8">
      <div className="container flex justify-center items-center w-full max-w-[1400px] px-4 mx-auto">
        <div className="overflow-x-auto">
          <div className="flex gap-8 md:gap-12 w-full">
            {updates.map((update, index) => (
              <Card
                key={index}
                className="min-w-[300px] sm:min-w-[350px] md:min-w-[100px] w-[250px] h-[555px]  overflow-hidden bg-white shadow-lg rounded-lg"
              >
                <div className="relative">
                  <Image
                    src={update.image}
                    alt={update.title}
                    data-ai-hint={update.dataAiHint}
                    width={400}
                    height={200}
                    
                  />
                </div>
                <CardHeader>
                  <CardTitle >{update.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm md:text-base text-muted-foreground">{update.description}</p>
                </CardContent>
                <CardFooter className="bg-white pt-4">
                  <Button
                    asChild
                    variant="link"
                    className="px-0 text-primary hover:text-primary/80 text-sm md:text-base "
                  >
                    <Link href={update.link}>
                      View
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>


       <section className="py-12 md:py-16">
        <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
                 {healthAdvisories.map((advisory, index) => (
                    <div key={index} className="flex justify-center">
                        <Image
                            src={advisory.image}
                            alt={advisory.title}
                            data-ai-hint={advisory.dataAiHint}
                            width={500}
                            height={700}
                            className="rounded-lg shadow-lg object-contain"
                        />
                    </div>
                ))}
            </div>
        </div>
      </section>
      
    </div>
  );
}
