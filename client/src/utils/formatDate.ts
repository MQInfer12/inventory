export const formatDate = (date: string) => {
  const MONTHS = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  const _date = new Date(date);
  const day = _date.getDate();
  const month = MONTHS[_date.getMonth()];
  const year = _date.getFullYear();

  return `${day} ${month}, ${year}`;
};
