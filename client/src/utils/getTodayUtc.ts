export const getTodayUtc = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const monthWithZero = month + 1 > 10 ? month : `0${month}`;
  const day = today.getDate();
  const dayWithZero = day + 1 > 10 ? day : `0${day}`;
  return `${year}-${monthWithZero}-${dayWithZero}`;
}