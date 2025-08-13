import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    // Verify the webhook secret for security
    const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;
    const signature = request.headers.get('sanity-webhook-signature');
    
    if (webhookSecret && signature) {
      // In production, you should verify the webhook signature
      // This is a basic implementation - consider using crypto for better security
      if (signature !== webhookSecret) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const body = await request.json();
    console.log('🔄 Sanity webhook received:', body);

    // Extract document information
    const { _type: documentType, slug } = body;

    // Revalidate based on document type
    switch (documentType) {
      case 'homepage':
        revalidatePath('/');
        console.log('✅ Revalidated homepage');
        break;
        
      case 'aboutPage':
        revalidatePath('/about');
        console.log('✅ Revalidated about page');
        break;
        
      case 'historyPage':
        revalidatePath('/about/history');
        console.log('✅ Revalidated history page');
        break;
        
      case 'servicesPage':
        revalidatePath('/services');
        console.log('✅ Revalidated services page');
        break;
        
      case 'careers':
        revalidatePath('/careers');
        console.log('✅ Revalidated careers page');
        break;
        
      case 'jobOpening':
        revalidatePath('/careers');
        if (slug?.current) {
          revalidatePath(`/careers/${slug.current}`);
          console.log(`✅ Revalidated job opening: ${slug.current}`);
        }
        break;
        
      case 'doctor':
        revalidatePath('/services/find-doctor');
        console.log('✅ Revalidated find doctor page');
        break;
        
      case 'labTest':
      case 'labDepartment':
        revalidatePath('/services/schedule-lab');
        console.log('✅ Revalidated lab scheduling page');
        break;
        
      case 'scheduleLabPage':
        revalidatePath('/services/schedule-lab');
        console.log('✅ Revalidated lab scheduling page');
        break;
        
      case 'admission':
        revalidatePath('/services/admission');
        console.log('✅ Revalidated admission page');
        break;
        
      case 'contactMessage':
        // Contact messages don't affect frontend, but we can log them
        console.log('📧 New contact message received');
        break;
        
      case 'healthAdvisory':
      case 'newsUpdate':
        revalidatePath('/about');
        console.log('✅ Revalidated about page for news/advisory');
        break;
        
      default:
        // Revalidate all pages for unknown document types
        revalidatePath('/', 'layout');
        console.log(`🔄 Revalidated all pages for document type: ${documentType}`);
    }

    // Also use tags for more granular revalidation
    if (documentType) {
      revalidateTag(documentType);
      revalidateTag('sanity-content');
    }

    // Trigger a broader revalidation for critical pages
    const criticalPaths = ['/', '/about', '/services', '/careers'];
    criticalPaths.forEach(path => {
      revalidatePath(path);
    });

    return NextResponse.json({
      success: true,
      message: 'Website updated successfully',
      revalidated: documentType,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process webhook',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
