'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-primary">
            Privacy Policy
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="px-6 py-4 max-h-[60vh]">
          <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Information We Collect</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tempor, nulla vel cursus sodales, ipsum nunc ullamcorper nulla, at tincidunt lorem magna vel urna. Sed vehicula consectetur libero, at volutpat magna fermentum quis.
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Personal identification information</li>
                <li>Medical history and records</li>
                <li>Contact information</li>
                <li>Insurance and billing information</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">How We Use Your Information</h3>
              <p>
                Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Data Protection and Security</h3>
              <p>
                Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Sharing of Information</h3>
              <p>
                Aliquam erat volutpat. Morbi imperdiet, mauris ac auctor dictum, nisl ligula egestas nulla, et sollicitudin lorem quis nec magna. Sed vel lacus. Mauris nibh felis, adipiscing varius, adipiscing in, lacinia vel, tellus.
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>With healthcare providers involved in your care</li>
                <li>For billing and insurance purposes</li>
                <li>When required by law</li>
                <li>With your explicit consent</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Your Rights</h3>
              <p>
                Suspendisse eu nisl. Nullam ut libero. Integer dignissim consequat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate data</li>
                <li>Deletion of personal information (subject to legal requirements)</li>
                <li>Objection to processing of your data</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Cookies and Tracking</h3>
              <p>
                Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Contact Information</h3>
              <p>
                If you have any questions about this Privacy Policy, please contact our Data Protection Officer at:
              </p>
              <div className="mt-2 space-y-1">
                <p>Phone: (02) 8825-5236</p>
                <p>Address: #8009 CAA Road, Pulanglupa II, Las Pinas City, Metro Manila, Philippines</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Changes to This Policy</h3>
              <p>
                Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.
              </p>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-0">
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}