export const isObjectEmpty = (obj: any) => {
    try {
      return Object.entries(obj).map(([key]) => key).length === 0;
    } catch (error) {
      return true;
    }
};