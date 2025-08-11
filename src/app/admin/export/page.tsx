'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, Calendar, Filter } from "lucide-react";

export default function ContactExportPage() {
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    complaints: 0,
    thisMonth: 0
  });

  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    status: 'all',
    messageType: 'all'
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/contact/export?format=json');
      const data = await response.json();
      
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const stats = {
        total: data.total,
        new: data.data.filter((msg: any) => msg.status === 'new').length,
        complaints: data.data.filter((msg: any) => msg.messageType === 'complaint').length,
        thisMonth: data.data.filter((msg: any) => 
          new Date(msg.createdAt) >= thisMonthStart
        ).length
      };
      
      setStats(stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleExport = (customFilters: Record<string, string> = {}) => {
    const params = new URLSearchParams({
      format: 'csv',
      ...filters,
      ...customFilters
    });
    
    // Remove empty values and "all" values
    for (const [key, value] of params.entries()) {
      if (!value || value === 'all') {
        params.delete(key);
      }
    }
    
    const url = `/api/contact/export?${params.toString()}`;
    window.open(url, '_blank');
  };

  const handleQuickExport = (type: string) => {
    switch (type) {
      case 'all':
        handleExport();
        break;
      case 'complaints':
        handleExport({ messageType: 'complaint' });
        break;
      case 'thisMonth':
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
        handleExport({ dateFrom: firstDay, dateTo: lastDay });
        break;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Download className="h-6 w-6 text-green-600" />
        <h1 className="text-2xl font-bold">Contact Messages Export</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">New Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.new}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.complaints}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.thisMonth}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Export Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Quick Export Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => handleQuickExport('all')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              Export All Messages ({stats.total})
            </Button>
            
            <Button
              onClick={() => handleQuickExport('complaints')}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
            >
              <FileText className="h-4 w-4" />
              Export Complaints Only ({stats.complaints})
            </Button>
            
            <Button
              onClick={() => handleQuickExport('thisMonth')}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Calendar className="h-4 w-4" />
              Export This Month ({stats.thisMonth})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Export Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="messageType">Message Type</Label>
              <Select value={filters.messageType} onValueChange={(value) => setFilters({...filters, messageType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="inquiry">General Inquiry</SelectItem>
                  <SelectItem value="complaint">Complaint</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={() => handleExport()}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export with Filters
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => setFilters({ dateFrom: '', dateTo: '', status: 'all', messageType: 'all' })}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>💡 How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• <strong>Quick Export:</strong> Use the buttons above for common export scenarios</p>
            <p>• <strong>Custom Export:</strong> Set filters and click "Export with Filters" for specific data</p>
            <p>• <strong>File Format:</strong> All exports are CSV files that open directly in Excel</p>
            <p>• <strong>Data Included:</strong> Message details, timestamps, status, priority, and internal notes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
