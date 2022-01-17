export interface Roll {
  id: number
  name: string
  completed_at: string
  student_roll_states: StudentStoredRollState[]
}

export interface RollInput {
  student_roll_states: StudentStoredRollState[]
}

export type StudentStoredRollStateType = "unmarked" | "present" | "absent" | "late"

export type StudentStoredRollState = { student_id: number; roll_state: StudentStoredRollStateType }

export type RollStateType = "unmark" | "present" | "absent" | "late"
