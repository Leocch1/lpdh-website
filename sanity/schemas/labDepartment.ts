import { defineType, defineField } from 'sanity'

export const labDepartment = defineType({
  name: 'labDepartment',
  title: 'Lab Department',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Department Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of what this lab department does'
    }),
    defineField({
      name: 'email',
      title: 'Department Email',
      type: 'email',
      validation: Rule => Rule.required(),
      description: 'Email address where lab appointment notifications will be sent'
    }),
    defineField({
      name: 'backupEmail',
      title: 'Backup Email (Optional)',
      type: 'email',
      description: 'Secondary email address for notifications'
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Department Phone',
      type: 'string',
      description: 'Contact phone number for this lab department'
    }),
    defineField({
      name: 'location',
      title: 'Department Location',
      type: 'string',
      description: 'Floor or building location within the facility'
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
      description: 'Uncheck to deactivate this lab department'
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this lab department appears in lists'
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      isActive: 'isActive'
    },
    prepare({ title, subtitle, isActive }) {
      return {
        title: `${title}${!isActive ? ' (Inactive)' : ''}`,
        subtitle: subtitle || 'No email set'
      }
    }
  },
  orderings: [
    {
      title: 'Order',
      name: 'order',
      by: [
        { field: 'order', direction: 'asc' },
        { field: 'name', direction: 'asc' }
      ]
    }
  ]
})