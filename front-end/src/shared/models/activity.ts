import { Roll } from 'shared/models/roll';

export type ActivityType = "roll"

export interface Activity {
  type: ActivityType
  date: string
  entity: Roll
}
