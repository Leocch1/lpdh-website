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

const noticePages = [
    {
        content: `Thank you for choosing Las Pinas Doctors Hospital for your healthcare needs. This Privacy Notice outlines how we collect, use, disclose, and protect your personal information in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173).

1. INFORMATION WE COLLECT
• Contact Information: Name, address, phone number, email address
• Health Information: Medical history, test results, treatment records
• Financial Information: Billing details, insurance information
• Communication History: Correspondence related to appointments and inquiries

2. HOW WE USE YOUR INFORMATION
• Provision of Healthcare Services: To administer medical tests, laboratory services, and patient care
• Administrative Purposes: Processing appointments, billing, and maintaining medical records
• Communication: Sending appointment reminders, test results, and follow-up care instructions
• Legal Compliance: Meeting regulatory requirements and maintaining accurate health records`
    },
    {
        content: `3. DISCLOSURE OF YOUR INFORMATION
We may share your personal information with:
• Medical Professionals: To ensure delivery of accurate healthcare services
• Third-Party Service Providers: Including laboratories, payment processors, and IT services
• Public Health Authorities: To comply with reporting requirements and public health obligations
• Legal Entities: When required by law or to protect our legal rights

4. SECURITY MEASURES
We take reasonable measures to safeguard your personal information from unauthorized access, disclosure, alteration, or destruction through appropriate technical and organizational safeguards.

5. YOUR RIGHTS
Under the Data Privacy Act, you have the right to:
• Access your personal information
• Correct inaccuracies in your data
• Object to processing of your information
• Withdraw consent where applicable
• Be informed about data breaches that may affect you`
    },
    {
        content: `6. COOKIES AND TRACKING TECHNOLOGIES
We may use cookies and similar technologies to improve our website and services. You can adjust your browser settings to manage cookies according to your preferences.

7. CHANGES TO THIS PRIVACY NOTICE
We reserve the right to update this Privacy Notice to reflect changes in our practices. Updates will be posted on our website and you will be notified of significant changes.

8. CONTACT US
If you have questions about this Privacy Notice, how we handle your personal information, or wish to exercise your rights, please contact our Data Protection Officer at:

Phone: (02) 8825-5236
Address: #8009 CAA Road, Pulonglupa II, Las Pinas City, Metro Manila, Philippines

By continuing to use our services, you acknowledge that you have read and understood this Privacy Notice.`
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
          className="max-w-7xl w-[94vw] md:w-[98vw] max-h-[90vh] md:max-h-[85vh] p-0 border-0 shadow-none z-50 [&>button]:hidden flex items-center justify-center" 
          onPointerDownOutside={(e) => e.preventDefault()} 
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
        {/* Main white container */}
        <div className="relative bg-white rounded-md md:rounded-lg border border-gray-200 shadow-[0_25px_45px_rgba(0,0,0,0.15)] overflow-hidden">
          
          {/* Header */}
          <DialogHeader className="p-4 md:p-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-3 md:gap-4">
              <Logo />
              <DialogTitle className="text-xl md:text-2xl font-bold text-gray-800">
                Privacy Notice
              </DialogTitle>
            </div>
          </DialogHeader>
          
          {/* Content area - Fixed height, no scroll */}
          <div className="px-10 md:px-12 py-4 md:py-6 bg-white h-[400px] md:h-[450px] overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="text-gray-700 leading-snug text-[10px] md:text-xs whitespace-pre-line flex-1 overflow-hidden prose prose-xs max-w-none prose-strong:text-gray-900 prose-strong:font-bold">
                {noticePages[currentPage].content}
              </div>
            </div>
          </div>
          
          {/* Page indicator */}
          <div className="px-10 md:px-12 py-2 bg-white border-b border-gray-200">
            <div className="relative flex justify-center items-center">
              <div className="flex items-center gap-2">
                {noticePages.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentPage ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="absolute right-0 text-xs text-gray-500">
                {currentPage + 1} of {noticePages.length}
              </span>
            </div>
          </div>
          
          {/* Footer */}
          <DialogFooter className="bg-gray-50 p-4 md:p-6 border-t border-gray-200">
            <div className="flex gap-3 w-full">
              {!isLastPage && (
                <Button 
                  onClick={handleNext} 
                  variant="outline"
                  className="flex-1 py-3 md:py-4 rounded-md md:rounded-lg font-semibold text-sm md:text-base transition-all duration-300"
                >
                  Next →
                </Button>
              )}
              <Button 
                onClick={handleAccept} 
                disabled={!isLastPage} 
                className={`${isLastPage ? 'w-full' : 'flex-1'} py-3 md:py-4 rounded-md md:rounded-lg font-bold text-sm md:text-base transition-all duration-300 shadow-lg ${
                  isLastPage 
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white hover:shadow-xl hover:scale-[1.02] shadow-emerald-500/25' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLastPage ? 'I AGREE' : 'I AGREE'}
              </Button>
            </div>
          </DialogFooter>
          
          {/* End of dialog content */}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}