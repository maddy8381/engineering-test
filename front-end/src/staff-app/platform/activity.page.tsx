import React, { useCallback, useEffect, useMemo, useState } from "react"
import { isEmpty } from "shared/helpers/general-utils"
import { useApi } from "shared/hooks/use-api"
import { Activity } from "shared/models/activity"
import { Spacing } from "shared/styles/styles"
import styled from "styled-components"
import { ActivityList } from "../components/activity-list/activity-list.component"

export const ActivityPage: React.FC = React.memo(() => {
  const [getActivities, data, loadState] = useApi<{ activity: Activity[] }>({ url: "get-activities" })
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    getActivities()
  }, [getActivities])

  useEffect(() => {
    if (loadState === "loaded" && !isEmpty(data)) {
      setActivities(data!.activity)
    }
  }, [loadState, data, setActivities])

  return (
    <S.Container>
      <ActivityList activities={activities} activityLoadState={loadState} />
    </S.Container>
  )
})

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
}
