export default {
  name: 'jobApplication',
  title: 'Job Applications',
  type: 'document',
  fields: [
    {
      name: 'applicantName',
      title: 'Applicant Name',
      type: 'string',
      description: 'Full name of the applicant',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'jobPosition',
      title: 'Job Position',
      type: 'string',
      description: 'Position being applied for',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'email',
      title: 'Email Address',
      type: 'email',
      validation: (Rule: any) => Rule.required().email()
    },
    {
      name: 'contactNumber',
      title: 'Contact Number',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'message',
      title: 'Application Message',
      type: 'text',
      description: 'Message from the applicant'
    },
    {
      name: 'resume',
      title: 'Resume File',
      type: 'file',
      description: 'Upload resume (PDF, DOC, DOCX)',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'applicationStatus',
      title: 'Application Status',
      type: 'string',
      options: {
        list: [
          { title: 'New Application', value: 'new' },
          { title: 'Under Review', value: 'under-review' },
          { title: 'Interview Scheduled', value: 'interview-scheduled' },
          { title: 'Pulling', value: 'pulling' },
          { title: 'Hired', value: 'hired' }
        ]
      },
      initialValue: 'new',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'submittedAt',
      title: 'Application Submitted',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true
    }
  ],
  preview: {
    select: {
      name: 'applicantName',
      email: 'email',
      position: 'jobPosition',
      status: 'applicationStatus',
      submittedAt: 'submittedAt'
    },
    prepare(selection: any) {
      const { name, email, position, status, submittedAt } = selection;
      
      const formattedDate = submittedAt ? new Date(submittedAt).toLocaleDateString() : '';
      
      return {
        title: name,
        subtitle: `${position} - ${email}`,
        description: `Applied: ${formattedDate} | Status: ${status}`
      };
    }
  },
  orderings: [
    {
      title: 'Newest First',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }]
    },
    {
      title: 'Oldest First',
      name: 'submittedAtAsc',
      by: [{ field: 'submittedAt', direction: 'asc' }]
    },
    {
      title: 'Status',
      name: 'statusAsc',
      by: [{ field: 'applicationStatus', direction: 'asc' }]
    },
    {
      title: 'Applicant Name',
      name: 'nameAsc',
      by: [{ field: 'applicantName', direction: 'asc' }]
    }
  ]
}
