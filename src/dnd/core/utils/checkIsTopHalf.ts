export const checkIsTopHalf = (
  element: HTMLElement,
  clientY: number
): boolean => {
  const { top, height } = element.getBoundingClientRect();
  const middleY = top + height / 2;
  return clientY < middleY;
};
