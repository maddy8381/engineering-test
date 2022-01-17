import React, { useContext, useMemo } from 'react';
import {
	StudentsContext, StudentsContextType
} from 'shared/context/students-context';
import { humanize, isEmpty } from 'shared/helpers/general-utils';
import { Activity } from 'shared/models/activity';
import {
	RollStateType, StudentStoredRollState, StudentStoredRollStateType
} from 'shared/models/roll';
import { Student, StudentWithRollState } from 'shared/models/student';
import styled from 'styled-components';
import { faChevronDown, faHandPaper } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import {
	LoadFailed
} from 'shared/components/load-failed/load-failed.component';
import {
	LoadingSpinner
} from 'shared/components/loading-spinner/loading-spinner.component';
import {
	StudentList
} from 'shared/components/student-list/student-list.component';

interface ActivityListProps {
  activityLoadState: string
  activities: Activity[]
}

const getActivitiesContentFor = (activities: Activity[], students: Student[]) => {
  const sortedActivities = [...activities].sort(activityComparator)
  return (
    <>
      {sortedActivities.map((activity: Activity) => (
        <React.Fragment key={activity.entity.id}>{getActivityContentFor(activity, students)}</React.Fragment>
      ))}
    </>
  )
}

const activityComparator = (activityOne: Activity, activityTwo: Activity) => {
  if (activityOne.date > activityTwo.date) {
    return -1
  }
  if (activityOne.date < activityTwo.date) {
    return 1
  }
  return 0
}

const getActivityContentFor = (activity: Activity, students: Student[]) => {
  const studentsContent = getStudentsContentFrom(activity.entity.student_roll_states, students)
  const activitySummaryTitle = getActivitySummaryTitleFrom(activity.type)
  return (
    <S.Accordion key={activity.entity.id}>
      <S.AccordionSummary expandIcon={<FontAwesomeIcon icon={faChevronDown} />}>
        <Typography>
          <S.RollIcon icon={faHandPaper} />
          {activitySummaryTitle}
        </Typography>
        <S.ActivityDate>{humanize(activity.date)}</S.ActivityDate>
      </S.AccordionSummary>
      <AccordionDetails>{studentsContent}</AccordionDetails>
    </S.Accordion>
  )
}

const getStudentsContentFrom = (studentStoredRollStates: StudentStoredRollState[], students: Student[]) => {
  const studentsWithRollState = getStudentsRollStartFrom(studentStoredRollStates, students)
  return <StudentList studentsLoadState={"loaded"} studentsWithRollState={studentsWithRollState} isReadonly={true} isRollMode={false} />
}

const getStudentsRollStartFrom = (studentRollStates: StudentStoredRollState[], students: Student[]) =>
  studentRollStates.map((studentRollState: StudentStoredRollState) => {
    const studentById = getStudentByIdFrom(studentRollState.student_id, students)
    const rollState = getProperRollStateFrom(studentRollState.roll_state)
    return { ...studentById, rollState } as StudentWithRollState
  })

const getStudentByIdFrom = (studentId: number, students: Student[]) => students.find((student: Student) => student.id === studentId)

const getProperRollStateFrom = (studentStoredRollStateType: StudentStoredRollStateType) => {
  if (studentStoredRollStateType === "unmarked") {
    return "unmark"
  }
  return studentStoredRollStateType as RollStateType
}

const getActivitySummaryTitleFrom = (activityType: "roll") => {
  if (activityType === "roll") {
    return "Roll"
  }
  return "Unknown activity"
}

export const ActivityList: React.FC<ActivityListProps> = React.memo(({ activityLoadState, activities }: ActivityListProps) => {
  if (activityLoadState === "loading") {
    return <LoadingSpinner />
  }

  if (isEmpty(activities)) {
    return <LoadFailed />
  }

  const { students } = useContext<StudentsContextType>(StudentsContext)

  const activitiesContent = useMemo(() => getActivitiesContentFor(activities, students), [activities, students])

  return <>{activitiesContent}</>
})

const S = {
  AccordionSummary: styled(AccordionSummary)`
    && div.MuiAccordionSummary-content {
      display: flex;
      justify-content: space-between;
      padding-left: 1em;
      padding-right: 50%;
      align-items: center;
      gap: 3em;
    }
  `,
  ActivityDate: styled(Typography)`
    font-size: 12px !important;
    color: #494949;
  `,
  Accordion: styled(Accordion)`
    margin: 0.5em;
  `,
  RollIcon: styled(FontAwesomeIcon)`
    margin-right: 1em;
  `,
}
