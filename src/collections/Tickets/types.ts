export interface Make {
  id: number
  name: string
  updatedAt: string
  createdAt: string
}

export interface Model {
  id: number
  name: string
  make: Make
  updatedAt: string
  createdAt: string
}
