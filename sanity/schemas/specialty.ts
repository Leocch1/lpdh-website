export const specialty = {
  name: 'specialty',
  title: 'Medical Specialty',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Specialty Name',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'department',
      title: 'Department',
      type: 'reference',
      to: [{ type: 'department' }],
      validation: (Rule: any) => Rule.required(),
      options: {
        filter: 'isActive == true',
        disableNew: true
      }
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle to show/hide this specialty from the website'
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this specialty appears within its department'
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'department.name',
      description: 'description'
    }
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [
        { field: 'order', direction: 'asc' }
      ]
    }
  ]
}
