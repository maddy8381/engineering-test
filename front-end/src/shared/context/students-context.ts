import React, { Dispatch, SetStateAction } from 'react';
import { Student } from 'shared/models/student';

export type StudentsContextType = { students: Student[]; setStudents: Dispatch<SetStateAction<Student[]>>; studentsLoadState: string }

export const StudentsContext = React.createContext<StudentsContextType>({
  students: [],
  setStudents: (value: any) => {},
  studentsLoadState: "",
})
