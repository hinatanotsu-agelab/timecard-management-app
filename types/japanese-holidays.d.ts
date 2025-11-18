declare module 'japanese-holidays' {
  export interface Holiday {
    name: string;
    date: Date;
  }

  export function isHoliday(date: Date): boolean;
  export function getHolidaysOf(year: number, month?: number, day?: number): Holiday[];
  
  const JapaneseHolidays: {
    isHoliday: typeof isHoliday;
    getHolidaysOf: typeof getHolidaysOf;
  };

  export default JapaneseHolidays;
}
