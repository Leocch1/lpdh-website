'use client';

import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar } from "lucide-react";

export default function ExportContactMessages() {
  const handleExport = (filters: string = '') => {
    const url = `/api/contact/export?format=csv${filters}`;
    window.open(url, '_blank');
  };

  const handleExportThisMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    handleExport(`&dateFrom=${firstDay}&dateTo=${lastDay}`);
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        onClick={() => handleExport()}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Export All Messages
      </Button>
      
      <Button
        onClick={() => handleExport('&messageType=complaint')}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
      >
        <FileText className="h-4 w-4" />
        Export Complaints Only
      </Button>
      
      <Button
        onClick={handleExportThisMonth}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
      >
        <Calendar className="h-4 w-4" />
        Export This Month
      </Button>
    </div>
  );
}
