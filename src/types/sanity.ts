export interface CarouselImage {
  _key: string
  asset: {
    _id: string
    url: string
  }
  alt: string
  dataAiHint?: string
}

export interface LegacySection {
  title: string
  description: string
  image: {
    asset: {
      _id: string
      url: string
    }
  }
  linkText: string
  linkUrl: string
}

export interface HmoPartnersSection {
  title: string
  image: {
    asset: {
      _id: string
      url: string
    }
  }
  alt: string
}

export interface JobCategory {
  value: string
  label: string
}

export interface HeroSection {
  backgroundImage: {
    asset: {
      _id: string
      url: string
    }
  }
  heroTitle: string
  buttonText: string
}

export interface JobListingsSection {
  sectionTitle: string
  searchPlaceholder: string
  categoryPlaceholder: string
  categories: JobCategory[]
}

export interface CareersData {
  _id: string
  heroSection: HeroSection
  jobListingsSection: JobListingsSection
}

export interface JobOpening {
  _id: string
  title: string
  slug: {
    current: string
  }
  department: string
  type: string
  category: string
  summary: string
  duties?: { text: string }[]
  qualifications?: { text: string }[]
  isActive: boolean
}

export interface HomepageData {
  _id: string
  carouselImages: CarouselImage[]
  legacySection: LegacySection
  hmoPartnersSection: HmoPartnersSection
}

export interface SanityImage {
  asset: {
    _id: string
    url: string
  }
  alt?: string
}

export interface Doctor {
  _id: string
  name: string
  specialty: {
    _id: string
    name: string
    slug: {
      current: string
    }
  }
  medicalSpecialty?: {
    _id: string
    name: string
    slug: {
      current: string
    }
    department: {
      _id: string
      name: string
    }
  }[]
  image?: SanityImage
  strictlyByAppointment: boolean
  roomNumber?: string
  phone: string
  availableDays: string[]
  rating?: number
  secretary?: string
  secretary2?: string
}

export interface Specialty {
  _id: string
  name: string
  slug: {
    current: string
  }
  department: {
    _id: string
    name: string
    slug: {
      current: string
    }
  }
  description?: string
}

export interface Department {
  _id: string
  name: string
  slug: {
    current: string
  }
  description?: string
  icon?: SanityImage
}

export interface AboutPage {
  _id: string
  title: string
  subtitle: string
  description: string
  heroImage?: SanityImage
  vision: string
  mission: string[]
  coreValues: {
    letter: string
    value: string
  }[]
}

export interface HealthAdvisory {
  _id: string
  title: string
  description?: string
  image?: SanityImage
  link?: string
  isActive: boolean
  order: number
}

export interface NewsUpdate {
  _id: string
  title: string
  image?: SanityImage
  link?: string
  isActive: boolean
  order: number
}

export interface HistoryImage {
  _key: string
  image: {
    asset: {
      _id: string
      url: string
    }
  }
  alt: string
  aiHint?: string
}

export interface HistorySection {
  _key: string
  title: string
  content: string
}

export interface HistoryHeroSection {
  headline: string
  images: HistoryImage[]
  description: string
  newEraTitle: string
  newEraContent: string
}

export interface HistoryPage {
  _id: string
  title: string
  heroSection: HistoryHeroSection
  historySections: HistorySection[]
}
