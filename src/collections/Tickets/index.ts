// collections/Makes.js
import type { CollectionConfig } from 'payload'

/**
 * Tickets collection configuration
 * Handles ticket creation with related make and model fields
 */
const Tickets: CollectionConfig = {
  slug: 'tickets', // API endpoint: /api/makes
  admin: {
    useAsTitle: 'name',
  },
  defaultPopulate: {
    make: true,
    model: true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      label: 'Ticket Name',
    },
    {
      name: 'description',
      type: 'ui',
      admin: {
        components: {
          Field: {
            path: 'src/collections/Tickets/related-custom-component',
            serverProps: {
              makePath: 'make',
              modelPath: 'model',
            },
          },
        },
      },
    },
    {
      name: 'make',
      type: 'relationship',
      relationTo: 'makes',
      required: true,
      label: 'Associated Make',
      admin: {
        // condition: (_, siblingData) => !!siblingData.make,
        readOnly: true,
      },
    },
    {
      name: 'model',
      type: 'relationship',
      relationTo: 'models',
      required: true,
      label: 'Associated Model',
      admin: {
        // condition: (_, siblingData) => !!siblingData.make,
        readOnly: true,
      },
    },
  ],
}

export default Tickets
