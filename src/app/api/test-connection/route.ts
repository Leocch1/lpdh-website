import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const testClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2023-12-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export async function GET() {
  try {
    console.log('🔍 Testing Sanity connection...');
    
    const startTime = Date.now();
    
    // Try a simple query to test connectivity
    const result = await testClient.fetch('*[_type == "scheduleLabPage"][0]._id');
    
    const duration = Date.now() - startTime;
    console.log(`✅ Connection successful in ${duration}ms`);
    
    return NextResponse.json({
      status: 'success',
      message: 'Sanity connection is working',
      duration: `${duration}ms`,
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      hasToken: !!process.env.SANITY_API_TOKEN,
      result: result ? 'Data found' : 'No data found'
    });

  } catch (error) {
    console.error('❌ Connection test failed:', error);
    
    let errorType = 'unknown';
    let userMessage = 'Connection failed';
    
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('TIMEOUT')) {
        errorType = 'timeout';
        userMessage = 'Connection timeout - network may be slow or blocked';
      } else if (error.message.includes('unauthorized') || error.message.includes('401')) {
        errorType = 'auth';
        userMessage = 'Authentication failed - check API token';
      } else if (error.message.includes('network') || error.message.includes('fetch failed')) {
        errorType = 'network';
        userMessage = 'Network error - check internet connection';
      } else if (error.message.includes('ENOTFOUND') || error.message.includes('DNS')) {
        errorType = 'dns';
        userMessage = 'DNS resolution failed - check network/firewall settings';
      }
    }
    
    return NextResponse.json({
      status: 'error',
      errorType,
      message: userMessage,
      details: error instanceof Error ? error.message : String(error),
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      hasToken: !!process.env.SANITY_API_TOKEN,
    }, { status: 500 });
  }
}
