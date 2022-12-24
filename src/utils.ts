const getValue = (): number => (Math.random() < 0.4 ? 0 : 1);
const getColId = (i: number, j: number): string => ['row', i, 'col', j].join('-');
const deepCopy = (state: number[][]): number[][] => {
  return JSON.parse(JSON.stringify(state));
}
export {
  getValue,
  getColId,
  deepCopy
}
