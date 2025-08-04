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
        {
          name: 'ourServicesTab',
          title: 'Our Services Tab',
          type: 'object',
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
                          { title: 'Dentistry', value: 'dentistry' }
                        ]
                      },
                      validation: Rule => Rule.required()
                    },
                    {
                      name: 'details',
                      title: 'Service Details',
                      type: 'array',
                      of: [{ type: 'string' }],
                      validation: Rule => Rule.min(1).max(5)
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
                      order: 'order'
                    },
                    prepare({ title, subtitle, order }) {
                      return {
                        title: title,
                        subtitle: `${subtitle} (Order: ${order || 0})`
                      }
                    }
                  }
                }
              ]
            }
          ]
        },
        {
          name: 'clinicalServicesTab',
          title: 'Clinical Services Tab',
          type: 'object',
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
                          { title: 'Test Tube', value: 'testtube' }
                        ]
                      },
                      validation: Rule => Rule.required()
                    },
                    {
                      name: 'details',
                      title: 'Service Details',
                      type: 'array',
                      of: [{ type: 'string' }],
                      validation: Rule => Rule.min(1).max(5)
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
                      order: 'order'
                    },
                    prepare({ title, subtitle, order }) {
                      return {
                        title: title,
                        subtitle: `${subtitle} (Order: ${order || 0})`
                      }
                    }
                  }
                }
              ]
            }
          ]
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