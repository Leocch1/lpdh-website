import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

// Create a server-side client with write permissions
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2023-12-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Server-side token
})

export async function POST(request: NextRequest) {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      date, 
      time, 
      notes, 
      selectedTests,
      doctorRequestImage, // Now required
      doctorRequestNotes
    } = await request.json()

    // Validate required fields (including doctor's request)
    if (!firstName || !lastName || !email || !phone || !date || !time || !selectedTests?.length || !doctorRequestImage) {
      return NextResponse.json(
        { error: 'Missing required fields. Doctor\'s request image is required for all appointments.' },
        { status: 400 }
      )
    }

    // Create test references
    const testReferences = selectedTests.map((testId: string) => ({
      _type: 'object',
      test: {
        _type: 'reference',
        _ref: testId
      }
    }))

    // Prepare doctor's request object (now always required)
    const doctorRequest = {
      requestImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: doctorRequestImage._id
        },
        alt: 'Doctor\'s request document'
      },
      notes: doctorRequestNotes || ''
    }

    // Generate appointment number
    const appointmentNumber = `APT-${Date.now()}`

    // Create appointment document
    const appointmentDoc = {
      _type: 'appointment',
      appointmentNumber,
      patientInfo: {
        firstName,
        lastName,
        email,
        phone
      },
      appointmentDate: date,
      appointmentTime: time,
      selectedTests: testReferences,
      doctorRequest, // Now always included
      notes: notes || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Use the server-side client with write permissions
    const result = await writeClient.create(appointmentDoc)

    return NextResponse.json({
      message: 'Appointment created successfully',
      appointmentNumber,
      appointment: result
    })

  } catch (error) {
    console.error('Error creating appointment:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('Insufficient permissions')) {
        return NextResponse.json(
          { error: 'Insufficient permissions to create appointment. Please check API token.' },
          { status: 403 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    if (date) {
      const appointments = await writeClient.fetch(
        `*[_type == "appointment" && appointmentDate == $date && status != "cancelled"] {
          appointmentTime,
          status
        }`,
        { date }
      );
      
      return NextResponse.json(appointments);
    } else {
      // Fetch all appointments with populated test references
      const appointments = await writeClient.fetch(
        `*[_type == "appointment"] | order(appointmentDate desc, appointmentTime asc) {
          _id,
          appointmentNumber,
          patientInfo,
          appointmentDate,
          appointmentTime,
          selectedTests[] {
            _key,
            test-> {
              _id,
              name,
              category
            }
          },
          doctorRequest {
            requestImage {
              asset
            },
            notes
          },
          notes,
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