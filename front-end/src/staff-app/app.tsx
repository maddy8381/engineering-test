import "shared/helpers/load-icons"
import React, { Suspense, useEffect, useMemo, useState } from "react"
import { Route, Routes } from "react-router-dom"
import { StudentsContext } from "shared/context/students-context"
import { isEmpty } from "shared/helpers/general-utils"
import { useApi } from "shared/hooks/use-api"
import { Student } from "shared/models/student"
import { Header } from "staff-app/components/header/header.component"
import { HomeBoardPage } from "staff-app/daily-care/home-board.page"
import { ActivityPage } from "staff-app/platform/activity.page"

const App = () => {
  const [getStudents, data, loadState] = useApi<{ students: Student[] }>({ url: "get-homeboard-students" })
  const [students, setStudents] = useState<Student[]>([])

  useEffect(() => {
    getStudents()
  }, [getStudents])

  useEffect(() => {
    if (isEmpty(data)) {
      setStudents([])
      return
    }
    setStudents(data!.students)
  }, [data])

  const studentsContextValue = {
    students,
    setStudents,
    studentsLoadState: loadState,
  }

  return (
    <>
      <StudentsContext.Provider value={studentsContextValue}>
        <Header />
        <Suspense fallback={<></>}>
          <Routes>
            <Route path="daily-care" element={<HomeBoardPage />} />
            <Route path="activity" element={<ActivityPage />} />
            <Route path="*" element={<div>No Match</div>} />
          </Routes>
        </Suspense>
      </StudentsContext.Provider>
    </>
  )
}

export default App
