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
export const HOMEPAGE_QUERY = `*[_type == "homepage"][0]{
  _id,
  carouselImages[]{
    _key,
    asset->,
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
  }
}`
