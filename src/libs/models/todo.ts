import { BaseModel } from '.'

export interface ToDo extends BaseModel {
  id: number
  usder_id: string
  is_complete: boolean
  content: string
}

export const TODO_TABLE_NAME = 'todos'
