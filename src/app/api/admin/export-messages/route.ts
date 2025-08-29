import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import * as XLSX from 'xlsx';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03',
});

// Admin credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'lpdh_admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'LPDH2024_SecureAdmin!';

function authenticateAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  const base64Credentials = authHeader.slice(6);
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    if (!authenticateAdmin(request)) {
      return new NextResponse('Unauthorized Access - Admin credentials required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="LPDH Admin Area"',
        },
      });
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const messageType = searchParams.get('messageType');
    const status = searchParams.get('status');
    const testAuth = searchParams.get('test');

    // If it's just an auth test, return success
    if (testAuth) {
      return NextResponse.json({ message: 'Authentication successful' });
    }

    // Build Sanity query with filters
    let query = `*[_type == "contactMessage"`;
    const filters = [];

    if (startDate) {
      filters.push(`createdAt >= "${startDate}T00:00:00.000Z"`);
    }
    if (endDate) {
      filters.push(`createdAt <= "${endDate}T23:59:59.999Z"`);
    }
    if (messageType && messageType !== 'all') {
      filters.push(`messageType == "${messageType}"`);
    }
    if (status && status !== 'all') {
      filters.push(`status == "${status}"`);
    }

    if (filters.length > 0) {
      query += ` && (${filters.join(' && ')})`;
    }

    query += `] | order(createdAt desc) {
      _id,
      messageType,
      name,
      email,
      subject,
      message,
      status,
      priority,
      notes,
      createdAt,
      respondedAt,
      notificationStatus,
      phoneNumber
    }`;

    console.log('📊 Exporting contact messages with query:', query);

    // Fetch data from Sanity
    const messages = await client.fetch(query);

    console.log(`📋 Found ${messages.length} messages to export`);

    if (messages.length === 0) {
      return NextResponse.json(
        { error: 'No messages found with the specified filters' },
        { status: 404 }
      );
    }

    // Prepare data for Excel with enhanced formatting
    const excelData = messages.map((message: any, index: number) => ({
      'Row #': index + 1,
      'Message ID': message._id,
      'Type': message.messageType === 'inquiry' ? 'General Inquiry' : 'Complaint',
      'Full Name': message.name || 'N/A',
      'Email': message.email || 'N/A',
      'Phone': message.phoneNumber || 'N/A',
      'Subject': message.subject || 'N/A',
      'Message Content': message.message || 'N/A',
      'Current Status': (message.status || 'new').toUpperCase(),
      'Priority Level': (message.priority || 'normal').toUpperCase(),
      'Internal Notes': message.notes || '',
      'Submitted Date': message.createdAt ? new Date(message.createdAt).toLocaleDateString('en-US') : '',
      'Submitted Time': message.createdAt ? new Date(message.createdAt).toLocaleTimeString('en-US') : '',
      'Response Date': message.respondedAt ? new Date(message.respondedAt).toLocaleDateString('en-US') : 'Not Responded',
      'Email Notification Sent': message.notificationStatus?.emailSent ? 'YES' : 'NO',
      'Notification Sent To': message.notificationStatus?.sentTo || 'N/A',
      'CC Recipients': message.notificationStatus?.ccEmails?.join('; ') || 'N/A',
      'Days Since Submission': message.createdAt ? Math.floor((new Date().getTime() - new Date(message.createdAt).getTime()) / (1000 * 3600 * 24)) : 'N/A'
    }));

    // Create Excel workbook with professional formatting
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Enhanced column sizing for better readability
    const colWidths = [
      { wch: 8 },   // Row #
      { wch: 15 },  // Message ID
      { wch: 18 },  // Type
      { wch: 25 },  // Full Name
      { wch: 30 },  // Email
      { wch: 15 },  // Phone
      { wch: 35 },  // Subject
      { wch: 60 },  // Message Content
      { wch: 15 },  // Current Status
      { wch: 15 },  // Priority Level
      { wch: 40 },  // Internal Notes
      { wch: 15 },  // Submitted Date
      { wch: 15 },  // Submitted Time
      { wch: 15 },  // Response Date
      { wch: 20 },  // Email Notification Sent
      { wch: 30 },  // Notification Sent To
      { wch: 30 },  // CC Recipients
      { wch: 20 },  // Days Since Submission
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'LPDH Contact Messages');

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Generate descriptive filename with filters and timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    let filenamePrefix = 'LPDH_Messages';
    
    const filterParts = [];
    if (messageType && messageType !== 'all') filterParts.push(messageType);
    if (status && status !== 'all') filterParts.push(status);
    if (startDate) filterParts.push(`from-${startDate}`);
    if (endDate) filterParts.push(`to-${endDate}`);
    
    if (filterParts.length > 0) {
      filenamePrefix += `_${filterParts.join('_')}`;
    }
    
    const filename = `${filenamePrefix}_${timestamp}.xlsx`;

    console.log(`✅ Excel export generated successfully: ${filename} (${excelData.length} records)`);

    // Return Excel file with proper headers
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': excelBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });

  } catch (error) {
    console.error('❌ Error exporting messages to Excel:', error);
    return NextResponse.json(
      { 
        error: 'Failed to export messages to Excel',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    },
  });
}