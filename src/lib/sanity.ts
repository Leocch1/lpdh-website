import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-12-01',
  useCdn: false, // Set to true in production for better performance
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// GROQ queries
export const HOMEPAGE_QUERY = `*[_type == "homepage"] | order(_updatedAt desc) [0]{
  _id,
  title,
  carouselImages[]{
    _key,
    asset,
    alt,
    dataAiHint
  },
  legacySection{
    title,
    description,
    image{
      asset->
    },
    linkText,
    linkUrl
  },
  hmoPartnersSection{
    title,
    image{
      asset->
    },
    alt
  }
}`

// Careers page query
export const CAREERS_QUERY = `*[_type == "careers"][0]{
  _id,
  heroSection{
    backgroundImage{
      asset->
    },
    heroTitle,
    buttonText
  },
  jobListingsSection{
    sectionTitle,
    searchPlaceholder,
    categoryPlaceholder,
    categories
  }
}`

// Job openings query
export const JOB_OPENINGS_QUERY = `*[_type == "jobOpening" && isActive == true] | order(_createdAt desc){
  _id,
  title,
  slug,
  department,
  type,
  category,
  summary,
  duties[]{
    text
  },
  qualifications[]{
    text
  },
  isActive
}`

// Single job opening query
export const JOB_OPENING_QUERY = `*[_type == "jobOpening" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  department,
  type,
  category,
  summary,
  duties[]{
    text
  },
  qualifications[]{
    text
  },
  isActive
}`

// Simple test query to check if documents exist
export const TEST_QUERY = `*[_type == "homepage"]`
