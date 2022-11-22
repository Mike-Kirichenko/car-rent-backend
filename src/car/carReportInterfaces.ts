export interface CarReport {
  readonly carId: number;
  readonly daysInMonth: number;
  readonly LP: string;
}

export interface CarMonthlyReport extends CarReport {
  percentInMonth: number;
}
