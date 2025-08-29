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

interface JobApplicationData {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  message?: string;
  jobCategory?: string;
  jobSlug: string;
}

// Query to get job category HR email
const JOB_CATEGORY_EMAIL_QUERY = `
  *[_type == "jobOpening" && slug.current == $slug][0]{
    "categoryEmail": category->hrEmail,
    "categoryName": category->label,
    title,
    category->{
      label,
      hrEmail
    }
  }
`;

async function sendJobApplicationEmail(applicationData: JobApplicationData, resumeBuffer?: Buffer, resumeFilename?: string) {
  try {
    const transporter = createTransporter();
    
    // Get the job category HR email
    let hrEmail = '';
    let categoryName = '';
    let jobTitle = '';
    
    try {
      const jobData = await client.fetch(JOB_CATEGORY_EMAIL_QUERY, { slug: applicationData.jobSlug });
      hrEmail = jobData?.category?.hrEmail || '';
      categoryName = jobData?.category?.label || '';
      jobTitle = jobData?.title || applicationData.position;
    } catch (error) {
      console.log('Could not fetch HR email from Sanity:', error);
    }

    const mainEmail = process.env.EMAIL_USER as string;
    const emailList = [mainEmail];
    
    // Add HR email if available and different from main email
    if (hrEmail && hrEmail !== mainEmail) {
      emailList.push(hrEmail);
    }

    console.log(`📧 Sending job application emails to: ${emailList.join(', ')}`);
    console.log(`📎 Resume attachment: ${resumeFilename ? `"${resumeFilename}" (${resumeBuffer ? Math.round(resumeBuffer.length / 1024) : 0} KB)` : 'No file attached'}`);

    const emailSubject = `New Job Application - ${jobTitle}`;
    
    const emailContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0;">
        <!-- Header -->
        <div style="display: flex; align-items: center; background-color: #28a745; color: white; padding: 30px;">
          <img src="https://lpdhinc.com/LPDH%20LOGO%20OFFICIAL.png"
               alt="Las Piñas Doctors Hospital Logo"
               style="height: 80px; margin-right: 32px; border-radius: 8px; display: block;" />
          <div>
            <h1 style="margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 1px;">
              Las Piñas Doctors Hospital INC.
            </h1>
            <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9; font-weight: 300;">
              Human Resources - Job Application
            </p>
          </div>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 40px 30px; background-color: white;">
          <!-- Application Details -->
          <div style="margin-bottom: 35px;">
            <h2 style="color: #1f4e79; margin: 0 0 20px 0; font-size: 22px; font-weight: 400; border-bottom: 2px solid #1f4e79; padding-bottom: 10px;">Application Information</h2>
            <table style="width: 100%; border-collapse: collapse; background-color: #f8f9fa; border: 1px solid #e9ecef;">
              <tr style="background-color: #ffffff;">
                <td style="padding: 15px 20px; font-weight: 600; color: #495057; border-bottom: 1px solid #dee2e6; width: 30%;">Position Applied</td>
                <td style="padding: 15px 20px; border-bottom: 1px solid #dee2e6; font-weight: 600; color: #1f4e79;">${jobTitle}</td>
              </tr>
              ${categoryName ? `
              <tr style="background-color: #f8f9fa;">
                <td style="padding: 15px 20px; font-weight: 600; color: #495057; border-bottom: 1px solid #dee2e6;">Department</td>
                <td style="padding: 15px 20px; border-bottom: 1px solid #dee2e6; font-weight: 500;">${categoryName}</td>
              </tr>
              ` : ''}
              <tr style="background-color: ${categoryName ? '#ffffff' : '#f8f9fa'};">
                <td style="padding: 15px 20px; font-weight: 600; color: #495057;">Application Date</td>
                <td style="padding: 15px 20px; font-weight: 500;">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
            </table>
          </div>
          
          <!-- Applicant Information -->
          <div style="margin-bottom: 35px;">
            <h3 style="color: #1f4e79; margin: 0 0 20px 0; font-size: 20px; font-weight: 400; border-bottom: 2px solid #1f4e79; padding-bottom: 8px;">Applicant Information</h3>
            <table style="width: 100%; border-collapse: collapse; background-color: #f8f9fa; border: 1px solid #e9ecef;">
              <tr style="background-color: #ffffff;">
                <td style="padding: 15px 20px; font-weight: 600; color: #495057; border-bottom: 1px solid #dee2e6; width: 25%;">Full Name</td>
                <td style="padding: 15px 20px; border-bottom: 1px solid #dee2e6; font-weight: 600;">${applicationData.firstName} ${applicationData.middleName ? applicationData.middleName + ' ' : ''}${applicationData.lastName}</td>
              </tr>
              <tr style="background-color: #f8f9fa;">
                <td style="padding: 15px 20px; font-weight: 600; color: #495057; border-bottom: 1px solid #dee2e6;">Email Address</td>
                <td style="padding: 15px 20px; border-bottom: 1px solid #dee2e6;"><a href="mailto:${applicationData.email}" style="color: #1f4e79; text-decoration: none;">${applicationData.email}</a></td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="padding: 15px 20px; font-weight: 600; color: #495057;">Phone Number</td>
                <td style="padding: 15px 20px;"><a href="tel:${applicationData.phone}" style="color: #1f4e79; text-decoration: none;">${applicationData.phone}</a></td>
              </tr>
            </table>
          </div>
          
          ${applicationData.message ? `
            <!-- Cover Message -->
            <div style="margin-bottom: 35px;">
              <h3 style="color: #1f4e79; margin: 0 0 20px 0; font-size: 20px; font-weight: 400; border-bottom: 2px solid #1f4e79; padding-bottom: 8px;">Cover Message</h3>
              <div style="background-color: #e3f2fd; padding: 20px; border-left: 4px solid #2196f3; border: 1px solid #bbdefb;">
                <p style="margin: 0; color: #0d47a1; font-size: 15px; line-height: 1.6;">${applicationData.message}</p>
              </div>
            </div>
          ` : ''}
          
          <!-- Resume Attachment -->
          <div style="background-color: #e8f5e8; padding: 25px; border: 1px solid #c8e6c9; margin-bottom: 35px;">
            <h4 style="margin: 0 0 15px 0; color: #2e7d32; font-size: 18px; font-weight: 500;">Resume & Documents</h4>
            ${resumeFilename ? `
              <p style="margin: 0 0 10px 0; color: #2e7d32; font-weight: 600;">✓ Resume File Attached: "${resumeFilename}"</p>
              <p style="margin: 0; color: #2e7d32; font-size: 14px;">The applicant's resume has been attached to this email. Please download and review the attachment for complete details about their qualifications and experience.</p>
            ` : `
              <p style="margin: 0; color: #d32f2f; font-weight: 500;">⚠️ No resume file was attached to this application.</p>
            `}
          </div>
          
          <!-- Action Required -->
          <div style="background-color: #f8f9fa; padding: 30px; border: 2px solid #1f4e79; text-align: center;">
            <h4 style="margin: 0 0 20px 0; color: #1f4e79; font-size: 20px; font-weight: 500;">Action Required</h4>
            <p style="margin: 0 0 25px 0; color: #495057; font-size: 16px;">Please review this job application and follow up with the candidate as appropriate.</p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/studio" 
               style="display: inline-block; background-color: #1f4e79; color: white; padding: 15px 30px; text-decoration: none; font-weight: 600; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px;">
              Access Administrative Panel
            </a>
            <p style="margin: 20px 0 0 0; color: #6c757d; font-size: 13px;">
              Click the button above to manage job postings and applications.
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #343a40; color: #ffffff; padding: 25px; text-align: center;">
          <p style="margin: 0 0 5px 0; color: #ffffff; font-size: 16px; font-weight: 500;">Las Piñas Doctor's Hospital</p>
          <p style="margin: 0 0 5px 0; color: #adb5bd; font-size: 14px;">Human Resources Department - Job Application System</p>
          <p style="margin: 0; color: #6c757d; font-size: 12px;">
            This is an automated notification. Please do not reply to this email.
          </p>
          <p style="margin: 15px 0 0 0; color: #6c757d; font-size: 11px;">
            Sent on ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })} (Philippine Standard Time)
          </p>
        </div>
      </div>
    `;

    // Prepare email attachments
    const attachments: any[] = [];
    if (resumeBuffer && resumeFilename) {
      attachments.push({
        filename: resumeFilename,
        content: resumeBuffer,
      });
    }

    // Send emails to all recipients
    const emailPromises = emailList.map(email => 
      transporter.sendMail({
        from: `"LPDH HR System" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: emailSubject,
        html: emailContent,
        attachments: attachments,
        priority: 'high'
      })
    );

    await Promise.all(emailPromises);
    console.log(`✅ Job application notification sent successfully to: ${emailList.join(', ')}`);
    
    return {
      success: true,
      sentTo: emailList,
      sentAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ Failed to send job application email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form fields
    const firstName = formData.get('firstName') as string;
    const middleName = formData.get('middleName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const position = formData.get('position') as string;
    const message = formData.get('message') as string;
    const jobSlug = formData.get('jobSlug') as string;
    
    // Extract resume file
    const resumeFile = formData.get('resume') as File;
    let resumeBuffer: Buffer | undefined;
    let resumeFilename: string | undefined;
    
    if (resumeFile && resumeFile.size > 0) {
      const bytes = await resumeFile.arrayBuffer();
      resumeBuffer = Buffer.from(bytes);
      resumeFilename = resumeFile.name;
      
      console.log(`📎 Processing resume file: "${resumeFilename}" (${Math.round(resumeFile.size / 1024)} KB)`);
      
      // Validate file size (50MB limit)
      if (resumeFile.size > 50 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: 'Resume file is too large. Maximum size is 50MB.' },
          { status: 400 }
        );
      }
    } else {
      console.log('⚠️ No resume file provided or file is empty');
    }

    // Validate required fields
    if (!firstName || !lastName || !email || !position || !jobSlug) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate resume file is required
    if (!resumeBuffer || !resumeFilename) {
      return NextResponse.json(
        { success: false, error: 'Resume file is required for job application' },
        { status: 400 }
      );
    }

    // Prepare application data
    const applicationData: JobApplicationData = {
      firstName,
      middleName,
      lastName,
      email,
      phone,
      position,
      message,
      jobSlug
    };

    console.log('📝 Processing job application for:', `POSITION: ${applicationData.position}`);
    console.log('👤 Applicant:', `${firstName} ${lastName} (${email})`);

    // First, save the application to Sanity
    let savedApplication;
    try {
      // Upload resume file to Sanity if provided
      let resumeAsset;
      if (resumeBuffer && resumeFilename) {
        console.log('📤 Uploading resume to Sanity...');
        resumeAsset = await client.assets.upload('file', resumeBuffer, {
          filename: resumeFilename,
          contentType: resumeFile.type || 'application/pdf'
        });
        console.log('✅ Resume uploaded to Sanity successfully');
      }

      // Create the job application document
      const applicationDoc = {
        _type: 'jobApplication',
        applicantName: `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`.trim(),
        jobPosition: position,
        email: email,
        contactNumber: phone,
        message: message || undefined,
        resume: resumeAsset ? {
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: resumeAsset._id
          }
        } : undefined,
        applicationStatus: 'new',
        submittedAt: new Date().toISOString()
      };

      console.log('💾 Saving job application to Sanity...');
      savedApplication = await client.create(applicationDoc);
      console.log('✅ Job application saved to Sanity successfully with ID:', savedApplication._id);

    } catch (sanityError) {
      console.error('❌ Failed to save job application to Sanity:', sanityError);
      // Continue with email sending even if Sanity save fails
    }

    // Send email notifications
    const emailResult = await sendJobApplicationEmail(applicationData, resumeBuffer, resumeFilename);

    if (emailResult.success) {
      return NextResponse.json({
        success: true,
        message: 'Application submitted successfully! HR department has been notified.',
        data: {
          applicationId: savedApplication?._id,
          applicant: `${firstName} ${lastName}`,
          position: position,
          submittedAt: new Date().toISOString(),
          notificationsSent: emailResult.sentTo,
          savedToDatabase: !!savedApplication
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Application received but email notification failed',
        details: emailResult.error,
        data: {
          applicationId: savedApplication?._id,
          savedToDatabase: !!savedApplication
        }
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Job application API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process job application',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
