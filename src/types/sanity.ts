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

export interface HomepageData {
  _id: string
  carouselImages: CarouselImage[]
  legacySection: LegacySection
}
