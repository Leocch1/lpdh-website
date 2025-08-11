import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
// import { visionTool } from '@sanity/vision' // Temporarily disabled due to dependency issues
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'LPDH Website',
  basePath: '/studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'th6aca7s',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Home')
              .id('homepage')
              .child(
                S.document()
                  .schemaType('homepage')
                  .documentId('homepage')
              ),
            S.listItem()
              .title('About')
              .id('about')
              .child(
                S.list()
                  .title('About Pages')
                  .items([
                    S.listItem()
                      .title('About Page')
                      .child(S.documentTypeList('aboutPage').title('About Page')),
                    S.listItem()
                      .title('History Page')
                      .child(
                        S.document()
                          .schemaType('historyPage')
                          .documentId('historyPage')
                      ),
                    S.listItem()
                      .title('Health Advisory')
                      .child(S.documentTypeList('healthAdvisory').title('Health Advisory')),
                    S.listItem()
                      .title('News Update')
                      .child(S.documentTypeList('newsUpdate').title('News Update')),
                  ])
              ),
            S.listItem()
              .title('Career')
              .id('career')
              .child(
                S.list()
                  .title('Career Management')
                  .items([
                    S.listItem()
                      .title('Careers Page')
                      .child(S.documentTypeList('careers').title('Careers Page')),
                    S.listItem()
                      .title('Job Openings')
                      .child(S.documentTypeList('jobOpening').title('Job Openings')),
                    S.listItem()
                      .title('Job Categories')
                      .child(S.documentTypeList('jobCategory').title('Job Categories')),
                  ])
              ),
            S.listItem()
              .title('Doctor')
              .id('doctor')
              .child(
                S.list()
                  .title('Doctor Management')
                  .items([
                    S.listItem()
                      .title('Find Doctor Page')
                      .child(
                        S.document()
                          .schemaType('findDoctorPage')
                          .documentId('findDoctorPage')
                      ),
                    S.listItem()
                      .title('Doctors\' Information')
                      .child(S.documentTypeList('doctor').title('Doctors\' Information')),
                    S.listItem()
                      .title('Doctor\'s Department')
                      .child(S.documentTypeList('department').title('Doctor\'s Department')),
                    S.listItem()
                      .title('Medical Specialty')
                      .child(S.documentTypeList('specialty').title('Medical Specialty')),
                  ])
              ),
            S.listItem()
              .title('Lab Scheduling')
              .id('labScheduling')
              .child(
                S.list()
                  .title('Lab Scheduling Management')
                  .items([
                    S.listItem()
                      .title('Lab Departments')
                      .child(S.documentTypeList('labDepartment').title('Lab Departments')),
                    S.listItem()
                      .title('Lab Tests')
                      .child(S.documentTypeList('labTest').title('Lab Tests')),
                    S.listItem()
                      .title('Lab Appointments')
                      .child(S.documentTypeList('appointment').title('Lab Appointments')),
                    S.listItem()
                      .title('Schedule Lab Page')
                      .child(
                        S.document()
                          .schemaType('scheduleLabPage')
                          .documentId('scheduleLabPage')
                      ),
                  ])
              ),
            S.listItem()
              .title('Contact Messages')
              .id('contactMessages')
              .child(
                S.list()
                  .title('Contact Messages Management')
                  .items([
                    S.listItem()
                      .title('All Messages')
                      .child(S.documentTypeList('contactMessage').title('All Contact Messages')),
                    S.listItem()
                      .title('New Messages')
                      .child(
                        S.documentTypeList('contactMessage')
                          .title('New Messages')
                          .filter('status == "new"')
                      ),
                    S.listItem()
                      .title('Complaints')
                      .child(
                        S.documentTypeList('contactMessage')
                          .title('Complaints')
                          .filter('messageType == "complaint"')
                      ),
                  ])
              ),
            ...S.documentTypeListItems().filter(
<<<<<<< HEAD
              (listItem) => !['homepage', 'aboutPage', 'historyPage', 'healthAdvisory', 'newsUpdate', 'careers', 'jobOpening', 'jobCategory', 'doctor', 'department', 'specialty', 'scheduleLabPage', 'labTest', 'appointment', 'labDepartment', 'contactMessage'].includes(listItem.getId() || '')
=======
              (listItem) => !['homepage', 'aboutPage', 'historyPage', 'healthAdvisory', 'newsUpdate', 'careers', 'jobOpening', 'jobCategory', 'doctor', 'department', 'specialty', 'scheduleLabPage', 'labTest', 'appointment', 'labDepartment', 'findDoctorPage'].includes(listItem.getId() || '')
>>>>>>> 751adfc42fbca1e69776805cdbcf1d29b2c85747
            ),
          ]),
    }),
    // visionTool(), // Temporarily disabled due to dependency issues
  ],

  schema: {
    types: schemaTypes,
  },
})
