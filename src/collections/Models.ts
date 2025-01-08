// collections/Models.js
import type { CollectionConfig } from 'payload'

const Models: CollectionConfig = {
  slug: 'models', // API endpoint: /api/models
  defaultPopulate: {
    make: true,
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
      label: 'Model Name',
    },
    {
      name: 'make',
      type: 'relationship',
      relationTo: 'makes',
      required: true,
      label: 'Associated Make',
    },
  ],
}

export default Models
