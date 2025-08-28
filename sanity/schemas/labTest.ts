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
      name: 'labDepartment',
      title: 'Lab Department',
      type: 'reference',
      to: [{ type: 'labDepartment' }],
      validation: Rule => Rule.required(),
      description: 'Select the lab department that handles this test'
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
      type: 'array',
      of: [{
        type: 'string'
      }],
      description: 'Special preparation instructions for patients - each item will be displayed as a bullet point'
    }),
    defineField({
      name: 'allowOnlineBooking',
      title: 'Allow Online Booking',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle to show/hide the "Book your appointment" button for this test'
    }),
    defineField({
      name: 'bookingUnavailableMessage',
      title: 'Booking Unavailable Message',
      type: 'string',
      initialValue: 'Please contact the hospital directly to schedule this test',
      description: 'Message shown when online booking is disabled for this test',
      hidden: ({ document }) => document?.allowOnlineBooking !== false
    }),
    defineField({
      name: 'requiresEligibilityCheck',
      title: 'Requires Eligibility Check',
      type: 'boolean',
      initialValue: false,
      description: 'Check if this test requires patient eligibility screening (e.g., MRI, CT scan with contrast)'
    }),
    defineField({
      name: 'eligibilityQuestions',
      title: 'Eligibility Questions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'riskLevel',
              title: 'Risk Level if "Yes"',
              type: 'string',
              options: {
                list: [
                  { title: 'High Risk - Cannot proceed', value: 'high' },
                  { title: 'Medium Risk - Requires doctor approval', value: 'medium' },
                  { title: 'Low Risk - Proceed with caution', value: 'low' }
                ]
              },
              validation: Rule => Rule.required()
            },
            {
              name: 'warningMessage',
              title: 'Warning Message',
              type: 'text',
              description: 'Message shown to patient if they answer "Yes"'
            }
          ],
          preview: {
            select: {
              title: 'question',
              subtitle: 'riskLevel'
            },
            prepare({ title, riskLevel }) {
              const riskColors = {
                high: '🔴 High Risk',
                medium: '🟡 Medium Risk',
                low: '🟢 Low Risk'
              };
              return {
                title: title,
                subtitle: riskColors[riskLevel as keyof typeof riskColors] || riskLevel
              }
            }
          }
        }
      ],
      hidden: ({ document }) => !document?.requiresEligibilityCheck,
      validation: Rule => Rule.custom((value, context) => {
        const document = context.document;
        if (document?.requiresEligibilityCheck && (!value || value.length === 0)) {
          return 'At least one eligibility question is required when eligibility check is enabled';
        }
        return true;
      })
    }),
    defineField({
      name: 'cannotProceedMessage',
      title: 'Cannot Proceed Message',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Alert Title',
          type: 'string',
          initialValue: 'Cannot Proceed with Examination',
          description: 'Title shown when patient cannot proceed'
        }),
        defineField({
          name: 'message',
          title: 'Alert Message',
          type: 'text',
          initialValue: 'Based on your answers, this examination may not be safe for you. Please consult with your doctor before proceeding. You may also contact the hospital for alternative examination options.',
          description: 'Message shown when patient cannot proceed due to high-risk answers'
        })
      ],
      hidden: ({ document }) => !document?.requiresEligibilityCheck,
      description: 'Customize the message shown when patients cannot proceed with examination'
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
      validation: Rule => Rule.custom((value, context) => {
        const document = context.document;
        if (document?.allowOnlineBooking && (!value || value.length === 0)) {
          return 'At least one day must be selected when online booking is enabled';
        }
        return true;
      }),
      hidden: ({ document }) => document?.allowOnlineBooking !== true
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
      validation: Rule => Rule.custom((value, context) => {
        const document = context.document;
        if (document?.allowOnlineBooking && (!value || value.length === 0)) {
          return 'At least one time slot must be selected when online booking is enabled';
        }
        return true;
      }),
      hidden: ({ document }) => document?.allowOnlineBooking !== true
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
      subtitle: 'labDepartment.name',
      isActive: 'isActive',
      allowOnlineBooking: 'allowOnlineBooking'
    },
    prepare({ title, subtitle, isActive, allowOnlineBooking }) {
      const status = [];
      if (!isActive) status.push('Inactive');
      if (!allowOnlineBooking) status.push('No Online Booking');
      
      return {
        title: `${title}${status.length > 0 ? ` (${status.join(', ')})` : ''}`,
        subtitle: subtitle || 'No Department'
      }
    }
  },
  orderings: [
    {
      title: 'Lab Department, then Order',
      name: 'labDepartmentOrder',
      by: [
        { field: 'labDepartment.name', direction: 'asc' },
        { field: 'order', direction: 'asc' }
      ]
    }
  ]
})