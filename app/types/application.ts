export interface Application {
  id: number;
  name: string;
  currentWork: string;
  yearsOfExperience: number;
  noticePeriod: string;
  expectedSalary: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export const NOTICE_PERIODS = [
  { value: "immediate", label: "Immediate" },
  { value: "2_weeks", label: "2 Weeks" },
  { value: "1_month", label: "1 Month" },
  { value: "2_months", label: "2 Months" },
  { value: "3_months", label: "3 Months" },
] as const;