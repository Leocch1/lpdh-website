import { client, urlFor, HOMEPAGE_QUERY } from "@/lib/sanity"
import { fetchWithTags, QUERY_TAGS } from "@/lib/revalidation"
import { HomepageData } from "@/types/sanity"

// This function will automatically fetch data with revalidation tags
async function getHomepageData(): Promise<HomepageData | null> {
  try {
    // Fetch data with automatic revalidation tags
    const data = await fetchWithTags<HomepageData>(
      HOMEPAGE_QUERY,
      {},
      [...QUERY_TAGS.HOMEPAGE]
    )
    
    return data
  } catch (error) {
    console.error('Error fetching homepage data:', error)
    return null
  }
}

// Example server component that will automatically update when Sanity content changes
export default async function ServerHomepage() {
  const homepageData = await getHomepageData()
  
  if (!homepageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Welcome to LPDH Hospital</h1>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    )
  }

  // Process hero images
  const heroImages = homepageData.carouselImages?.filter(img => img?.asset).map(img => ({
    src: urlFor(img.asset).width(1600).height(600).url(),
    alt: img.alt,
    dataAiHint: img.dataAiHint || "hospital building"
  })) || []

  return (
    <div className="min-h-screen">
      {/* Hero Carousel Section */}
      <section className="relative h-[70vh] overflow-hidden">
        {heroImages.length > 0 && (
          <div className="relative h-full">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className="absolute inset-0 w-full h-full"
                style={{
                  backgroundImage: `url(${image.src})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white max-w-4xl px-4">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                      Lapaz Doctors Hospital
                    </h1>
                    <p className="text-lg md:text-xl mb-8">
                      Committed to Excellence in Healthcare
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Services Section */}
      {homepageData.servicesSection && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {homepageData.servicesSection.title}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {homepageData.servicesSection.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {homepageData.servicesSection.services?.map((service, index) => (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                  {service.icon && (
                    <div className="mb-4">
                      <img 
                        src={urlFor(service.icon).width(64).height(64).url()} 
                        alt={service.name || 'Service icon'}
                        className="w-16 h-16 mx-auto"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              )) || []}
            </div>
          </div>
        </section>
      )}

      {/* Legacy Section */}
      {homepageData.legacySection && (
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  {homepageData.legacySection.title}
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  {homepageData.legacySection.description}
                </p>
                {homepageData.legacySection.linkUrl && (
                  <a 
                    href={homepageData.legacySection.linkUrl}
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {homepageData.legacySection.linkText || 'Learn More'}
                  </a>
                )}
              </div>
              {homepageData.legacySection.image && (
                <div className="lg:order-first">
                  <img
                    src={urlFor(homepageData.legacySection.image).width(600).height(400).url()}
                    alt="Legacy"
                    className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* HMO Partners Section */}
      {homepageData.hmoPartnersSection && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {homepageData.hmoPartnersSection.title}
              </h2>
            </div>
            
            <div className="flex items-center justify-center">
              {homepageData.hmoPartnersSection.image && (
                <img
                  src={urlFor(homepageData.hmoPartnersSection.image).width(800).height(400).url()}
                  alt={homepageData.hmoPartnersSection.alt || 'HMO Partners'}
                  className="max-w-full h-auto"
                />
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
