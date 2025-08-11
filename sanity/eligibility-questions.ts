// MRI Eligibility Questions Template
// These questions should be added to MRI tests in Sanity Studio

export const mriEligibilityQuestions = [
  {
    question: "Do you have any metal implants, pacemaker, or cochlear implants in your body?",
    riskLevel: "high",
    warningMessage: "Metal implants and pacemakers can be dangerous during MRI. Please consult with your doctor immediately before proceeding."
  },
  {
    question: "Do you have any metal fragments in your eyes or body from previous injuries?",
    riskLevel: "high", 
    warningMessage: "Metal fragments can move or heat up during MRI and cause serious injury. Medical clearance is required."
  },
  {
    question: "Are you pregnant or might you be pregnant?",
    riskLevel: "medium",
    warningMessage: "MRI during pregnancy requires special consideration and doctor approval, especially in the first trimester."
  },
  {
    question: "Do you have any tattoos or permanent makeup?",
    riskLevel: "low",
    warningMessage: "   "
  },
  {
    question: "Do you have claustrophobia or anxiety in enclosed spaces?",
    riskLevel: "medium",
    warningMessage: "Please discuss with your doctor about anxiety management options or open MRI alternatives."
  },
  {
    question: "Do you weigh more than 250 lbs (113 kg)?",
    riskLevel: "medium",
    warningMessage: "Weight limits vary by MRI machine. Please confirm equipment availability when scheduling."
  }
];

export const ctScanEligibilityQuestions = [
  {
    question: "Are you allergic to iodine or contrast dye?",
    riskLevel: "high",
    warningMessage: "Contrast allergies can cause severe reactions. Alternative imaging or premedication may be required."
  },
  {
    question: "Do you have kidney problems or diabetes?",
    riskLevel: "medium", 
    warningMessage: "Kidney function tests may be required before contrast administration."
  },
  {
    question: "Are you pregnant or might you be pregnant?",
    riskLevel: "high",
    warningMessage: "CT scans involve radiation exposure. Pregnancy must be ruled out before proceeding."
  }
];

export const generalLabEligibilityQuestions = [
  {
    question: "Are you currently taking blood-thinning medications?",
    riskLevel: "medium",
    warningMessage: "Please inform the medical team about blood-thinning medications for proper procedure planning."
  },
  {
    question: "Do you have a bleeding disorder?",
    riskLevel: "medium",
    warningMessage: "Bleeding disorders may require special precautions during blood draw or biopsy procedures."
  }
];
