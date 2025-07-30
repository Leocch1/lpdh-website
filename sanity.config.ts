import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
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
            ...S.documentTypeListItems().filter(
              (listItem) => !['homepage', 'aboutPage', 'historyPage', 'healthAdvisory', 'newsUpdate', 'careers', 'jobOpening', 'doctor', 'department', 'specialty'].includes(listItem.getId() || '')
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
