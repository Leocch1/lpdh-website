'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from './ui/button';
import { Logo } from './logo';
import { ScrollArea } from './ui/scroll-area';

const noticePages = [
    {
        content: `Thank you for choosing Las Pinas Doctors Hospital for your healthcare needs. This Privacy Notice outlines how we collect, use, disclose, and protect your personal information in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173) and its implementing rules and regulations.`
    },
    {
        title: "1. Information We Collect",
        content: `We may collect and process the following types of personal information for the purposes of providing our services:

• Contact Information: Name, address, phone number, email address.
• Health Information: Medical history, test results, treatment records.
• Financial Information: Billing details, insurance information (if applicable).
• Geolocation Data: Location for drive-thru services.
• Communication History: Correspondence related to appointments, inquiries, and follow-ups.`
    },
    {
        title: "2. How We Use Your Information",
        content: `We use your personal information for the following purposes:

• Provision of Healthcare Services: To administer COVID swab tests, laboratory services, and COVID home care.
• Administrative Purposes: Processing appointments, billing, and maintaining medical records.
• Communication: Sending appointment reminders, test results, and follow-up care instructions.
• Legal Compliance: Meeting regulatory requirements and maintaining accurate health records.`
    },
    {
        title: "3. Disclosure of Your Information",
        content: `We may share your personal information with the following parties:

• Medical Professionals: To ensure the delivery of accurate and appropriate healthcare services.
• Third-Party Service Providers: Including laboratories, payment processors, and IT services, as needed for our operations.
• Public Health Authorities: To comply with COVID-19 reporting requirements and other public health obligations.
• Legal Entities: When required by law or to protect our legal rights.`
    },
    {
        title: "4. Security Measures",
        content: `​We take reasonable measures to safeguard your personal information from unauthorized access, disclosure, alteration, or destruction.`
    },
    {
        title: "5. Your Rights",
        content: `Under the Data Privacy Act, you have the right to:

• Access your personal information.
• Correct inaccuracies.
• Object to processing.
• Withdraw consent.
• Be informed about data breaches.`
    },
    {
        title: "6. Cookies and Tracking Technologies",
        content: `We may use cookies and similar technologies to improve our website and services. You can adjust your browser settings to manage cookies.`
    },
    {
        title: "7. Changes to this Privacy Notice",
        content: `We reserve the right to update this Privacy Notice to reflect changes in our practices. Updates will be posted on our website.​`
    },
    {
        title: "8. Contact Us",
        content: `If you have questions about this Privacy Notice, how we handle your personal information, or wish to exercise your rights, please contact our Data Protection Officer at:

        (02) 8825-5236`
    }
];

export function PrivacyNotice() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // Only show the privacy notice if it hasn't been shown in this session
    const hasSeenNotice = sessionStorage?.getItem('hasSeenPrivacyNotice');
    if (!hasSeenNotice) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    setIsOpen(false);
    // Mark that the user has seen the notice in this session
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('hasSeenPrivacyNotice', 'true');
    }
  };
  
  const handleNext = () => {
    if(currentPage < noticePages.length - 1) {
        setCurrentPage(currentPage + 1);
    }
  };

  const isLastPage = currentPage === noticePages.length - 1;

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Custom backdrop with blur */}
      {isOpen && (
        <div className="fixed inset-0 z-40 backdrop-blur-md bg-black/10" />
      )}
      
      <Dialog open={isOpen}>
        <DialogContent 
          className="max-w-xl w-[95vw] max-h-[90vh] p-0 border-0 shadow-none z-50 [&>button]:hidden" 
          onPointerDownOutside={(e) => e.preventDefault()} 
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
        {/* Main white container */}
        <div className="relative bg-white rounded-md md:rounded-lg border border-gray-200 shadow-[0_25px_45px_rgba(0,0,0,0.15)] overflow-hidden">
          
          {/* Header */}
          <DialogHeader className="p-4 md:p-8 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-3 md:gap-4">
              <Logo />
              <DialogTitle className="text-xl md:text-3xl font-bold text-gray-800">
                LPDH Privacy Notice
              </DialogTitle>
            </div>
          </DialogHeader>
          
          {/* Content area */}
          <div className="px-4 md:px-8 py-4 md:py-6 bg-white">
            <ScrollArea className="h-60 md:h-80 pr-2 md:pr-4">
              <div className="space-y-4 md:space-y-6">
                <h3 className="font-bold text-lg md:text-xl text-gray-800">
                  {noticePages[currentPage].title}
                </h3>
                <div className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-line">
                  {noticePages[currentPage].content}
                </div>
              </div>
            </ScrollArea>
          </div>
          
          {/* Next button */}
          {!isLastPage && (
            <div className="px-4 md:px-8 pb-4 md:pb-6 bg-white border-b border-gray-200">
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  onClick={handleNext} 
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-transparent font-semibold px-4 md:px-6 py-2 rounded-full transition-colors duration-300 text-sm md:text-base"
                >
                  Next →
                </Button>
              </div>
            </div>
          )}
          
          {/* Footer */}
          <DialogFooter className="bg-gray-50 p-4 md:p-8 border-t border-gray-200">
            <Button 
              onClick={handleAccept} 
              disabled={!isLastPage} 
              className={`w-full py-3 md:py-4 rounded-md md:rounded-lg font-bold text-sm md:text-lg transition-all duration-300 shadow-lg ${
                isLastPage 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white hover:shadow-xl hover:scale-[1.02] shadow-emerald-500/25' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              I AGREE
            </Button>
          </DialogFooter>
          
          {/* End of dialog content */}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}