import { defineType, defineField } from 'sanity'

export const jobOpening = defineType({
  name: 'jobOpening',
  title: 'Job Opening',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Job Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 200,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'department',
      title: 'Department',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Employment Type',
      type: 'string',
      options: {
        list: [
          { title: 'Full-time', value: 'full-time' },
          { title: 'Part-time', value: 'part-time' },
          { title: 'Contract', value: 'contract' },
          { title: 'Temporary', value: 'temporary' },
        ],
      },
      initialValue: 'full-time',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Nursing', value: 'nursing' },
          { title: 'Allied Health', value: 'allied-health' },
          { title: 'Administration', value: 'admin' },
          { title: 'Support Services', value: 'support' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Job Summary',
      type: 'text',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'duties',
      title: 'Duties & Responsibilities',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'duty',
          title: 'Duty',
          fields: [
            {
              name: 'text',
              title: 'Duty Description',
              type: 'text',
              rows: 3,
            }
          ],
          preview: {
            select: {
              title: 'text'
            },
            prepare(selection) {
              const { title } = selection
              return {
                title: title ? (title.length > 60 ? title.substring(0, 60) + '...' : title) : 'Empty duty'
              }
            }
          }
        }
      ],
    }),
    defineField({
      name: 'qualifications',
      title: 'Qualifications',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'qualification',
          title: 'Qualification',
          fields: [
            {
              name: 'text',
              title: 'Qualification Description',
              type: 'text',
              rows: 3,
            }
          ],
          preview: {
            select: {
              title: 'text'
            },
            prepare(selection) {
              const { title } = selection
              return {
                title: title ? (title.length > 60 ? title.substring(0, 60) + '...' : title) : 'Empty qualification'
              }
            }
          }
        }
      ],
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle to show/hide this job opening',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      department: 'department',
      type: 'type',
      isActive: 'isActive',
    },
    prepare(selection) {
      const { title, department, type, isActive } = selection
      return {
        title: title,
        subtitle: `${department} - ${type}${isActive ? '' : ' (Inactive)'}`,
      }
    },
  },
})
