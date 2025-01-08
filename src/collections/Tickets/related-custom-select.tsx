'use client'
import { useEffect, useState } from 'react'
import { Select, useField } from '@payloadcms/ui'
import { Option } from '@payloadcms/ui/elements/ReactSelect/'
import { Model } from './types'

/**
 * Custom select component for handling related make and model fields
 * @param data - Map of make names to their associated models
 * @param primaryPath - Path to the make field in the form
 * @param secondaryPath - Path to the model field in the form
 * @param path - Path to the current field in the form
 */
export const CustomSelect = ({
  data,
  primaryPath,
  secondaryPath,
  path,
}: {
  data: Map<string, Model[]>
  primaryPath: string
  secondaryPath: string
  path: string
}) => {
  const { setValue, value } = useField<string>({ path })
  const [primaryValue, setPrimaryValue] = useState<any>(null)
  const [secondaryValue, setSecondaryValue] = useState<any>(null)
  const [secondaryOptions, setSecondaryOptions] = useState<Option<number>[]>([])
  const [primaryOptions, setPrimaryOptions] = useState<Option<number>[]>([])

  // get the docment fields with the selected make and model
  const makeField = useField<number>({ path: primaryPath })
  const modelField = useField<number>({ path: secondaryPath })

  // Set primary options on initial load
  useEffect(() => {
    const options = Array.from(data.keys()).map((makeName) => {
      const models = data.get(makeName) || []
      return {
        label: makeName,
        value: models[0].make.id, // Get the make ID from any model in the group
      }
    })
    setPrimaryOptions(options)

    // set the selected values from the field values when the component is mounted
    const makeId = makeField.value
    if (makeId) {
      const selectedMake = options.find((opt) => opt.value === makeId)
      setPrimaryValue(selectedMake || null)

      // If we have a make selected, set up the secondary options
      if (selectedMake) {
        const models = data.get(selectedMake.label) || []
        const modelOptions = models.map((model) => ({
          value: model.id,
          label: model.name,
        }))
        setSecondaryOptions(modelOptions)
        handlePrimaryChange(selectedMake)

        // Set the secondary value if we have a model ID
        const modelId = modelField.value
        if (modelId) {
          const selectedModel = modelOptions.find((opt) => opt.value === modelId)
          setSecondaryValue(selectedModel || null)
          handleSecondaryChange(selectedModel!)
        }
      }
    }
  }, [data])

  // Update secondary options when primary selection changes
  useEffect(() => {
    if (!primaryValue) {
      setSecondaryOptions([])
      setSecondaryValue(null)
      return
    }

    const models = data.get(primaryValue?.label) || []
    const options = models.map((model) => ({
      value: model.id,
      label: model.name,
    }))
    setSecondaryOptions(options)
    setSecondaryValue(null)
  }, [primaryValue, data])

  /**
   * Handles changes to the primary (make) select
   * @param option - Selected make option or null if cleared
   */
  const handlePrimaryChange = (option: Option<unknown> | Option<unknown>[]) => {
    if (Array.isArray(option)) return
    setPrimaryValue(option || null)
    // When a selection changes:
    makeField.setValue(option?.value)
    modelField.setValue(null)
    setSecondaryValue(null)
  }

  /**
   * Handles changes to the secondary (model) select
   * @param option - Selected model option or null if cleared
   */
  const handleSecondaryChange = (option: Option<unknown> | Option<unknown>[]) => {
    if (Array.isArray(option)) return
    setTimeout(() => {
      setSecondaryValue(option)
    }, 10)

    // When a selection changes:
    makeField.setValue(primaryValue?.value)
    modelField.setValue(option?.value)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '10px',
        width: '50%',
      }}
    >
      <div style={{ flex: 1 }}>
        {/* MAKE */}
        <Select
          options={primaryOptions}
          onChange={handlePrimaryChange}
          value={primaryValue}
          isClearable
        />
      </div>
      <div style={{ flex: 1 }}>
        {/* MODEL */}
        <Select
          key={secondaryValue || 'empty'}
          options={secondaryOptions}
          onChange={handleSecondaryChange}
          value={secondaryValue}
          isClearable
        />
      </div>
    </div>
  )
}
