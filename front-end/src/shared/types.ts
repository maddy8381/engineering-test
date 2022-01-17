import { ActivityType } from "./models/activity"
import { RollStateType } from "./models/roll"

export interface StateListItem {
  type: RollStateItemType
  count: number
}

export type RollStateItemType = RollStateType | "all"

export type LoadState = "unloaded" | "loading" | "loaded" | "error"

export type RollStateFilter = RollStateItemType | null

export type ActivityFilters = {
  from: Date | null
  to: Date | null
  type: ActivityType | "all"
}
