import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const status = searchParams.get('status');
    const messageType = searchParams.get('messageType');

    // Build query with filters
    let query = '*[_type == "contactMessage"';
    const params: any = {};

    if (dateFrom && dateTo) {
      query += ' && createdAt >= $dateFrom && createdAt <= $dateTo';
      params.dateFrom = dateFrom;
      params.dateTo = dateTo;
    }

    if (status) {
      query += ' && status == $status';
      params.status = status;
    }

    if (messageType) {
      query += ' && messageType == $messageType';
      params.messageType = messageType;
    }

    query += '] | order(createdAt desc) {';
    query += `
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
      notificationStatus
    }`;

    const messages = await client.fetch(query, params);

    if (format === 'json') {
      return NextResponse.json({
        success: true,
        data: messages,
        total: messages.length,
        exportedAt: new Date().toISOString()
      });
    }

    // Generate CSV content
    const csvHeaders = [
      'ID',
      'Date Created',
      'Message Type', 
      'Priority',
      'Status',
      'Full Name',
      'Email',
      'Subject',
      'Message',
      'Internal Notes',
      'Date Responded',
      'Email Sent'
    ];

    const csvRows = messages.map((msg: any) => [
      msg._id,
      new Date(msg.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Manila' }),
      msg.messageType === 'complaint' ? 'Complaint' : 'General Inquiry',
      msg.priority?.toUpperCase() || 'NORMAL',
      msg.status?.toUpperCase() || 'NEW',
      msg.name,
      msg.email,
      msg.subject,
      `"${msg.message.replace(/"/g, '""')}"`, // Escape quotes in CSV
      msg.notes ? `"${msg.notes.replace(/"/g, '""')}"` : '',
      msg.respondedAt ? new Date(msg.respondedAt).toLocaleString('en-US', { timeZone: 'Asia/Manila' }) : '',
      msg.notificationStatus?.emailSent ? 'Yes' : 'No'
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map((row: string[]) => row.join(','))
    ].join('\n');

    // Add BOM for proper Excel encoding
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvContent;

    const filename = `contact-messages-${new Date().toISOString().split('T')[0]}.csv`;

    return new NextResponse(csvWithBOM, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

  } catch (error) {
    console.error('❌ Error exporting contact messages:', error);
    return NextResponse.json(
      { error: 'Failed to export messages' },
      { status: 500 }
    );
  }
}
