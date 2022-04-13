import { BaseModel } from '.'

export type ToDo = {
  id: number
  usder_id: string
  is_complete: boolean
  content: string
} & BaseModel

export const TODO_TABLE_NAME = 'todos'
