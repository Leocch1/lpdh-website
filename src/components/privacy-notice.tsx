
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
        title: "Introduction",
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
    },
    {
        title: "1. Information We Collect",
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
    },
    {
        title: "2. How We Use Your Information",
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
    }
]

export function PrivacyNotice() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // Only show the privacy notice if it hasn't been shown in this session
    const hasSeenNotice = sessionStorage.getItem('hasSeenPrivacyNotice');
    if (!hasSeenNotice) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    setIsOpen(false);
    // Mark that the user has seen the notice in this session
    sessionStorage.setItem('hasSeenPrivacyNotice', 'true');
  };
  
  const handleNext = () => {
    if(currentPage < noticePages.length -1) {
        setCurrentPage(currentPage + 1);
    }
  }

  const isLastPage = currentPage === noticePages.length - 1;

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl p-0 bg-white/90 backdrop-blur-md border border-white/20 shadow-2xl" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        {/* Glass container wrapper */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-white/30 shadow-lg m-4">
          <DialogHeader className="p-6 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 rounded-t-lg">
              <div className="flex items-center gap-4">
                   <Logo />
                   <DialogTitle className="text-2xl font-bold text-foreground">LPDH Privacy Notice</DialogTitle>
              </div>
          </DialogHeader>
          <div className="px-6 py-4 space-y-4 bg-white/60 backdrop-blur-sm">
              <ScrollArea className="h-64 pr-4">
                  <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-gray-800">{noticePages[currentPage].title}</h3>
                      <p className="text-gray-600 leading-relaxed">{noticePages[currentPage].content}</p>
                  </div>
              </ScrollArea>
              <div className="flex justify-end">
                  {!isLastPage && <Button variant="link" onClick={handleNext} className="text-emerald-600 hover:text-emerald-700">Next</Button>}
              </div>
          </div>
          <DialogFooter className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm p-6 rounded-b-lg border-t border-white/20">
            <Button onClick={handleAccept} disabled={!isLastPage} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200">
              I HAVE READ AND UNDERSTAND
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
