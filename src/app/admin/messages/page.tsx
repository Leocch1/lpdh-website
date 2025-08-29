'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileSpreadsheet, Shield, Calendar, Filter, AlertCircle, CheckCircle, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function MessagesAdminPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [exportCount, setExportCount] = useState(0);
  
  // Export filters with smart defaults
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    messageType: 'all',
    status: 'all'
  });

  // Set default date range to last 30 days
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    setFilters(prev => ({
      ...prev,
      endDate: today.toISOString().split('T')[0],
      startDate: thirtyDaysAgo.toISOString().split('T')[0]
    }));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const auth = btoa(`${credentials.username}:${credentials.password}`);
      const response = await fetch('/api/admin/export-messages?test=true', {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIsAuthenticated(true);
        toast.success('✅ Authentication successful - Welcome to LPDH Admin Dashboard');
      } else {
        const errorData = await response.text();
        toast.error('❌ Invalid credentials - Please check your username and password');
        console.error('Auth error:', errorData);
      }
    } catch (error) {
      toast.error('❌ Authentication failed - Please try again');
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    setIsLoading(true);
    
    try {
      const auth = btoa(`${credentials.username}:${credentials.password}`);
      const params = new URLSearchParams();
      
      // Add filters to query parameters
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.messageType !== 'all') params.append('messageType', filters.messageType);
      if (filters.status !== 'all') params.append('status', filters.status);

      toast.info('🔄 Preparing Excel export...');

      const response = await fetch(`/api/admin/export-messages?${params.toString()}`, {
        headers: {
          'Authorization': `Basic ${auth}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Export failed');
      }

      // Get the filename from the response headers
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : `LPDH_Messages_${new Date().toISOString().slice(0, 10)}.xlsx`;

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setExportCount(prev => prev + 1);
      toast.success(`✅ Excel file downloaded successfully: ${filename}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`❌ Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    setFilters({
      startDate: thirtyDaysAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
      messageType: 'all',
      status: 'all'
    });
    toast.info('🔄 Filters reset to default (last 30 days)');
  };

  // Login screen - completely isolated from site layout
  if (!isAuthenticated) {
    return (
      <div 
        className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          margin: 0,
          padding: 0
        }}
      >
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">LPDH Admin Access</CardTitle>
            <CardDescription className="text-base">
              Secure access to message export functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Admin Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter admin username"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Admin Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Access Admin Dashboard
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                <AlertCircle className="h-4 w-4 inline mr-1" />
                Authorized personnel only
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main admin dashboard - completely isolated from site layout
  return (
    <div 
      className="min-h-screen w-full bg-gray-50"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        margin: 0,
        padding: 0,
        overflow: 'auto'
      }}
    >
      <div className="w-full py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Internal Header - NOT the website header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <FileSpreadsheet className="h-8 w-8 text-blue-600" />
                  LPDH Messages Export Dashboard
                </h1>
                <p className="text-gray-600 mt-2">Export contact messages and complaints to Excel spreadsheets</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="px-3 py-1">
                  <Users className="h-4 w-4 mr-1" />
                  Admin: {credentials.username}
                </Badge>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAuthenticated(false);
                    setCredentials({ username: '', password: '' });
                    toast.info('👋 Logged out successfully');
                  }}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">Exports Completed</p>
                      <p className="text-2xl font-bold">{exportCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">Session Started</p>
                      <p className="text-lg font-semibold">{new Date().toLocaleTimeString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-600">Date Range</p>
                      <p className="text-sm font-medium">
                        {filters.startDate && filters.endDate ? 
                          `${filters.startDate} to ${filters.endDate}` : 
                          'All dates'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Export Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Export Configuration
                </CardTitle>
                <CardDescription>
                  Configure filters to export specific messages. Default shows last 30 days.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={filters.startDate}
                      onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="messageType">Message Type</Label>
                    <Select value={filters.messageType} onValueChange={(value) => setFilters(prev => ({ ...prev, messageType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="inquiry">General Inquiries</SelectItem>
                        <SelectItem value="complaint">Complaints</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Message Status</Label>
                    <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="new">New Messages</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 pt-2">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    size="sm"
                  >
                    Reset to Default
                  </Button>
                  <div className="text-sm text-gray-600">
                    {filters.startDate || filters.endDate || filters.messageType !== 'all' || filters.status !== 'all' 
                      ? 'Filtered export will be generated'
                      : 'All messages will be exported'
                    }
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  Export to Excel
                </CardTitle>
                <CardDescription>
                  Download filtered messages as a professional Excel spreadsheet with comprehensive data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={handleExport}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Generating Excel...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Export to Excel
                      </>
                    )}
                  </Button>
                  <div className="text-sm text-gray-600">
                    <strong>Included data:</strong> Message details, contact info, status tracking, internal notes, email notifications, and timestamps
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Excel File Information */}
            <Card>
              <CardHeader>
                <CardTitle>Excel Export Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Included Columns:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Row number and Message ID</li>
                      <li>• Contact information (Name, Email, Phone)</li>
                      <li>• Message type, subject, and content</li>
                      <li>• Current status and priority level</li>
                      <li>• Internal notes and response tracking</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Additional Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Email notification status</li>
                      <li>• Days since submission calculation</li>
                      <li>• Professional formatting with auto-sized columns</li>
                      <li>• Descriptive filename with filters and timestamp</li>
                      <li>• Ready for analysis and reporting</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}