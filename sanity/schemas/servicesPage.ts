import { defineType, defineField } from 'sanity'

export const servicesPage = defineType({
  name: 'servicesPage',
  title: 'Services Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          validation: Rule => Rule.required()
        },
        {
          name: 'heroImage',
          title: 'Hero Image',
          type: 'image',
          options: {
            hotspot: true
          }
        }
      ]
    }),
    defineField({
      name: 'experienceSection',
      title: 'Experience Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'image',
          options: {
            hotspot: true
          }
        }
      ]
    }),
    defineField({
      name: 'whatWeOfferSection',
      title: 'What We Offer Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'description',
          title: 'Section Description',
          type: 'text',
          validation: Rule => Rule.required()
        },
        // Legacy fields for backward compatibility
        {
          name: 'ourServicesTab',
          title: 'Our Services Tab (Legacy)',
          type: 'object',
          description: '⚠️ Legacy field - Please migrate to Service Tabs below',
          fields: [
            {
              name: 'tabTitle',
              title: 'Tab Title',
              type: 'string',
              initialValue: 'Our Services'
            },
            {
              name: 'services',
              title: 'Medical Services',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'title',
                      title: 'Service Title',
                      type: 'string',
                      validation: Rule => Rule.required()
                    },
                    {
                      name: 'subtitle',
                      title: 'Subtitle',
                      type: 'string',
                      validation: Rule => Rule.required()
                    },
                    {
                      name: 'icon',
                      title: 'Icon',
                      type: 'string',
                      options: {
                        list: [
                          { title: 'Stethoscope', value: 'stethoscope' },
                          { title: 'Eye', value: 'eye' },
                          { title: 'Bone', value: 'bone' },
                          { title: 'Smile', value: 'smile' },
                          { title: 'Pill', value: 'pill' },
                          { title: 'Syringe', value: 'syringe' },
                          { title: 'ENT', value: 'ent' },
                          { title: 'Lung', value: 'lung' },
                          { title: 'OB Gyne', value: 'obgyne' },
                          { title: 'Dentistry', value: 'dentistry' },
                          { title: 'Test Tube', value: 'testtube' },
                          { title: 'Heart', value: 'heart' },
                          { title: 'Brain', value: 'brain' },
                          { title: 'Shield', value: 'shield' },
                          { title: 'Activity', value: 'activity' }
                        ]
                      },
                      validation: Rule => Rule.required()
                    },
                    {
                      name: 'details',
                      title: 'Service Details',
                      type: 'array',
                      of: [{ type: 'string' }],
                      validation: Rule => Rule.min(1).max(15)
                    },
                    {
                      name: 'order',
                      title: 'Display Order',
                      type: 'number',
                      validation: Rule => Rule.min(0)
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          name: 'clinicalServicesTab',
          title: 'Clinical Services Tab (Legacy)',
          type: 'object',
          description: '⚠️ Legacy field - Please migrate to Service Tabs below',
          fields: [
            {
              name: 'tabTitle',
              title: 'Tab Title',
              type: 'string',
              initialValue: 'Clinical Services'
            },
            {
              name: 'services',
              title: 'Clinical Services',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'title',
                      title: 'Service Title',
                      type: 'string',
                      validation: Rule => Rule.required()
                    },
                    {
                      name: 'subtitle',
                      title: 'Subtitle',
                      type: 'string',
                      validation: Rule => Rule.required()
                    },
                    {
                      name: 'icon',
                      title: 'Icon',
                      type: 'string',
                      options: {
                        list: [
                          { title: 'Stethoscope', value: 'stethoscope' },
                          { title: 'Eye', value: 'eye' },
                          { title: 'Bone', value: 'bone' },
                          { title: 'Pill', value: 'pill' },
                          { title: 'Test Tube', value: 'testtube' },
                          { title: 'Heart', value: 'heart' },
                          { title: 'Brain', value: 'brain' },
                          { title: 'Shield', value: 'shield' },
                          { title: 'Activity', value: 'activity' }
                        ]
                      },
                      validation: Rule => Rule.required()
                    },
                    {
                      name: 'details',
                      title: 'Service Details',
                      type: 'array',
                      of: [{ type: 'string' }],
                      validation: Rule => Rule.min(1).max(15)
                    },
                    {
                      name: 'order',
                      title: 'Display Order',
                      type: 'number',
                      validation: Rule => Rule.min(0)
                    }
                  ]
                }
              ]
            }
          ]
        },
        // New flexible tabs system
        {
          name: 'serviceTabs',
          title: 'Service Tabs (New System)',
          type: 'array',
          description: '✅ Use this new flexible system for adding multiple service tabs',
          of: [
            {
              type: 'object',
              name: 'serviceTab',
              title: 'Service Tab',
              fields: [
                {
                  name: 'tabTitle',
                  title: 'Tab Title',
                  type: 'string',
                  validation: Rule => Rule.required()
                },
                {
                  name: 'tabKey',
                  title: 'Tab Key',
                  type: 'string',
                  description: 'Unique identifier for this tab (used in URLs, no spaces or special characters)',
                  validation: Rule => Rule.required().regex(/^[a-z0-9-]+$/, 'Must be lowercase letters, numbers, and hyphens only')
                },
                {
                  name: 'tabDescription',
                  title: 'Tab Description',
                  type: 'text',
                  description: 'Optional description for this tab'
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
                          name: 'title',
                          title: 'Service Title',
                          type: 'string',
                          validation: Rule => Rule.required()
                        },
                        {
                          name: 'subtitle',
                          title: 'Subtitle',
                          type: 'string',
                          validation: Rule => Rule.required()
                        },
                        {
                          name: 'icon',
                          title: 'Icon',
                          type: 'string',
                          options: {
                            list: [
                              { title: 'Stethoscope', value: 'stethoscope' },
                              { title: 'Eye', value: 'eye' },
                              { title: 'Bone', value: 'bone' },
                              { title: 'Smile', value: 'smile' },
                              { title: 'Pill', value: 'pill' },
                              { title: 'Syringe', value: 'syringe' },
                              { title: 'ENT', value: 'ent' },
                              { title: 'Lung', value: 'lung' },
                              { title: 'OB Gyne', value: 'obgyne' },
                              { title: 'Dentistry', value: 'dentistry' },
                              { title: 'Test Tube', value: 'testtube' },
                              { title: 'Heart', value: 'heart' },
                              { title: 'Brain', value: 'brain' },
                              { title: 'Shield', value: 'shield' },
                              { title: 'Activity', value: 'activity' }
                            ]
                          },
                          validation: Rule => Rule.required()
                        },
                        {
                          name: 'details',
                          title: 'Service Details',
                          type: 'array',
                          of: [{ type: 'string' }],
                          validation: Rule => Rule.min(1).max(15)
                        },
                        {
                          name: 'order',
                          title: 'Display Order',
                          type: 'number',
                          validation: Rule => Rule.min(0)
                        }
                      ],
                      preview: {
                        select: {
                          title: 'title',
                          subtitle: 'subtitle',
                          order: 'order',
                          icon: 'icon'
                        },
                        prepare({ title, subtitle, order, icon }) {
                          return {
                            title: title,
                            subtitle: `${subtitle} (Order: ${order || 0})`,
                            media: icon ? `🔧` : undefined
                          }
                        }
                      }
                    }
                  ],
                  validation: Rule => Rule.min(1).error('Each tab must have at least one service')
                },
                {
                  name: 'order',
                  title: 'Tab Order',
                  type: 'number',
                  description: 'Order in which this tab appears',
                  validation: Rule => Rule.min(0)
                }
              ],
              preview: {
                select: {
                  title: 'tabTitle',
                  tabKey: 'tabKey',
                  serviceCount: 'services.length',
                  order: 'order'
                },
                prepare({ title, tabKey, serviceCount, order }) {
                  return {
                    title: title,
                    subtitle: `${tabKey} • ${serviceCount || 0} service${serviceCount !== 1 ? 's' : ''} • Order: ${order || 0}`
                  }
                }
              }
            }
          ],
          validation: Rule => Rule.max(6).error('Maximum 6 tabs allowed')
        }
      ]
    }),
    defineField({
      name: 'ctaSection',
      title: 'Call to Action Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          validation: Rule => Rule.required()
        },
        {
          name: 'primaryButton',
          title: 'Primary Button',
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Button Text',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'link',
              title: 'Button Link',
              type: 'string',
              validation: Rule => Rule.required()
            }
          ]
        },
        {
          name: 'secondaryButton',
          title: 'Secondary Button',
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Button Text',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'link',
              title: 'Button Link',
              type: 'string',
              validation: Rule => Rule.required()
            }
          ]
        }
      ]
    })
  ],
  preview: {
    prepare() {
      return {
        title: 'Services Page'
      }
    }
  }
})