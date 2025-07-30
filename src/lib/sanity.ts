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

// Doctors query
export const DOCTORS_QUERY = `*[_type == "doctor" && isActive == true] | order(name asc){
  _id,
  name,
  specialty->{
    _id,
    name,
    slug
  },
  medicalSpecialty[]->{
    _id,
    name,
    slug,
    department->{
      _id,
      name
    }
  },
  image{
    asset->
  },
  strictlyByAppointment,
  roomNumber,
  phone,
  availableDays,
  rating,
  secretary,
  secretary2
}`

// Departments query
export const DEPARTMENTS_QUERY = `*[_type == "department" && isActive == true] | order(order asc){
  _id,
  name,
  slug,
  description,
  icon{
    asset->,
    alt
  }
}`

// Doctors by specialty query
export const DOCTORS_BY_SPECIALTY_QUERY = `*[_type == "doctor" && isActive == true && specialty->name == $specialty] | order(name asc){
  _id,
  name,
  specialty->{
    _id,
    name,
    slug
  },
  medicalSpecialty[]->{
    _id,
    name,
    slug,
    department->{
      _id,
      name
    }
  },
  image{
    asset->
  },
  strictlyByAppointment,
  roomNumber,
  phone,
  availableDays,
  rating,
  secretary,
  secretary2
}`

// Specialties query
export const SPECIALTIES_QUERY = `*[_type == "specialty" && isActive == true] | order(order asc){
  _id,
  name,
  slug,
  department->{
    _id,
    name,
    slug
  },
  description
}`

// Specialties by department query
export const SPECIALTIES_BY_DEPARTMENT_QUERY = `*[_type == "specialty" && isActive == true && department->name == $department] | order(order asc){
  _id,
  name,
  slug,
  department->{
    _id,
    name,
    slug
  },
  description
}`

// About page query
export const ABOUT_PAGE_QUERY = `*[_type == "aboutPage"] | order(_updatedAt desc) [0]{
  _id,
  title,
  subtitle,
  description,
  heroImage{
    asset->,
    alt
  },
  vision,
  mission,
  coreValues[]{
    letter,
    value
  }
}`

// Health advisories query
export const HEALTH_ADVISORIES_QUERY = `*[_type == "healthAdvisory" && isActive == true] | order(order asc){
  _id,
  title,
  description,
  image{
    asset->,
    alt
  },
  link
}`

// News updates query
export const NEWS_UPDATES_QUERY = `*[_type == "newsUpdate" && isActive == true] | order(order asc){
  _id,
  title,
  image{
    asset->,
    alt
  },
  link
}`
