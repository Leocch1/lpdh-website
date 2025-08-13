import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity';
import nodemailer from 'nodemailer';

// Use Microsoft 365/Exchange Online with fallback options
const createTransporter = () => {
  // Check if EMAIL_USER is a Microsoft 365 account (including onmicrosoft.com domains and custom domains)
  if (process.env.EMAIL_USER?.includes('@outlook.') || 
      process.env.EMAIL_USER?.includes('@hotmail.') ||
      process.env.EMAIL_USER?.includes('@live.') ||
      process.env.EMAIL_USER?.includes('@onmicrosoft.com') ||
      process.env.EMAIL_USER?.includes('@lpdhinc.com') ||
      process.env.EMAIL_USER?.includes('@laspinas.sti.edu.ph')) {
    console.log('🔄 Using Microsoft 365/Outlook configuration for:', process.env.EMAIL_USER);
    return nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });
  }

  // Check if EMAIL_USER is Gmail or a domain connected to Gmail  
  if (process.env.EMAIL_USER?.includes('@gmail.com')) {
    console.log('🔄 Using Gmail configuration for:', process.env.EMAIL_USER);
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  
  // Default to Microsoft 365 configuration for any other email
  console.log('🔑 Using Microsoft 365 SMTP configuration for:', process.env.EMAIL_USER);
  return nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      ciphers: 'SSLv3'
    }
  });
};

const transporter = createTransporter();

// Test the connection with better error handling
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration failed:', error);
    
    // Provide specific guidance based on error code
    if ((error as any).responseCode === 535) {
      console.log('🚨 SMTP Authentication is disabled by your organization\'s security policy');
      console.log('📋 Required actions in Exchange Admin Center:');
      console.log('   1. Go to Recipients → Mailboxes');
      console.log(`   2. Select ${process.env.EMAIL_USER}`);
      console.log('   3. Enable "Authenticated SMTP" in Email Apps settings');
      console.log(`   4. Or use PowerShell: Set-CASMailbox -Identity "${process.env.EMAIL_USER}" -SmtpClientAuthenticationDisabled $false`);
    } else if ((error as any).code === 'EAUTH') {
      console.log('🔐 Authentication failed - check credentials or SMTP settings');
    } else {
      console.log('🔧 Please check your email configuration and network connectivity');
    }
  } else {
    console.log('✅ Email transporter is ready!');
  }
});

