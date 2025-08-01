import { defineType, defineField } from 'sanity'

export const admission = defineType({
  name: 'admission',
  title: 'Admission Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'This is for internal reference only',
      initialValue: 'Admission Page Content',
    }),
    defineField({
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Main Title',
          type: 'string',
          initialValue: 'Las Piñas Doctors Hospital',
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string',
          initialValue: 'Direct Admission',
        },
      ],
    }),
    defineField({
      name: 'admissionInfo',
      title: 'Main Admission Information',
      type: 'object',
      fields: [
        {
          name: 'description',
          title: 'Description',
          type: 'array',
          of: [{ type: 'text' }],
          description: 'Paragraphs describing the admission procedure',
        },
        {
          name: 'guidelines',
          title: 'Guidelines',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'guideline',
              title: 'Guideline',
              fields: [
                {
                  name: 'text',
                  title: 'Guideline Text',
                  type: 'text',
                }
              ],
              preview: {
                select: {
                  title: 'text'
                },
                prepare(selection) {
                  const { title } = selection
                  return {
                    title: title ? (title.length > 60 ? title.substring(0, 60) + '...' : title) : 'Empty guideline'
                  }
                }
              }
            }
          ],
          description: 'List of guidelines for admission',
        },
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Additional Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'section',
          title: 'Section',
          fields: [
            {
              name: 'sectionTitle',
              title: 'Section Title',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'sectionType',
              title: 'Section Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Standard Section', value: 'standard' },
                  { title: 'Guidelines Section', value: 'guidelines' },
                  { title: 'Info with Image', value: 'imageInfo' },
                  { title: 'Emergency Info', value: 'emergency' },
                ],
              },
              initialValue: 'standard',
              validation: Rule => Rule.required(),
            },
            {
              name: 'backgroundColor',
              title: 'Background Color',
              type: 'string',
              options: {
                list: [
                  { title: 'White Background', value: 'white' },
                  { title: 'Secondary Background', value: 'secondary' },
                ],
              },
              initialValue: 'white',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'array',
              of: [{ type: 'text' }],
              description: 'Paragraphs for this section',
            },
            {
              name: 'guidelines',
              title: 'Guidelines/List Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'guideline',
                  title: 'Guideline',
                  fields: [
                    {
                      name: 'text',
                      title: 'Guideline Text',
                      type: 'text',
                    }
                  ],
                  preview: {
                    select: {
                      title: 'text'
                    },
                    prepare(selection) {
                      const { title } = selection
                      return {
                        title: title ? (title.length > 60 ? title.substring(0, 60) + '...' : title) : 'Empty guideline'
                      }
                    }
                  }
                }
              ],
              description: 'List items for guidelines or bullet points',
              hidden: ({ parent }) => parent?.sectionType === 'standard',
            },
            {
              name: 'image',
              title: 'Section Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              description: 'Optional image for this section',
              hidden: ({ parent }) => parent?.sectionType !== 'imageInfo',
            },
            {
              name: 'imagePosition',
              title: 'Image Position',
              type: 'string',
              options: {
                list: [
                  { title: 'Left', value: 'left' },
                  { title: 'Right', value: 'right' },
                  { title: 'Center', value: 'center' },
                ],
              },
              initialValue: 'center',
              hidden: ({ parent }) => parent?.sectionType !== 'imageInfo',
            },
            {
              name: 'isActive',
              title: 'Show Section',
              type: 'boolean',
              initialValue: true,
              description: 'Toggle to show/hide this section',
            },
            {
              name: 'order',
              title: 'Display Order',
              type: 'number',
              initialValue: 1,
              description: 'Order in which sections appear (lower numbers first)',
            },
          ],
          preview: {
            select: {
              title: 'sectionTitle',
              type: 'sectionType',
              order: 'order',
              isActive: 'isActive',
            },
            prepare(selection) {
              const { title, type, order, isActive } = selection
              return {
                title: title || 'Untitled Section',
                subtitle: `${type || 'standard'} - Order: ${order || 1}${isActive ? '' : ' (Hidden)'}`,
              }
            },
          },
        }
      ],
      description: 'Add custom sections like COVID guidelines, emergency procedures, etc.',
    }),
    defineField({
      name: 'dataPrivacySection',
      title: 'Data Privacy Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Main Title',
          type: 'string',
          initialValue: 'Data Privacy and Patient\'s Rights',
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string',
          initialValue: 'Data Privacy',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          initialValue: 'Las Piñas Doctors Hospital is committed to the protection of the privacy of the patient\'s personal data in compliance with the Republic Act No. 10173 or the Data Privacy Act of 2012. The hospital guarantees that all data collected will be managed with safety and confidentiality.',
        },
        {
          name: 'isActive',
          title: 'Show Section',
          type: 'boolean',
          initialValue: true,
        },
      ],
    }),
    defineField({
      name: 'philhealthSection',
      title: 'PhilHealth Section',
      type: 'object',
      fields: [
        {
          name: 'logo',
          title: 'PhilHealth Logo',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          initialValue: 'Las Piñas Doctors Hospital is PhilHealth Accredited. All PhilHealth members or their representatives are encouraged to consult at our Billing Department to accommodate queries, for assessment of eligibility and other related concerns.',
        },
        {
          name: 'isActive',
          title: 'Show Section',
          type: 'boolean',
          initialValue: true,
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
        title: selection.title || 'Admission Page',
      }
    },
  },
  orderings: [
    {
      title: 'Section Order',
      name: 'sectionOrder',
      by: [{ field: 'sections.order', direction: 'asc' }],
    },
  ],
})