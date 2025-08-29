export default {
  name: 'emailSettings',
  title: 'Email Settings',
  type: 'document',
  fields: [
    {
      name: 'settingsName',
      title: 'Settings Name',
      type: 'string',
      description: 'Descriptive name for these email settings',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'generalInquiryEmail',
      title: 'General Inquiry Email',
      type: 'email',
      description: 'Email address where general inquiries will be forwarded',
      validation: (Rule: any) => Rule.required().email()
    },
    {
      name: 'complaintEmail',
      title: 'Complaint Email',
      type: 'email',
      description: 'Email address where complaints will be forwarded (high priority)',
      validation: (Rule: any) => Rule.required().email()
    },
    {
      name: 'ccEmails',
      title: 'CC Email Addresses',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'email',
              title: 'Email Address',
              type: 'email',
              validation: (Rule: any) => Rule.required().email()
            },
            {
              name: 'description',
              title: 'Description',
              type: 'string',
              description: 'Optional description for this email address'
            }
          ]
        }
      ],
      description: 'Additional email addresses to CC on all contact messages'
    },
    {
      name: 'isActive',
      title: 'Active Settings',
      type: 'boolean',
      description: 'Mark this as the active email configuration',
      initialValue: false
    },
    {
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      readOnly: true,
      initialValue: () => new Date().toISOString()
    }
  ],
  preview: {
    select: {
      title: 'settingsName',
      generalEmail: 'generalInquiryEmail',
      complaintEmail: 'complaintEmail',
      isActive: 'isActive'
    },
    prepare(selection: any) {
      const { title, generalEmail, complaintEmail, isActive } = selection;
      return {
        title: `${title} ${isActive ? '✅ (Active)' : ''}`,
        subtitle: `General: ${generalEmail} | Complaints: ${complaintEmail}`
      };
    }
  }
}
