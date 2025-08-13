import { client } from './sanity'

/**
 * Fetch data from Sanity with automatic revalidation tags
 * This ensures that when content is updated in Sanity Studio,
 * the website automatically updates without manual refresh
 */
export async function fetchWithTags<T>(
  query: string,
  params: Record<string, any> = {},
  tags: string[] = []
): Promise<T> {
  const data = await client.fetch(query, params, {
    next: {
      tags: ['sanity-content', ...tags],
      revalidate: 60, // Fallback revalidation every 60 seconds
    },
  })

  return data
}

/**
 * Get revalidation tags for common document types
 */
export function getDocumentTags(documentType: string, slug?: string): string[] {
  const baseTags = ['sanity-content', documentType]
  
  if (slug) {
    baseTags.push(`${documentType}-${slug}`)
  }
  
  return baseTags
}

/**
 * Revalidate specific content on the client side
 * This can be used for optimistic updates
 */
export async function revalidateContent(documentType: string, slug?: string) {
  try {
    const response = await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _type: documentType,
        slug: slug ? { current: slug } : undefined,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to revalidate: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('✅ Content revalidated:', result)
    return result
  } catch (error) {
    console.error('❌ Failed to revalidate content:', error)
    throw error
  }
}

/**
 * Common query tags for different page types
 */
export const QUERY_TAGS = {
  HOMEPAGE: ['homepage'],
  ABOUT: ['aboutPage'],
  HISTORY: ['historyPage'],
  SERVICES: ['servicesPage'],
  CAREERS: ['careers'],
  JOB_OPENINGS: ['jobOpening'],
  DOCTORS: ['doctor'],
  LAB_TESTS: ['labTest'],
  LAB_DEPARTMENTS: ['labDepartment'],
  SCHEDULE_LAB: ['scheduleLabPage'],
  ADMISSION: ['admission'],
  NEWS: ['newsUpdate', 'healthAdvisory'],
}
