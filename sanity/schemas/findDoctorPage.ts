export default {
  name: 'findDoctorPage',
  title: 'Find Doctor Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Find Doctor Page',
    },
    {
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'heroImage',
          title: 'Hero Image',
          type: 'image',
          options: {
            hotspot: true
          },
          fields: [
            {
              name: 'alt',
              title: 'Alternative Text',
              type: 'string'
            },
            {
              name: 'dataAiHint',
              title: 'AI Image Description',
              type: 'string'
            }
          ]
        },
      ]
    }
  ]
}