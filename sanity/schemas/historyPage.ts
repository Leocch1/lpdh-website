import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'historyPage',
  title: 'History Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        defineField({
          name: 'headline',
          title: 'Headline',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'images',
          title: 'Hero Images',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'image',
                  title: 'Image',
                  type: 'image',
                  options: {
                    hotspot: true,
                  },
                }),
                defineField({
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'aiHint',
                  title: 'AI Hint',
                  type: 'string',
                  description: 'Hint for AI about the image content',
                }),
              ],
            },
          ],
          validation: (Rule) => Rule.max(3),
        }),
        defineField({
          name: 'description',
          title: 'Opening Description',
          type: 'text',
          rows: 4,
        }),
        defineField({
          name: 'newEraTitle',
          title: 'New Era Section Title',
          type: 'string',
        }),
        defineField({
          name: 'newEraContent',
          title: 'New Era Content',
          type: 'text',
          rows: 4,
        }),
      ],
    }),
    defineField({
      name: 'historySections',
      title: 'History Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Section Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'content',
              title: 'Section Content',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              content: 'content',
            },
            prepare({ title, content }) {
              return {
                title,
                subtitle: content?.substring(0, 100) + '...',
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title: title || 'History Page',
      }
    },
  },
})
