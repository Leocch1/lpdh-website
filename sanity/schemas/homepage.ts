import { defineType, defineField } from 'sanity'

export const homepage = defineType({
  name: 'homepage',
  title: 'Home',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'This is for internal reference only',
      initialValue: 'Homepage Content',
    }),
    defineField({
      name: 'carouselImages',
      title: 'Carousel Images',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'carouselImage',
          title: 'Carousel Image',
          fields: [
            {
              name: 'asset',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              validation: Rule => Rule.required(),
            },
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Important for accessibility and SEO',
              validation: Rule => Rule.required(),
            },
            {
              name: 'dataAiHint',
              title: 'AI Hint',
              type: 'string',
              description: 'Optional hint for AI processing',
            },
          ],
          preview: {
            select: {
              title: 'alt',
              media: 'asset',
            },
          },
        },
      ],
      validation: Rule => Rule.min(1).max(10).error('Please add 1-10 carousel images'),
    }),
    defineField({
      name: 'servicesSection',
      title: 'Services Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Our Services',
        },
        {
          name: 'description',
          title: 'Section Description',
          type: 'text',
          rows: 3,
          initialValue: 'We offer a wide range of specialties to meet your healthcare needs.',
        },
        {
          name: 'services',
          title: 'Services',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'service',
              title: 'Service',
              fields: [
                {
                  name: 'name',
                  title: 'Service Name',
                  type: 'string',
                  validation: Rule => Rule.required(),
                },
                {
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                  rows: 3,
                  validation: Rule => Rule.required(),
                },
                {
                  name: 'icon',
                  title: 'Icon Image',
                  type: 'image',
                  options: {
                    hotspot: true,
                  },
                  description: 'Upload an icon/image for this service (recommended size: 64x64px)',
                  validation: Rule => Rule.required(),
                },
                {
                  name: 'backgroundImage',
                  title: 'Background Image',
                  type: 'image',
                  options: {
                    hotspot: true,
                  },
                  description: 'Optional background image for the card (will be displayed with low opacity)',
                },
                {
                  name: 'linkUrl',
                  title: 'Service Link',
                  type: 'string',
                  description: 'Optional link for this service (e.g., /services/internal-medicine)',
                },
              ],
              preview: {
                select: {
                  title: 'name',
                  subtitle: 'description',
                  media: 'icon',
                },
              },
            },
          ],
          validation: Rule => Rule.min(1).max(8).error('Please add 1-8 services'),
        },
      ],
    }),
    defineField({
      name: 'legacySection',
      title: 'Legacy Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'A Legacy of Healing and Trust',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 4,
          initialValue: 'For decades, Las Piñas Doctors Hospital has been a cornerstone of health in our community. We combine state-of-the-art technology with a tradition of heartfelt care.',
        },
        {
          name: 'image',
          title: 'Section Image',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'linkText',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Learn More About Us',
        },
        {
          name: 'linkUrl',
          title: 'Button Link',
          type: 'string',
          initialValue: '/about',
          description: 'Use relative URLs like /about or absolute URLs like https://example.com',
        },
      ],
    }),
    defineField({
      name: 'hmoPartnersSection',
      title: 'HMO Partners Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Our Accredited HMO Partners',
        },
        {
          name: 'subtitle1',
          title: 'Subtitle Line 1',
          type: 'string',
          description: 'First line below the title',
          initialValue: 'We accept various health insurance plans and HMO partnerships',
        },
        {
          name: 'subtitle2',
          title: 'Subtitle Line 2',
          type: 'string',
          description: 'Second line below the title',
          initialValue: 'to make quality healthcare accessible to all patients',
        },
        {
          name: 'subtitle3',
          title: 'Subtitle Line 3',
          type: 'string',
          description: 'Third line below the title',
          initialValue: 'Contact us to verify your insurance coverage and benefits',
        },
        {
          name: 'image',
          title: 'HMO Partners Image',
          type: 'image',
          options: {
            hotspot: true,
          },
          description: 'Upload the HMO partners logos image',
        },
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          initialValue: 'HMO logos',
          description: 'Alt text for the HMO partners image',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
