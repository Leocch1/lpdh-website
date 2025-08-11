import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity';
import nodemailer from 'nodemailer';

// Create transporter for email notifications
const createTransporter = () => {
  // Check if EMAIL_USER is an Outlook/Microsoft 365 account
  if (process.env.EMAIL_USER?.includes('@outlook.') || 
      process.env.EMAIL_USER?.includes('@hotmail.') ||
      process.env.EMAIL_USER?.includes('@live.') ||
      process.env.EMAIL_USER?.includes('@laspinas.sti.edu.ph')) {
    console.log('🔄 Using Outlook/Microsoft 365 configuration for:', process.env.EMAIL_USER);
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

  // Fallback to Gmail if needed
  console.log('🔄 Using Gmail configuration');
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const transporter = createTransporter();

// Function to send notification email to staff
async function sendContactNotification(contactData: any) {
  try {
    const { messageType, name, email, subject, message } = contactData;
    
    // Define priority and urgency based on message type
    const isComplaint = messageType === 'complaint';
    const priority = isComplaint ? 'high' : 'normal';
    const urgencyText = isComplaint ? '🚨 COMPLAINT ALERT' : '📩 New Contact Message';
    
    const emailSubject = `${urgencyText} - ${subject}`;
    
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
        <!-- Header -->
        <div style="background: ${isComplaint ? 'linear-gradient(135deg, #dc3545, #c82333)' : 'linear-gradient(135deg, #28a745, #20c997)'}; color: white; padding: 25px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 600;">🏥 LPDH Medical Center</h1>
          <p style="margin: 5px 0 0 0; font-size: 16px; opacity: 0.9;">${urgencyText}</p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 30px; background-color: white;">
          <!-- Message Details -->
          <div style="margin-bottom: 25px;">
            <h2 style="color: ${isComplaint ? '#dc3545' : '#28a745'}; margin: 0 0 15px 0; font-size: 20px; border-bottom: 2px solid #e1e5e9; padding-bottom: 8px;">📝 Message Details</h2>
            <table style="width: 100%; border-collapse: collapse; background-color: #f8f9fa; border-radius: 8px; overflow: hidden;">
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; background-color: #e9ecef; border-bottom: 1px solid #dee2e6; width: 30%;">Message Type:</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; font-weight: 600; color: ${isComplaint ? '#dc3545' : '#28a745'};">${messageType === 'complaint' ? 'COMPLAINT' : 'General Inquiry'}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; background-color: #e9ecef; border-bottom: 1px solid #dee2e6;">Priority:</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; font-weight: 600; text-transform: uppercase;">${priority}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; background-color: #e9ecef; border-bottom: 1px solid #dee2e6;">Subject:</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; font-weight: 600;">${subject}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; background-color: #e9ecef;">Received:</td>
                <td style="padding: 12px 15px;">${new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })}</td>
              </tr>
            </table>
          </div>
          
          <!-- Contact Information -->
          <div style="margin-bottom: 25px;">
            <h3 style="color: ${isComplaint ? '#dc3545' : '#28a745'}; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #e1e5e9; padding-bottom: 8px;">👤 Contact Information</h3>
            <table style="width: 100%; border-collapse: collapse; background-color: #f8f9fa; border-radius: 8px; overflow: hidden;">
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; background-color: #e9ecef; border-bottom: 1px solid #dee2e6; width: 30%;">Full Name:</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; background-color: #e9ecef;">Email Address:</td>
                <td style="padding: 12px 15px;"><a href="mailto:${email}" style="color: ${isComplaint ? '#dc3545' : '#28a745'}; text-decoration: none;">${email}</a></td>
              </tr>
            </table>
          </div>
          
          <!-- Message Content -->
          <div style="margin-bottom: 25px;">
            <h3 style="color: ${isComplaint ? '#dc3545' : '#28a745'}; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #e1e5e9; padding-bottom: 8px;">💬 Message Content</h3>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid ${isComplaint ? '#dc3545' : '#28a745'};">
              <p style="margin: 0; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          
          <!-- Action Required -->
          <div style="background-color: ${isComplaint ? '#f8d7da' : '#e3f2fd'}; padding: 20px; border-radius: 8px; border-left: 4px solid ${isComplaint ? '#dc3545' : '#2196f3'}; text-align: center;">
            <h4 style="margin: 0 0 15px 0; color: ${isComplaint ? '#721c24' : '#0d47a1'}; font-size: 16px;">🎯 ${isComplaint ? 'URGENT ACTION REQUIRED' : 'Action Required'}</h4>
            <p style="margin: 0 0 15px 0; color: ${isComplaint ? '#721c24' : '#0d47a1'};">${isComplaint ? 'This complaint requires immediate attention and response.' : 'Please review this message and respond accordingly.'}</p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/studio/structure/contactMessage" 
               style="display: inline-block; background-color: ${isComplaint ? '#dc3545' : '#2196f3'}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
              📋 Open Admin Panel & Respond
            </a>
            <p style="margin: 15px 0 0 0; color: ${isComplaint ? '#721c24' : '#0d47a1'}; font-size: 12px;">
              Click the button above to access the full message details and respond
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
          <p style="margin: 0; color: #6c757d; font-size: 12px; line-height: 1.4;">
            <strong>LPDH Medical Center</strong> - Contact Management System<br>
            ${isComplaint ? '⚠️ This is a complaint and requires priority handling.' : 'This is an automated notification. Please respond promptly.'}<br>
            For technical support, contact the IT department.
          </p>
        </div>
      </div>
    `;

    // Send email to hospital staff
    const hospitalEmail = process.env.EMAIL_USER;
    await transporter.sendMail({
      from: `"LPDH Contact System" <${process.env.EMAIL_USER}>`,
      to: hospitalEmail,
      subject: emailSubject,
      html: emailContent,
      priority: isComplaint ? 'high' : 'normal'
    });

    console.log(`✅ Contact notification sent successfully to: ${hospitalEmail}`);
    return { success: true, sentTo: hospitalEmail };
    
  } catch (error) {
    console.error('❌ Error sending contact notification:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { messageType, name, email, subject, message } = data;

    // Validate required fields
    if (!messageType || !name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create the contact message document
    const contactDoc = {
      _type: 'contactMessage',
      messageType,
      name,
      email,
      subject,
      message,
      status: 'new',
      priority: messageType === 'complaint' ? 'high' : 'normal',
      createdAt: new Date().toISOString(),
    };

    // Save to Sanity
    const result = await client.create(contactDoc);
    console.log('✅ Contact message saved to Sanity:', result._id);

    // Send email notification to staff
    const emailResult = await sendContactNotification(data);

    // Update document with notification status
    if (emailResult.success) {
      await client.patch(result._id).set({
        notificationStatus: {
          emailSent: true,
          sentTo: emailResult.sentTo,
          sentAt: new Date().toISOString()
        }
      }).commit();
    }

    return NextResponse.json({
      success: true,
      messageId: result._id,
      message: emailResult.success 
        ? '✅ Message received and staff notified successfully'
        : '⚠️ Message received but staff notification failed',
      emailNotification: emailResult,
    });

  } catch (error) {
    console.error('❌ Error processing contact message:', error);
    return NextResponse.json(
      { error: 'Failed to process message. Please try again.' },
      { status: 500 }
    );
  }
}
