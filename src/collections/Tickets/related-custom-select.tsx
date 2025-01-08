'use client'
import { useEffect, useState } from 'react'
import { Select, useField } from '@payloadcms/ui'
import { Option } from '@payloadcms/ui/elements/ReactSelect/'
import { Model } from './types'

/**
 * Custom select component for handling related make and model fields
 * @param data - Map of make names to their associated models
 * @param makePath - Path to the make field in the form
 * @param modelPath - Path to the model field in the form
 * @param path - Path to the current field in the form
 */
export const CustomSelect = ({
  data,
  makePath,
  modelPath,
  path,
}: {
  data: Map<string, Model[]>
  makePath: string
  modelPath: string
  path: string
}) => {
  const { setValue, value } = useField<string>({ path })
  const [selectedMake, setSelectedMake] = useState<any>(null)
  const [selectedModel, setSelectedModel] = useState<any>(null)
  const [modelOptions, setModelOptions] = useState<Option<number>[]>([])
  const [makeOptions, setMakeOptions] = useState<Option<number>[]>([])

  // get the make and model fields from the form
  const makeField = useField<number>({ path: makePath })
  const modelField = useField<number>({ path: modelPath })

  // Set make options on initial load
  useEffect(() => {
    const options = Array.from(data.keys()).map((makeName) => {
      const models = data.get(makeName) || []
      return {
        label: makeName,
        value: models[0].make.id, // Get the make ID from any model in the group
      }
    })
    setMakeOptions(options)

    // set the selected values from the field values when the component is mounted
    const makeId = makeField.value
    if (makeId) {
      const selectedMake = options.find((opt) => opt.value === makeId)
      setSelectedMake(selectedMake || null)

      // If we have a make selected, set up the secondary options
      if (selectedMake) {
        const models = data.get(selectedMake.label) || []
        const modelOptions = models.map((model) => ({
          value: model.id,
          label: model.name,
        }))
        setModelOptions(modelOptions)
        handlePrimaryChange(selectedMake)

        // Set the secondary value if we have a model ID
        const modelId = modelField.value
        if (modelId) {
          const selectedModel = modelOptions.find((opt) => opt.value === modelId)
          setSelectedModel(selectedModel || null)
          handleSecondaryChange(selectedModel!)
        }
      }
    }
  }, [data])

  // Update model options when make selection changes
  useEffect(() => {
    if (!selectedMake) {
      setModelOptions([])
      setSelectedModel(null)
      return
    }

    const models = data.get(selectedMake?.label) || []
    const options = models.map((model) => ({
      value: model.id,
      label: model.name,
    }))
    setModelOptions(options)
    setSelectedModel(null)
  }, [selectedMake, data])

  /**
   * Handles changes to the make select
   * @param option - Selected make option or null if cleared
   */
  const handlePrimaryChange = (option: Option<unknown> | Option<unknown>[]) => {
    if (Array.isArray(option)) return
    setSelectedMake(option || null)
    // When a selection changes:
    makeField.setValue(option?.value)
    modelField.setValue(null)
    setSelectedModel(null)
  }

  /**
   * Handles changes to the model select
   * @param option - Selected model option or null if cleared
   */
  const handleSecondaryChange = (option: Option<unknown> | Option<unknown>[]) => {
    if (Array.isArray(option)) return
    setTimeout(() => {
      setSelectedModel(option)
    }, 10)

    // When a selection changes:
    makeField.setValue(selectedMake?.value)
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
          options={makeOptions}
          onChange={handlePrimaryChange}
          value={selectedMake}
          isClearable
        />
      </div>
      <div style={{ flex: 1 }}>
        {/* MODEL */}
        <Select
          key={selectedModel || 'empty'}
          options={modelOptions}
          onChange={handleSecondaryChange}
          value={selectedModel}
          isClearable
        />
      </div>
    </div>
  )
}
