
export interface FieldsMapping{
  name: string; 
  idxs: number[]
}


export interface PDFFieldMapping{
  coreMapping: FieldsMapping[]; 
  electiveMapping: number[][];
}