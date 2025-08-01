import { defineType, defineField } from 'sanity'

export const labTest = defineType({
  name: 'labTest',
  title: 'Lab Test',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Test Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Blood Tests', value: 'Blood Tests' },
          { title: 'Urine Tests', value: 'Urine Tests' },
          { title: 'Imaging', value: 'Imaging' },
          { title: 'Special Tests', value: 'Special Tests' },
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'duration',
      title: 'Test Duration',
      type: 'string',
      description: 'e.g., "2-4 hours", "Same day", "1-2 days"',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'resultTime',
      title: 'Result Time',
      type: 'string',
      description: 'e.g., "24-48 hours", "Same day", "1-2 days"'
    }),
    defineField({
      name: 'preparationNotes',
      title: 'Preparation Notes',
      type: 'text',
      description: 'Special preparation instructions for patients'
    }),
    defineField({
      name: 'availableDays',
      title: 'Available Days',
      type: 'array',
      of: [
        {
          type: 'string',
          options: {
            list: [
              { title: 'Monday', value: 'Monday' },
              { title: 'Tuesday', value: 'Tuesday' },
              { title: 'Wednesday', value: 'Wednesday' },
              { title: 'Thursday', value: 'Thursday' },
              { title: 'Friday', value: 'Friday' },
              { title: 'Saturday', value: 'Saturday' },
              { title: 'Sunday', value: 'Sunday' },
            ]
          }
        }
      ],
      validation: Rule => Rule.min(1).error('At least one day must be selected')
    }),
    defineField({
      name: 'availableTimeSlots',
      title: 'Available Time Slots',
      type: 'array',
      of: [
        {
          type: 'string',
          options: {
            list: [
              { title: '8:00 AM', value: '8:00 AM' },
              { title: '9:00 AM', value: '9:00 AM' },
              { title: '10:00 AM', value: '10:00 AM' },
              { title: '11:00 AM', value: '11:00 AM' },
              { title: '1:00 PM', value: '1:00 PM' },
              { title: '2:00 PM', value: '2:00 PM' },
              { title: '3:00 PM', value: '3:00 PM' },
              { title: '4:00 PM', value: '4:00 PM' },
            ]
          }
        }
      ],
      validation: Rule => Rule.min(1).error('At least one time slot must be selected')
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this test appears in the list'
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
      description: 'Uncheck to hide this test from the website'
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      isActive: 'isActive'
    },
    prepare({ title, subtitle, isActive }) {
      return {
        title: `${title}${!isActive ? ' (Inactive)' : ''}`,
        subtitle
      }
    }
  },
  orderings: [
    {
      title: 'Category, then Order',
      name: 'categoryOrder',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'order', direction: 'asc' }
      ]
    }
  ]
})