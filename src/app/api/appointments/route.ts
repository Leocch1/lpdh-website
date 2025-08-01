import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN!, // Server-side token
});

export async function POST(request: NextRequest) {
  try {
    const appointmentData = await request.json();
    
    // Validate required fields
    if (!appointmentData.firstName || !appointmentData.lastName || !appointmentData.email || 
        !appointmentData.phone || !appointmentData.date || !appointmentData.time || 
        !appointmentData.selectedTests || appointmentData.selectedTests.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const appointment = {
      _type: 'appointment',
      appointmentNumber: `APT-${Date.now()}`,
      patientInfo: {
        firstName: appointmentData.firstName,
        lastName: appointmentData.lastName,
        email: appointmentData.email,
        phone: appointmentData.phone
      },
      appointmentDate: appointmentData.date,
      appointmentTime: appointmentData.time,
      selectedTests: appointmentData.selectedTests.map((testId: string) => ({
        _type: 'reference',
        _ref: testId
      })),
      notes: appointmentData.notes || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Creating appointment:', appointment);

    const result = await writeClient.create(appointment);
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    
    // More detailed error handling
    if (error instanceof Error) {
      if (error.message.includes('Insufficient permissions')) {
        return NextResponse.json(
          { error: 'Insufficient permissions to create appointment' },
          { status: 403 }
        );
      } else if (error.message.includes('validation')) {
        return NextResponse.json(
          { error: 'Validation error: ' + error.message },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

// GET method to fetch appointments (optional)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    if (date) {
      // Fetch appointments for a specific date
      const appointments = await writeClient.fetch(
        `*[_type == "appointment" && appointmentDate == $date && status != "cancelled"] {
          appointmentTime,
          status
        }`,
        { date }
      );
      
      return NextResponse.json(appointments);
    } else {
      // Fetch all appointments
      const appointments = await writeClient.fetch(
        `*[_type == "appointment"] | order(appointmentDate desc, appointmentTime asc) {
          _id,
          appointmentNumber,
          patientInfo,
          appointmentDate,
          appointmentTime,
          status,
          createdAt
        }`
      );
      
      return NextResponse.json(appointments);
    }
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}