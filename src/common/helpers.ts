export const formatDate = (date: Date): string => {
  const datePart = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const monthPart =
    date.getMonth() + 1 < 10
      ? `0${Number(date.getMonth() + 1)}`
      : Number(date.getMonth() + 1);
  const yearPart = date.getFullYear();
  return `${yearPart}-${monthPart}-${datePart}`;
};
