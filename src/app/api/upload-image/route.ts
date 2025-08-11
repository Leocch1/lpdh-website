import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2023-12-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  // Increase timeout for image uploads
  timeout: 60000, // 60 seconds instead of requestTimeout
})

// Helper function to retry operations
async function retryOperation<T>(operation: () => Promise<T>, maxRetries: number = 3): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.log(`🔄 Upload attempt ${attempt} failed:`, error instanceof Error ? error.message : String(error));
      
      if (attempt < maxRetries) {
        const delay = attempt * 1000; // Exponential backoff
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Starting image upload...');
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      console.error('❌ No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log(`📁 File details: ${file.name}, ${file.size} bytes, ${file.type}`);

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      console.error('❌ File too large:', file.size);
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('❌ Invalid file type:', file.type);
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    // Convert file to buffer
    console.log('🔄 Converting file to buffer...');
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Upload to Sanity with retry logic
    console.log('🚀 Uploading to Sanity...');
    
    // Try direct upload first, then with retries if it fails
    let asset;
    try {
      asset = await writeClient.assets.upload('image', buffer, {
        filename: file.name,
      });
    } catch (firstError) {
      console.log('🔄 First upload attempt failed, retrying with backoff...');
      asset = await retryOperation(async () => {
        return await writeClient.assets.upload('image', buffer, {
          filename: file.name,
        });
      });
    }

    console.log('✅ Upload successful:', asset._id);
    return NextResponse.json({ asset })

  } catch (error) {
    console.error('❌ Error uploading image:', error)
    
    // Provide more specific error messages
    let errorMessage = 'Failed to upload image';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('TIMEOUT')) {
        errorMessage = 'Upload timeout - please check your internet connection and try again';
        statusCode = 408;
      } else if (error.message.includes('network') || error.message.includes('fetch failed')) {
        errorMessage = 'Network error - please check your internet connection';
        statusCode = 503;
      } else if (error.message.includes('unauthorized') || error.message.includes('401')) {
        errorMessage = 'Authentication failed - please check API token';
        statusCode = 401;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error instanceof Error ? error.message : String(error) },
      { status: statusCode }
    )
  }
}