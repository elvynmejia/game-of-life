const getValue = (): number => (Math.random() < 0.4 ? 0 : 1);
const getColId = (i: number, j: number): string => ['row', i, 'col', j].join('-');

export {
  getValue,
  getColId
}
