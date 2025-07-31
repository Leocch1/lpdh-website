
import Image from "next/image";

export default function AdmissionPage() {
  const guidelines = [
    "No visitors allowed",
    "One (1) watcher or companion per patient",
    "A special pass provided by Admitting Department must be with the watcher at all times",
    "The special pass must be surrendered upon exit",
    "No watcher will be allowed to go up without the special pass. In case of loss - charge of Php 500.00",
    "Watcher is not allowed to roam around the hospital",
  ];

  return (
    <div className="bg-background text-foreground">
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="text-primary">Las Piñas Doctors Hospital</span>
            <br />
            Direct Admission
          </h1>
        </div>
      </section>

      <section className="pb-12 md:pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-left space-y-6 text-muted-foreground">
            <p>
              Admission procedure requires the patient, patient's relative or authorized representative fill-out patient data sheet where admitting staff will also be informed of his/her HMO, Health Insurance or if transaction will be cash basis.
            </p>
            <p>
              We are committed to the health and safety of our patients, health providers, employees and doctors. In line of the Covid-19, we are taking extra precautions to reduce the risk of the disease. Therefore, the following must be strictly followed:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              {guidelines.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      
      <section className="py-12 md:py-20 bg-secondary">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-8">Covid Guidelines</h2>
          </div>
          <div className="text-left space-y-6 text-muted-foreground">
            <p>
              Admission procedure requires the patient, patient's relative or authorized representative fill-out patient data sheet where admitting staff will also be informed of his/her HMO, Health Insurance or if transaction will be cash basis.
            </p>
            <p>
              We are committed to the health and safety of our patients, health providers, employees and doctors. In line of the Covid-19, we are taking extra precautions to reduce the risk of the disease. Therefore, the following must be strictly followed:
            </p>
            <ul className="list-disc pl-6 space-y-2">
                {guidelines.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">Data Privacy and Patient's Rights</h2>
            <h3 className="text-2xl md:text-3xl font-extrabold text-foreground mb-8">Data Privacy</h3>
            <p className="text-muted-foreground text-left">
                Las Piñas Doctors Hospital is committed to the protection of the privacy of the patient's personal data in compliance with the Republic Act No. 10173 or the Data Privacy Act of 2012. The hospital guarantees that all data collected will be managed with safety and confidentiality.
            </p>
        </div>
      </section>
      
      <section className="py-12 md:py-20 bg-secondary">
        <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="flex flex-col items-center gap-6">
                <Image 
                    src="/philhealth-logo.png"
                    alt="PhilHealth Logo"
                    data-ai-hint="company logo"
                    width={300}
                    height={150}
                />
                <p className="text-muted-foreground text-center max-w-2xl">
                    Las Piñas Doctors Hospital is PhilHealth Accredited. All PhilHealth members or their representatives are encouraged to consult at our Billing Department to accommodate queries, for assessment of eligibility and other related concerns.
                </p>
            </div>
        </div>
      </section>

    </div>
  );
}
