export default {
  name: 'contactMessage',
  title: 'Contact Messages',
  type: 'document',
  fields: [
    {
      name: 'messageType',
      title: 'Message Type',
      type: 'string',
      options: {
        list: [
          { title: 'General Inquiry', value: 'inquiry' },
          { title: 'Submit a Complaint', value: 'complaint' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule: any) => Rule.required().email(),
    },
    {
      name: 'subject',
      title: 'Subject',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'message',
      title: 'Message',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'In Progress', value: 'in-progress' },
          { title: 'Resolved', value: 'resolved' },
          { title: 'Closed', value: 'closed' },
        ],
      },
      initialValue: 'new',
    },
    {
      name: 'priority',
      title: 'Priority',
      type: 'string',
      options: {
        list: [
          { title: 'Low', value: 'low' },
          { title: 'Normal', value: 'normal' },
          { title: 'High', value: 'high' },
          { title: 'Urgent', value: 'urgent' },
        ],
      },
      initialValue: 'normal',
    },
    {
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      description: 'Internal notes for staff use only',
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15,
      },
    },
    {
      name: 'respondedAt',
      title: 'Responded At',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
      },
    },
    {
      name: 'notificationStatus',
      title: 'Email Notification Status',
      type: 'object',
      fields: [
        {
          name: 'emailSent',
          title: 'Email Sent',
          type: 'boolean',
          initialValue: false
        },
        {
          name: 'sentTo',
          title: 'Sent To',
          type: 'string',
          description: 'Primary recipient email address'
        },
        {
          name: 'ccEmails',
          title: 'CC Email Addresses',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Additional emails that were CC\'d'
        },
        {
          name: 'settingsUsed',
          title: 'Email Settings Used',
          type: 'string',
          description: 'Which email configuration was used'
        },
        {
          name: 'sentAt',
          title: 'Sent At',
          type: 'datetime'
        }
      ],
      readOnly: true
    },
  ],
  preview: {
    select: {
      title: 'subject',
      subtitle: 'name',
      description: 'messageType',
      status: 'status',
    },
    prepare(selection: any) {
      const { title, subtitle, description, status } = selection;
      const statusIcons: Record<string, string> = {
        new: '🆕',
        'in-progress': '⏳',
        resolved: '✅',
        closed: '🔒',
      };
      const statusIcon = statusIcons[status] || '📩';
      
      return {
        title: `${statusIcon} ${title}`,
        subtitle: `From: ${subtitle}`,
        description: `Type: ${description}`,
      };
    },
  },
  orderings: [
    {
      title: 'Created Date, New',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
    {
      title: 'Status',
      name: 'statusAsc',
      by: [{ field: 'status', direction: 'asc' }],
    },
  ],
};
