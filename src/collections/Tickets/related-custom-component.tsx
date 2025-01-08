'use server'
import { UIFieldServerComponent, UIFieldServerProps } from 'payload'
import { CustomSelect } from './related-custom-select'
import { Model } from './types'

/**
 * Server component for handling related make and model selection
 * @param props - Payload UI field server props including makePath and modelPath
 */
const RelatedCustomComponent: UIFieldServerComponent = async (props: UIFieldServerProps) => {
  const { path } = props

  /**
   * Fetches models with their associated make information
   * @returns Map of make names to their associated models
   */
  const info = await props.payload.find({
    collection: 'models',
    depth: 2,
  })

  /**
   * Groups models by their make name
   * @param modelsList - Array of models with make information
   * @returns Map of make names to arrays of associated models
   */
  const getAllModelsByMake = async (modelsList: Model[]) => {
    const modelsByMake = new Map<string, Model[]>()

    modelsList.forEach((model) => {
      const makeModels = modelsByMake.get(model.make.name) || []
      modelsByMake.set(model.make.name, [...makeModels, model])
    })

    return modelsByMake
  }

  const modelsByMake = await getAllModelsByMake(info.docs as Model[])
  console.log('modelsByMake', modelsByMake)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginTop: '10px',
        marginBottom: '20px',
      }}
    >
      <h3>Related Custom Component</h3>
      <CustomSelect
        path={path}
        data={modelsByMake}
        makePath={(props as any)?.makePath}
        modelPath={(props as any)?.modelPath}
      />
    </div>
  )
}
export default RelatedCustomComponent
