import { defineType, defineField } from 'sanity'

export const appointment = defineType({
  name: 'appointment',
  title: 'Lab Appointment',
  type: 'document',
  fields: [
    defineField({
      name: 'appointmentNumber',
      title: 'Appointment Number',
      type: 'string',
      readOnly: true,
      initialValue: () => `APT-${Date.now()}`
    }),
    defineField({
      name: 'patientInfo',
      title: 'Patient Information',
      type: 'object',
      fields: [
        {
          name: 'firstName',
          title: 'First Name',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'lastName',
          title: 'Last Name',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string',
          validation: Rule => Rule.required().email()
        },
        {
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
          validation: Rule => Rule.required()
        }
      ]
    }),
    defineField({
      name: 'appointmentDate',
      title: 'Appointment Date',
      type: 'date',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'appointmentTime',
      title: 'Appointment Time',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'selectedTests',
      title: 'Selected Lab Tests',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'labTest' }]
        }
      ],
      validation: Rule => Rule.min(1).error('At least one test must be selected')
    }),
    defineField({
      name: 'notes',
      title: 'Special Instructions',
      type: 'text'
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Confirmed', value: 'confirmed' },
          { title: 'Completed', value: 'completed' },
          { title: 'Cancelled', value: 'cancelled' }
        ]
      },
      initialValue: 'pending'
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      readOnly: true
    })
  ],
  preview: {
    select: {
      firstName: 'patientInfo.firstName',
      lastName: 'patientInfo.lastName',
      date: 'appointmentDate',
      time: 'appointmentTime',
      status: 'status'
    },
    prepare({ firstName, lastName, date, time, status }) {
      return {
        title: `${firstName} ${lastName}`,
        subtitle: `${date} at ${time} - ${status}`
      }
    }
  },
  orderings: [
    {
      title: 'Appointment Date (newest first)',
      name: 'dateDesc',
      by: [
        { field: 'appointmentDate', direction: 'desc' },
        { field: 'appointmentTime', direction: 'asc' }
      ]
    }
  ]
})