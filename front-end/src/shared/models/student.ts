import { RollStateType } from "./roll"

export interface Student {
  id: number
  first_name: string
  last_name: string
  photo_url?: string
}

export interface StudentWithRollState extends Student {
  rollState: RollStateType
}

export const StudentHelper = {
  getFullName: (student: Student) => `${student.first_name} ${student.last_name}`,
}
