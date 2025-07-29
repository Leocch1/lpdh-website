
export type JobOpening = {
  title: string;
  slug: string;
  department: string;
  type: string;
  summary: string;
  duties: string[];
  qualifications: string[];
};

export const jobOpenings: JobOpening[] = [
  {
    title: "Registered Nurse (ICU)",
    slug: "registered-nurse-icu",
    department: "Intensive Care Unit",
    type: "Full-time",
    summary: "Provide critical care to patients in the ICU. Requires at least 2 years of experience in a hospital setting.",
    duties: [
      "Assess patient condition and plan and implement patient care plans.",
      "Treat wounds and provide advanced life support.",
      "Assist physicians in performing procedures.",
      "Observe and record patient vital signs.",
      "Ensure that ventilators, monitors and other types of medical equipment function properly.",
    ],
    qualifications: [
      "Bachelor of Science in Nursing (BSN) degree.",
      "Valid and current Registered Nurse (RN) license.",
      "Minimum of 2 years of ICU experience.",
      "Advanced Cardiac Life Support (ACLS) certification.",
      "Strong critical thinking and communication skills.",
    ],
  },
  {
    title: "I.T. Assistant",
    slug: "it-assistant",
    department: "Information Technology",
    type: "Full-time",
    summary: "The IT Assistant is responsible for providing technical support, assisting in the maintenance of hardware and software systems, and ensuring the smooth operation of the hospital's IT infrastructure. This role includes support for system users, network troubleshooting, website updates, and documentation. The IT Assistant directly reports to the IT Supervisor.",
    duties: [
      "Provide technical assistance and support for incoming queries and issues related to computer systems, software, and hardware.",
      "Troubleshoot and resolve network, internet, and system issues promptly.",
      "Assist in maintaining and updating the hospital website and internal systems.",
      "Install, configure, and update software and applications as needed.",
      "Assist in maintaining an inventory of hardware, software licenses, and IT supplies.",
      "Support data backup and recovery procedures.",
      "Monitor the performance of computer systems and report issues to the IT Supervisor.",
      "Participate in IT-related projects such as system upgrades, website development, and database updates.",
      "Maintain documentation and records of repairs, system updates, and technical procedures.",
      "Assist IT Supervisor in preparing technical reports and system assessments.",
    ],
    qualifications: [
      "Candidate must be currently enrolled in or a graduate of a Bachelor's/College Degree in Information Technology, Computer Science, or related field.",
      "Minimum of 1-year related work experience or OJT/internship in an IT-related role.",
      "Basic knowledge in troubleshooting hardware and software issues.",
      "Familiar with website content management, networking, and basic database handling.",
      "Strong problem-solving skills and attention to detail.",
      "Willing to learn and work under supervision in a fast-paced environment.",
    ],
  },
  {
    title: "Pharmacist",
    slug: "pharmacist",
    department: "Pharmacy",
    type: "Full-time",
    summary: "Dispense prescription medications to patients and offer expertise in the safe use of prescriptions.",
    duties: [
        "Compound and dispense medications as prescribed by doctors.",
        "Review prescriptions for accuracy and to ensure there are no interactions.",
        "Counsel patients on the effects, dosage, and side effects of their medication.",
        "Maintain patient profiles, and charge and bill patients.",
        "Order and maintain inventory of drugs and other pharmaceutical supplies."
    ],
    qualifications: [
      "Doctor of Pharmacy (Pharm.D.) degree.",
      "Valid pharmacist license in the Philippines.",
      "Proven experience as a pharmacist.",
      "Thorough understanding of dosage administration and measurement.",
      "Excellent communication skills."
    ],
  },
];
