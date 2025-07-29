import { defineType, defineField } from 'sanity'

export const careers = defineType({
  name: 'careers',
  title: 'Careers Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'This is for internal reference only',
      initialValue: 'Careers Page Content',
    }),
    defineField({
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'image',
          options: {
            hotspot: true,
          },
          validation: Rule => Rule.required(),
        },
        {
          name: 'heroTitle',
          title: 'Hero Title',
          type: 'string',
          initialValue: 'Join us in delivering premium patient care.',
          validation: Rule => Rule.required(),
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Explore Careers',
          validation: Rule => Rule.required(),
        },
      ],
    }),
    defineField({
      name: 'jobListingsSection',
      title: 'Job Listings Section',
      type: 'object',
      fields: [
        {
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Find Careers',
          validation: Rule => Rule.required(),
        },
        {
          name: 'searchPlaceholder',
          title: 'Search Placeholder',
          type: 'string',
          initialValue: 'Search',
        },
        {
          name: 'categoryPlaceholder',
          title: 'Category Placeholder',
          type: 'string',
          initialValue: 'Select Category',
        },
        {
          name: 'categories',
          title: 'Job Categories',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'value',
                  title: 'Value',
                  type: 'string',
                  validation: Rule => Rule.required(),
                },
                {
                  name: 'label',
                  title: 'Label',
                  type: 'string',
                  validation: Rule => Rule.required(),
                },
              ],
            },
          ],
          initialValue: [
            { value: 'nursing', label: 'Nursing' },
            { value: 'allied-health', label: 'Allied Health' },
            { value: 'admin', label: 'Administration' },
            { value: 'support', label: 'Support Services' },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare(selection) {
      return {
        title: selection.title || 'Careers Page',
      }
    },
  },
})
