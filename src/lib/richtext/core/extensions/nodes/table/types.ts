export interface CellAttrs {
  colspan: number;
  rowspan: number;
  colwidth: number[] | null;
  backgroundColor: string | null;
  border: {
    width: string;
    style: string;
    color: string;
  } | null;
}