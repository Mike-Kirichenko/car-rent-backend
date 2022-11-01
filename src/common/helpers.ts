export const formatDate = (date: Date): string => {
  const datePart = date.getDate().toString().padStart(2, '0');
  const monthPart = (Number(date.getMonth()) + 1).toString().padStart(2, '0');
  const yearPart = date.getFullYear();
  return `${yearPart}-${monthPart}-${datePart}`;
};
