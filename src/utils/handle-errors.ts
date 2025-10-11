export const handleError = (error: unknown): string => {
  if (error instanceof Error) {
    console.error(error);
    return error.message;
  }
  return error as string;
};
