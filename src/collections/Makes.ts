// collections/Makes.js
import type { CollectionConfig } from 'payload'

const Makes: CollectionConfig = {
  slug: 'makes', // API endpoint: /api/makes
  defaultPopulate: {
    name: true,
  },
  admin: {
    useAsTitle: 'name',
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      label: 'Make Name',
    },
  ],
}

export default Makes
