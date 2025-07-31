import { defineType, defineField } from 'sanity'

export const jobCategory = defineType({
  name: 'jobCategory',
  title: 'Job Category',
  type: 'document',
  fields: [
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Used for filtering (lowercase, no spaces)',
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Display name for the category',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Optional description of this job category',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
      description: 'Order in which categories appear (lower numbers first)',
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle to show/hide this category',
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'value',
      isActive: 'isActive',
    },
    prepare(selection) {
      const { title, subtitle, isActive } = selection
      return {
        title: title,
        subtitle: `${subtitle}${isActive ? '' : ' (Inactive)'}`,
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'order',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})