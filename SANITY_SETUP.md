# Sanity CMS Setup for LPDH Website

## Getting Started

### 1. Create a Sanity Project

1. Go to [sanity.io](https://sanity.io) and create an account
2. Create a new project
3. Note down your Project ID and Dataset name (usually 'production')

### 2. Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Update the values:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=th6aca7s
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=skIat8RHAvJkCWUSgcSSlZMs8hptZgpZmFKrO2HeQXQdyF52EgR6exTDgzNJPa9nyi8rH0rDiZReIN3oetsxpLpvzPvfG3PHcsCt0gSzTD3Q6Vu0SvokTWyoAQNpSSzaRsyyREAyWoNQEKqnbokuiAVaehTEL9IpvdyE6Xcfy1PtBYKk3l7o
   ```

### 3. Initialize Sanity

Run the following commands:

```bash
# Install Sanity CLI globally (if not already installed)
npm install -g @sanity/cli

# Login to Sanity
sanity login

# Initialize your Sanity project (run this in the project root)
sanity init --project-id YOUR_PROJECT_ID --dataset production
```

### 4. Start Sanity Studio

```bash
npm run sanity
```

This will start Sanity Studio at `http://localhost:3333`

### 5. Create Homepage Content

1. Go to Sanity Studio
2. Create a new "Homepage" document
3. Add carousel images and configure the legacy section
4. Publish the document

## Content Structure

### Carousel Images
- Upload multiple images for the homepage slider
- Each image requires alt text for accessibility
- Optional AI hint for better image processing
- Images can be reordered by dragging

### Legacy Section
- Customizable title and description
- Replaceable hero image
- Configurable button text and link

## Development

The homepage will automatically fetch content from Sanity. If no content is found, it falls back to the original hardcoded content.

To add more editable sections, create new fields in `sanity/schemas/homepage.ts` and update the homepage component accordingly.
