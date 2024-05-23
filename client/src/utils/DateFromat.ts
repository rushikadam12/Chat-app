export const dateFormat = (date: string | null) => {
  if (!date) return "";
  const formatDate = new Date(date);
  const year = formatDate.getUTCFullYear();
  const month = formatDate.getMonth()+1;
  const day = formatDate.getDay();
  return `${day}/${month}/${year}`;
};