// Function to send appointment notification email
async function sendAppointmentNotification(appointmentData: any, labDepartments: any[]) {
  try {
    // Get unique department emails from selected tests
    const departmentEmails = new Set<string>();
    const departmentNames = new Set<string>();
    
    labDepartments.forEach(dept => {
      if (dept.email) {
        departmentEmails.add(dept.email);
        departmentNames.add(dept.name);
        
        // Add backup email if available
        if (dept.backupEmail) {
          departmentEmails.add(dept.backupEmail);
        }
      }
    });

    // Add your own email for testing
    departmentEmails.add(process.env.EMAIL_USER as string);
    console.log(`🧪 Added test email: ${process.env.EMAIL_USER}`);

    if (departmentEmails.size === 0) {
      console.log('No department emails found, skipping email notification');
      return { success: false, error: 'No department emails found' };
    }

    console.log('📧 Sending emails to:', Array.from(departmentEmails));

    // Create email content
    const testsList = appointmentData.selectedTests.map((test: any) => `• ${test.name}`).join('\n');
    const departmentsList = Array.from(departmentNames).join(', ');

    const emailSubject = `🏥 New Lab Appointment - ${appointmentData.appointmentNumber}`;
    
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 25px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 600;">🏥 LPDH Medical Center</h1>
          <p style="margin: 5px 0 0 0; font-size: 16px; opacity: 0.9;">New Lab Appointment Notification</p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 30px; background-color: white;">
          <!-- Appointment Details -->
          <div style="margin-bottom: 25px;">
            <h2 style="color: #28a745; margin: 0 0 15px 0; font-size: 20px; border-bottom: 2px solid #e1e5e9; padding-bottom: 8px;">📅 Appointment Details</h2>
            <table style="width: 100%; border-collapse: collapse; background-color: #f8f9fa; border-radius: 8px; overflow: hidden;">
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; background-color: #e9ecef; border-bottom: 1px solid #dee2e6; width: 40%;">Appointment Number:</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; font-family: monospace; font-weight: 600; color: #28a745;">${appointmentData.appointmentNumber}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; background-color: #e9ecef; border-bottom: 1px solid #dee2e6;">📅 Date:</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6;">${new Date(appointmentData.appointmentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; background-color: #e9ecef; border-bottom: 1px solid #dee2e6;">🕐 Time:</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; font-weight: 600;">${appointmentData.appointmentTime}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; background-color: #e9ecef;">🏢 Department(s):</td>
                <td style="padding: 12px 15px; font-weight: 600; color: #28a745;">${departmentsList}</td>
              </tr>
            </table>
          </div>
          
          <!-- Patient Information -->
          <div style="margin-bottom: 25px;">
            <h3 style="color: #28a745; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #e1e5e9; padding-bottom: 8px;">👤 Patient Information</h3>
            <table style="width: 100%; border-collapse: collapse; background-color: #f8f9fa; border-radius: 8px; overflow: hidden;">
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; background-color: #e9ecef; border-bottom: 1px solid #dee2e6; width: 30%;">Full Name:</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; font-weight: 600;">${appointmentData.patientInfo.firstName} ${appointmentData.patientInfo.lastName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; background-color: #e9ecef; border-bottom: 1px solid #dee2e6;">📧 Email:</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6;"><a href="mailto:${appointmentData.patientInfo.email}" style="color: #28a745; text-decoration: none;">${appointmentData.patientInfo.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; background-color: #e9ecef;">📱 Phone:</td>
                <td style="padding: 12px 15px;"><a href="tel:+63${appointmentData.patientInfo.phone}" style="color: #28a745; text-decoration: none;">+63 ${appointmentData.patientInfo.phone}</a></td>
              </tr>
            </table>
          </div>
          
          <!-- Selected Tests -->
          <div style="margin-bottom: 25px;">
            <h3 style="color: #28a745; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #e1e5e9; padding-bottom: 8px;">🧪 Selected Laboratory Tests</h3>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
              <div style="font-size: 14px; line-height: 1.8;">
                ${appointmentData.selectedTests.map((test: any) => 
                  `<div style="margin: 8px 0; padding: 8px; background-color: white; border-radius: 4px; border-left: 3px solid #28a745;">
                    <strong>• ${test.name}</strong>
                    ${test.labDepartment ? `<br><span style="color: #6c757d; font-size: 12px;">Department: ${test.labDepartment.name}</span>` : ''}
                  </div>`
                ).join('')}
              </div>
            </div>
          </div>
          
          ${appointmentData.notes ? `
            <!-- Special Instructions -->
            <div style="margin-bottom: 25px;">
              <h3 style="color: #28a745; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #e1e5e9; padding-bottom: 8px;">📝 Special Instructions</h3>
              <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
                <p style="margin: 0; font-size: 14px; line-height: 1.6;">${appointmentData.notes}</p>
              </div>
            </div>
          ` : ''}
          
          <!-- Doctor's Request -->
          <div style="background: linear-gradient(135deg, #d4edda, #c3e6cb); padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #28a745;">
            <h4 style="margin: 0 0 10px 0; color: #155724; font-size: 16px;">✅ Doctor's Request/Prescription</h4>
            <p style="margin: 0; color: #155724; font-weight: 600;">✓ Doctor's prescription/request image has been uploaded and is available in the admin system.</p>
            ${appointmentData.doctorRequest?.notes ? `<p style="margin: 10px 0 0 0; color: #155724;"><strong>Additional Notes:</strong> ${appointmentData.doctorRequest.notes}</p>` : ''}
          </div>
          
          <!-- Action Required -->
          <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3; text-align: center;">
            <h4 style="margin: 0 0 15px 0; color: #0d47a1; font-size: 16px;">🎯 Next Steps - Action Required</h4>
            <p style="margin: 0 0 15px 0; color: #0d47a1;">Please review this appointment and confirm the patient's schedule:</p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/studio" 
               style="display: inline-block; background-color: #2196f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
              📋 Open Admin Panel & Review Appointment
            </a>
            <p style="margin: 15px 0 0 0; color: #0d47a1; font-size: 12px;">
              Click the button above to access the full appointment details and doctor's request image
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
          <p style="margin: 0; color: #6c757d; font-size: 12px; line-height: 1.4;">
            <strong>LPDH Medical Center</strong> - Laboratory Scheduling System<br>
            This is an automated notification. Please do not reply to this email.<br>
            For technical support, contact the IT department.
          </p>
          <p style="margin: 10px 0 0 0; color: #6c757d; font-size: 11px;">
            Sent on ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })} (Philippine Time)
          </p>
        </div>
      </div>
    `;

    // Send emails to all department emails
    const emailPromises = Array.from(departmentEmails).map(email => 
      transporter.sendMail({
        from: `"LPDH Lab Scheduling" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: emailSubject,
        html: emailContent,
        priority: 'high'
      })
    );

    await Promise.all(emailPromises);
    console.log(`✅ Appointment notification sent successfully to: ${Array.from(departmentEmails).join(', ')}`);
    
    return {
      success: true,
      sentTo: Array.from(departmentEmails),
      sentAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ Error sending appointment notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Function to send patient confirmation email
async function sendPatientConfirmation(appointmentData: any, selectedTestsData: any[]) {
  try {
    console.log('📧 Sending confirmation email to patient:', appointmentData.patientInfo.email);

    const emailSubject = `✅ Lab Appointment Confirmed - ${appointmentData.appointmentNumber}`;
    
    const patientEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 25px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 600;">🏥 Las Piñas Doctor's Hospital</h1>
          <p style="margin: 5px 0 0 0; font-size: 16px; opacity: 0.9;">Lab Appointment Confirmation</p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 30px; background-color: white;">
          <!-- Greeting -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #28a745; margin: 0 0 10px 0;">Dear ${appointmentData.patientInfo.firstName} ${appointmentData.patientInfo.lastName},</h2>
            <p style="color: #6c757d; margin: 0; font-size: 16px;">Your lab appointment has been successfully scheduled!</p>
          </div>

          <!-- Appointment Details -->
          <div style="margin-bottom: 25px;">
            <h3 style="color: #28a745; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #e1e5e9; padding-bottom: 8px;">📅 Your Appointment Details</h3>
            <table style="width: 100%; border-collapse: collapse; background-color: #f8f9fa; border-radius: 8px; overflow: hidden;">
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; background-color: #e9ecef; border-bottom: 1px solid #dee2e6; width: 35%;">Appointment Number:</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; font-family: monospace; font-weight: 600; color: #28a745;">${appointmentData.appointmentNumber}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; background-color: #e9ecef; border-bottom: 1px solid #dee2e6;">📅 Date:</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; font-weight: 600;">${new Date(appointmentData.appointmentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; background-color: #e9ecef; border-bottom: 1px solid #dee2e6;">🕐 Time:</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; font-weight: 600;">${appointmentData.appointmentTime}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; background-color: #e9ecef; border-bottom: 1px solid #dee2e6;">📞 Contact Phone:</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6;">${appointmentData.patientInfo.phone}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; background-color: #e9ecef;">📧 Email:</td>
                <td style="padding: 12px 15px;">${appointmentData.patientInfo.email}</td>
              </tr>
            </table>
          </div>
          
          <!-- Selected Tests -->
          <div style="margin-bottom: 25px;">
            <h3 style="color: #28a745; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #e1e5e9; padding-bottom: 8px;">🧪 Your Laboratory Tests</h3>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
              ${selectedTestsData.map((test: any) => 
                `<div style="margin: 12px 0; padding: 15px; background-color: white; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <span style="background-color: #28a745; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; margin-right: 10px;">✓</span>
                    <strong style="color: #28a745; font-size: 16px;">${test.name}</strong>
                  </div>
                  ${test.labDepartment ? `<p style="margin: 5px 0; color: #6c757d; font-size: 14px;">📍 Department: ${test.labDepartment.name}</p>` : ''}
                  ${test.preparationNotes ? `<div style="background-color: #fff3cd; padding: 10px; border-left: 3px solid #ffc107; margin: 8px 0; border-radius: 4px;"><strong style="color: #856404;">⚠️ Preparation Required:</strong><br><span style="color: #856404; font-size: 13px;">${test.preparationNotes}</span></div>` : ''}
                  ${test.resultTime ? `<p style="margin: 5px 0; color: #28a745; font-size: 13px;">⏱️ Result Time: ${test.resultTime}</p>` : ''}
                </div>`
              ).join('')}
            </div>
          </div>

          ${appointmentData.notes ? `
            <!-- Special Notes -->
            <div style="margin-bottom: 25px;">
              <h3 style="color: #28a745; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #e1e5e9; padding-bottom: 8px;">📝 Your Special Notes</h3>
              <div style="background-color: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; border-radius: 4px;">
                <p style="margin: 0; color: #0d47a1; font-size: 14px; line-height: 1.6;">${appointmentData.notes}</p>
              </div>
            </div>
          ` : ''}

          <!-- Important Reminders -->
          <div style="background: linear-gradient(135deg, #d4edda, #c3e6cb); padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #28a745;">
            <h3 style="margin: 0 0 15px 0; color: #155724; font-size: 16px;">📋 Important Reminders</h3>
            <ul style="margin: 0; padding-left: 20px; color: #155724; font-size: 14px; line-height: 1.8;">
              <li><strong>Arrive 15 minutes early</strong> for check-in and preparation</li>
              <li><strong>Bring valid ID</strong> and your health insurance card (if applicable)</li>
              <li><strong>Follow preparation instructions</strong> for your selected tests (see above)</li>
              <li><strong>Bring your doctor's prescription/request</strong> (we have a copy on file)</li>
              <li><strong>Fasting may be required</strong> for certain tests - check preparation notes</li>
              <li><strong>Reschedule if needed:</strong> Contact us at least 24 hours in advance</li>
            </ul>
          </div>

          <!-- Contact Information -->
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
            <h4 style="margin: 0 0 15px 0; color: #495057;">📞 Need Help or Want to Reschedule?</h4>
            <p style="margin: 0 0 10px 0; color: #6c757d; font-size: 14px;">
              <strong>Hospital Phone:</strong> <a href="tel:+63285551234" style="color: #28a745; text-decoration: none;">+63 (2) 8555-1234</a>
            </p>
            <p style="margin: 0 0 10px 0; color: #6c757d; font-size: 14px;">
              <strong>Laboratory Department:</strong> <a href="tel:+63285551235" style="color: #28a745; text-decoration: none;">+63 (2) 8555-1235</a>
            </p>
            <p style="margin: 0; color: #6c757d; font-size: 14px;">
              <strong>Email:</strong> <a href="mailto:${process.env.EMAIL_USER}" style="color: #28a745; text-decoration: none;">${process.env.EMAIL_USER}</a>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #343a40; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0 0 5px 0; font-weight: 600;">Las Piñas Doctor's Hospital</p>
          <p style="margin: 0; font-size: 12px; opacity: 0.8;">
            Quality Healthcare • Advanced Laboratory Services • Trusted Since 1985
          </p>
          <p style="margin: 10px 0 0 0; font-size: 11px; opacity: 0.6;">
            This is an automated confirmation. Please save this email for your records.
          </p>
        </div>
      </div>
    `;

    // Send patient confirmation email
    await transporter.sendMail({
      from: `"Las Piñas Doctor's Hospital" <${process.env.EMAIL_USER}>`,
      to: appointmentData.patientInfo.email,
      subject: emailSubject,
      html: patientEmailContent,
      priority: 'normal'
    });

    console.log(`✅ Patient confirmation sent successfully to: ${appointmentData.patientInfo.email}`);
    
    return {
      success: true,
      sentTo: appointmentData.patientInfo.email,
      sentAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ Error sending patient confirmation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      date,
      time,
      notes,
      selectedTests,
      hasDoctorRequest,
      doctorRequestImage,
      doctorRequestNotes
    } = data;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !date || !time || !selectedTests?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate doctor's request is provided
    if (!hasDoctorRequest || !doctorRequestImage) {
      return NextResponse.json(
        { error: 'Doctor\'s request is required for all lab appointments' },
        { status: 400 }
      );
    }

    // Get selected test details with their lab departments
    const selectedTestsData = await client.fetch(`
      *[_type == "labTest" && _id in $testIds] {
        _id,
        name,
        preparationNotes,
        resultTime,
        labDepartment-> {
          _id,
          name,
          email,
          backupEmail
        }
      }
    `, { testIds: selectedTests });

    if (selectedTestsData.length === 0) {
      return NextResponse.json(
        { error: 'No valid tests found' },
        { status: 400 }
      );
    }

    // Generate appointment number
    const appointmentNumber = `LPDH-${Date.now()}`;

    // Create the appointment document
    interface PatientInfo {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    }

    interface TestReference {
      _key: string;
      test: {
        _type: 'reference';
        _ref: string;
      };
    }

    interface DoctorRequestImage {
      _type: 'image';
      asset: {
        _type: 'reference';
        _ref: string;
      };
      alt: string;
    }

    interface DoctorRequest {
      requestImage: DoctorRequestImage;
      notes: string | null;
    }

    interface AppointmentDocument {
      _type: 'appointment';
      appointmentNumber: string;
      patientInfo: PatientInfo;
      appointmentDate: string;
      appointmentTime: string;
      selectedTests: TestReference[];
      doctorRequest: DoctorRequest;
      notes: string | null;
      status: 'pending';
      createdAt: string;
    }

    interface SelectedTestData {
      _id: string;
      name: string;
      labDepartment: {
        _id: string;
        name: string;
        email: string;
        backupEmail?: string;
      };
    }

    interface DoctorRequestImageAsset {
      _id: string;
    }

    const appointmentDoc: AppointmentDocument = {
      _type: 'appointment',
      appointmentNumber,
      patientInfo: {
        firstName,
        lastName,
        email,
        phone,
      },
      appointmentDate: date,
      appointmentTime: time,
      selectedTests: selectedTestsData.map((test: SelectedTestData) => ({
        _key: test._id,
        test: {
          _type: 'reference',
          _ref: test._id,
        },
      })),
      doctorRequest: {
        requestImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: (doctorRequestImage as DoctorRequestImageAsset)._id,
          },
          alt: 'Doctor\'s request document',
        },
        notes: doctorRequestNotes || null,
      },
      notes: notes || null,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Create appointment in Sanity
    const result = await client.create(appointmentDoc);

    // Prepare data for email notification
    const emailData = {
      appointmentNumber,
      appointmentDate: date,
      appointmentTime: time,
      patientInfo: {
        firstName,
        lastName,
        email,
        phone,
      },
      selectedTests: selectedTestsData,
      notes,
      doctorRequest: {
        notes: doctorRequestNotes,
      },
    };

    // Get unique lab departments for email notification
    interface LabDepartment {
      _id: string;
      name: string;
      email: string;
      backupEmail?: string;
    }

    interface SelectedTestDataWithDepartment {
      _id: string;
      name: string;
      labDepartment: LabDepartment;
    }

    const uniqueDepartments: LabDepartment[] = (selectedTestsData as SelectedTestDataWithDepartment[])
      .map((test: SelectedTestDataWithDepartment) => test.labDepartment)
      .filter((dept: LabDepartment | null, index: number, self: (LabDepartment | null)[]) => 
        dept && self.findIndex((d: LabDepartment | null) => d?._id === dept._id) === index
      ) as LabDepartment[];

    // Send email notifications to lab departments
    const emailResult = await sendAppointmentNotification(emailData, uniqueDepartments);

    // Send confirmation email to patient
    const patientEmailResult = await sendPatientConfirmation(emailData, selectedTestsData);

    // Update appointment with notification status
    if (emailResult.success) {
      await client.patch(result._id).set({
        notificationStatus: {
          emailSent: true,
          sentTo: emailResult.sentTo,
          sentAt: emailResult.sentAt,
          patientConfirmationSent: patientEmailResult.success,
          patientConfirmationSentAt: patientEmailResult.success ? patientEmailResult.sentAt : null
        }
      }).commit();
    }

    return NextResponse.json({
      success: true,
      appointmentNumber,
      appointment: result,
      emailNotification: emailResult,
      patientConfirmation: patientEmailResult,
      message: emailResult.success && patientEmailResult.success
        ? '✅ Appointment created successfully! Notifications sent to lab departments and confirmation sent to patient.'
        : emailResult.success && !patientEmailResult.success
        ? '✅ Appointment created and lab departments notified. ⚠️ Patient confirmation email failed.'
        : !emailResult.success && patientEmailResult.success
        ? '✅ Appointment created and patient notified. ⚠️ Lab department notification failed.'
        : '✅ Appointment created successfully but email notifications failed.',
    });

  } catch (error) {
    console.error('❌ Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}