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
              .title('Marketing Department')
              .id('marketing')
              .child(
                S.list()
                  .title('Marketing Department')
                  .items([
                    S.listItem()
                      .title('Home Page')
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
                            S.listItem()
                              .title('Email Settings')
                              .child(S.documentTypeList('emailSettings').title('Email Configuration')),
                          ])
                      ),
                    S.listItem()
                      .title('Services Page')
                      .child(S.documentTypeList('servicesPage').title('Services Page')),
                    S.listItem()
                      .title('Admission Page')
                      .child(S.documentTypeList('admission').title('Admission Page')),
                  ])
              ),
            S.listItem()
              .title('HR Department')
              .id('hr')
              .child(
                S.list()
                  .title('HR Department')
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
                    S.listItem()
                      .title('Job Applications')
                      .child(
                        S.list()
                          .title('Job Application Management')
                          .items([
                            S.listItem()
                              .title('All Applications')
                              .child(S.documentTypeList('jobApplication').title('All Job Applications')),
                            S.listItem()
                              .title('New Applications')
                              .child(
                                S.documentTypeList('jobApplication')
                                  .title('New Applications')
                                  .filter('applicationStatus == "new"')
                              ),
                            S.listItem()
                              .title('Under Review')
                              .child(
                                S.documentTypeList('jobApplication')
                                  .title('Under Review')
                                  .filter('applicationStatus == "under-review"')
                              ),
                            S.listItem()
                              .title('Interview Scheduled')
                              .child(
                                S.documentTypeList('jobApplication')
                                  .title('Interview Scheduled')
                                  .filter('applicationStatus == "interview-scheduled"')
                              ),
                              S.listItem()
                              .title('Pulling')
                              .child(
                                S.documentTypeList('jobApplication')
                                  .title('Pulling')
                                  .filter('applicationStatus == "pulling"')
                              ),
                            S.listItem()
                              .title('Hired Candidates')
                              .child(
                                S.documentTypeList('jobApplication')
                                  .title('Hired Candidates')
                                  .filter('applicationStatus == "hired"')
                              ),
                          ])
                      ),
                  ])
              ),
            S.listItem()
              .title('Laboratory Department')
              .id('laboratory')
              .child(
                S.list()
                  .title('Laboratory Department')
                  .items([
                    S.listItem()
                      .title('Doctor Management')
                      .id('doctorManagement')
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
                  ])
              ),
            // Other document types that don't belong to specific departments
            ...S.documentTypeListItems().filter(
              (listItem) => !['homepage', 'aboutPage', 'historyPage', 'healthAdvisory', 'newsUpdate', 'careers', 'jobOpening', 'jobCategory', 'doctor', 'department', 'specialty', 'scheduleLabPage', 'labTest', 'appointment', 'labDepartment', 'contactMessage', 'findDoctorPage', 'servicesPage', 'admission', 'emailSettings', 'jobApplication'].includes(listItem.getId() || '')
            ),
          ]),
    }),
    // visionTool(), // Temporarily disabled due to dependency issues
  ],

  schema: {
    types: schemaTypes,
  },
})
