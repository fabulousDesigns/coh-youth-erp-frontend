// types/attendance.ts
export enum AttendanceStatus {
  PRESENT = "present",
  ABSENT = "absent",
}

export interface AttendanceRecord {
  id: number;
  date: string;
  status: AttendanceStatus;
  programCenter: {
    id: number;
    name: string;
  };
}
