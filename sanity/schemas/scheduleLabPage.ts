import { defineType, defineField } from 'sanity'

export const scheduleLabPage = defineType({
  name: 'scheduleLabPage',
  title: 'Schedule Lab Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Schedule Lab Page',
      readOnly: true
    }),
    defineField({
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Hero Title',
          type: 'string',
          validation: Rule => Rule.required()
        }),
        defineField({
          name: 'subtitle',
          title: 'Hero Subtitle',
          type: 'text',
          validation: Rule => Rule.required()
        }),
        defineField({
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'image',
          options: {
            hotspot: true
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text'
            }
          ]
        })
      ]
    }),
    defineField({
      name: 'mainContent',
      title: 'Main Content',
      type: 'object',
      fields: [
        defineField({
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
          validation: Rule => Rule.required()
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text'
        })
      ]
    }),
    defineField({
      name: 'infoSection',
      title: 'Information Section',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          validation: Rule => Rule.required()
        }),
        defineField({
          name: 'infoCards',
          title: 'Information Cards',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'title',
                  title: 'Card Title',
                  type: 'string',
                  validation: Rule => Rule.required()
                }),
                defineField({
                  name: 'description',
                  title: 'Card Description',
                  type: 'text',
                  validation: Rule => Rule.required()
                }),
                defineField({
                  name: 'icon',
                  title: 'Icon',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Preparation Instructions', value: 'preparation' },
                      { title: 'Results Timeline', value: 'timeline' },
                      { title: 'Quality Assurance', value: 'quality' }
                    ]
                  },
                  validation: Rule => Rule.required()
                })
              ],
              preview: {
                select: {
                  title: 'title',
                  subtitle: 'icon'
                }
              }
            }
          ],
          validation: Rule => Rule.max(3).error('Maximum 3 info cards allowed')
        })
      ]
    })
  ],
  preview: {
    select: {
      title: 'title'
    }
  }
})