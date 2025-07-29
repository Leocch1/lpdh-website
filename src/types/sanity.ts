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
