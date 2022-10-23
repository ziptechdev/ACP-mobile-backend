export const formatCardExpirationDate = (expirationDate: string) => {
  const [month, year] = expirationDate.split('/');
  return `20${year}-${month}-01`;
};

export const isInTheFuture = (date: Date) => {
  return date > new Date();
};
