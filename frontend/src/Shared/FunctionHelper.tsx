import { addDays, format, getDay, subDays } from "date-fns";
import { endOfMonth, startOfMonth } from "date-fns";
import type { Week } from "./Interface";
import { eachDayOfInterval } from "date-fns/eachDayOfInterval";

const getDaysOfWeek = (year: number, month: number): Week[] => {
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));
  const allDays = eachDayOfInterval({ start, end });

  const weeks: Week[] = [];
  let currentWeek: Week = {
    mondays: "",
    tuesdays: "",
    wednesdays: "",
    thursdays: "",
    fridays: "",
    saturdays: "",
    sundays: "",
  };

  const firstDayOfWeek = getDay(start);
  if (firstDayOfWeek !== 1) {
    const daysToAdd = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    const previousMonthDays = eachDayOfInterval({
      start: subDays(start, daysToAdd),
      end: subDays(start, 1),
    });

    previousMonthDays.forEach((day) => {
      const dayOfWeek = format(day, "EEEE").toLowerCase() + "s";
      const formattedDate = format(day, "yyyy-MM-dd");
      currentWeek[dayOfWeek as keyof Week] = formattedDate;
    });
  }

  allDays.forEach((day) => {
    const dayOfWeek = format(day, "EEEE").toLowerCase() + "s";
    const formattedDate = format(day, "yyyy-MM-dd");
    currentWeek[dayOfWeek as keyof Week] = formattedDate;

    if (getDay(day) === 0) {
      weeks.push(currentWeek);
      currentWeek = {
        mondays: "",
        tuesdays: "",
        wednesdays: "",
        thursdays: "",
        fridays: "",
        saturdays: "",
        sundays: "",
      };
    }
  });

  if (
    currentWeek.mondays ||
    currentWeek.tuesdays ||
    currentWeek.wednesdays ||
    currentWeek.thursdays ||
    currentWeek.fridays ||
    currentWeek.saturdays ||
    currentWeek.sundays
  ) {
    weeks.push(currentWeek);
  }

  const lastWeek = weeks[weeks.length - 1];
  const lastDayOfWeek = getDay(end);
  if (lastDayOfWeek !== 0) {
    const daysToAdd = 7 - lastDayOfWeek;
    const nextMonthDays = eachDayOfInterval({
      start: addDays(end, 1),
      end: addDays(end, daysToAdd),
    });

    nextMonthDays.forEach((day) => {
      const dayOfWeek = format(day, "EEEE").toLowerCase() + "s";
      const formattedDate = format(day, "yyyy-MM-dd");
      lastWeek[dayOfWeek as keyof Week] = formattedDate;
    });
  }

  return weeks;
};

export { getDaysOfWeek };
