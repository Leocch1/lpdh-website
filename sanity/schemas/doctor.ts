export const doctor = {
  name: 'doctor',
  title: 'Doctors\' Information',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Doctor Name',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'specialty',
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
      name: 'medicalSpecialty',
      title: 'Medical Specialties',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'specialty' }],
          options: {
            filter: ({ document }: { document: any }) => {
              if (!document?.specialty?._ref) {
                return {
                  filter: 'isActive == true',
                  params: {}
                };
              }
              return {
                filter: 'isActive == true && department._ref == $departmentId',
                params: { departmentId: document.specialty._ref }
              };
            },
            disableNew: true
          }
        }
      ],
      description: 'Select one or more medical specialties from the selected department'
    },
    {
      name: 'image',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }
      ]
    },
    {
      name: 'strictlyByAppointment',
      title: 'Strictly by Appointment',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'roomNumber',
      title: 'Room Number',
      type: 'string'
    },
    {
      name: 'phone',
      title: 'Tel. Local',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
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
              { title: 'Sunday', value: 'Sunday' }
            ]
          }
        }
      ],
      validation: (Rule: any) => Rule.required().min(1)
    },
    {
      name: 'secretary',
      title: 'Secretary Contact',
      type: 'string'
    },
    {
      name: 'secretary2',
      title: 'Second Secretary Contact',
      type: 'string'
    },
    {
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle to show/hide this doctor from the website'
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'specialty.name',
      media: 'image'
    }
  }
}
