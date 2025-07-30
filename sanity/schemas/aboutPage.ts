export default {
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Las Pinas Doctors Hospital'
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      initialValue: 'Safe at Alaga Ka'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4
    },
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
          title: 'Alt Text',
          type: 'string'
        }
      ]
    },
    {
      name: 'vision',
      title: 'Vision Statement',
      type: 'text',
      rows: 3
    },
    {
      name: 'mission',
      title: 'Mission Statement',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of mission points'
    },
    {
      name: 'coreValues',
      title: 'Core Values',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'letter',
              title: 'Letter',
              type: 'string',
              validation: (Rule: any) => Rule.max(1)
            },
            {
              name: 'value',
              title: 'Value',
              type: 'string'
            }
          ]
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle'
    }
  }
}
