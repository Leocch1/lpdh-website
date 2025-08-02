// components/ServiceCard.tsx
'use client';
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface ServiceCardProps {
  service: {
    title: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    subtitle?: string;
    details: string[];
  };
  isOpen: boolean;
  onToggle: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, isOpen, onToggle }) => {
  const IconComponent = service.icon;

  return (
    // The main container for the card remains as your original, without the Uiverse.io outer effects
    <div
      className={`relative w-full bg-white rounded-lg shadow-md border border-gray-100 transition-all duration-300
                   ${isOpen ? 'z-20 scale-100' : 'z-10 hover:shadow-lg hover:border-[#169a53]/50'}
                 `}
    >
      {/* Clickable header/trigger area for the card - THIS IS WHERE THE NEW DESIGN APPLIES */}
      <button
        onClick={onToggle}
        // Uiverse.io button styles applied here, adapted to your palette
        className={`group relative w-full p-4 text-left rounded-lg focus:outline-none focus:ring-2 focus:ring-[#169a53] focus:ring-inset
                    backdrop-blur-xl border-2 border-[#169a53]/30 bg-white shadow-xl
                    hover:shadow-[#169a53]/30 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 active:scale-95
                    transition-all duration-500 ease-out cursor-pointer hover:border-[#73bd92]/60 overflow-hidden
                    ${isOpen ? 'border-[#169a53]/60' : 'border-[#c2d7c9]'}
                   `}
      >
        {/* Absolute div for the gradient hover effect across the button */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#73bd92]/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
        ></div>

        {/* Absolute div for the subtle background glow on hover */}
        <div
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#169a53]/10 via-[#73bd92]/20 to-[#169a53]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        ></div>

        {/* Original button content, ensure it stays on top of the new hover effects */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <div className="flex-shrink-0">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 backdrop-blur-sm
                            ${isOpen
                                ? 'bg-[#169a53] text-white'
                                : 'bg-[#c2d7c9] text-[#169a53] group-hover:bg-[#73bd92]/40 group-hover:text-white'
                            }`}
              >
                <IconComponent className="h-6 w-6 group-hover:scale-110 drop-shadow-lg transition-all duration-300" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h3
                className={`text-lg font-semibold transition-colors duration-300 drop-shadow-sm
                            ${isOpen
                                ? 'text-[#169a53]'
                                : 'text-foreground group-hover:text-[#169a53]'
                            }`}
              >
                {service.title}
              </h3>
              <p
                className={`text-sm mt-1 truncate transition-colors duration-300
                            ${isOpen
                                ? 'text-muted-foreground'
                                : 'text-muted-foreground group-hover:text-[#73bd92]/80'
                            }`}
              >
                {service.subtitle || "Professional healthcare services"}
              </p>
            </div>
          </div>
          <div
            className={`flex-shrink-0 ml-4 transition-all duration-300
                        ${isOpen ? 'opacity-100' : 'opacity-40 group-hover:opacity-100 group-hover:translate-x-1'}`}
          >
            {isOpen ? (
              <Minus className="h-5 w-5 text-[#169a53] transition-colors duration-200" />
            ) : (
              <Plus className="h-5 w-5 text-muted-foreground group-hover:text-[#169a53] transition-colors duration-200" />
            )}
          </div>
        </div>
      </button>

      {/* Expanded Content - This remains exactly as your original dropdown content */}
      <div
        className={`absolute left-0 w-full bg-white p-4 pt-0 shadow-xl rounded-b-lg border-t-0 border border-gray-100 z-20
                    transition-all duration-300 ease-in-out overflow-hidden
                    ${isOpen ? 'visible max-h-[300px] opacity-100 top-[calc(100% - 1px)]' : 'invisible max-h-0 opacity-0 top-[100%]'}
                    `}
      >
        <div className="border-l-4  border-[#169a53]/30 pl-4 mt-2">
          {service.details.map((detail: string, index: number) => (
            <p key={index} className="text-muted-foreground leading-relaxed mb-2 last:mb-0 text-sm">
              {detail}
            </p>
          ))}
        </div>
        {/* <div className="mt-4">
          <Button onClick={onToggle} variant="ghost" className="w-full bg-[#169a53] text-white hover:bg-[#73bd92]">
            Close
          </Button>
        </div> */}
      </div>
    </div>
  );
};