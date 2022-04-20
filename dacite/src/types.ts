/* 
The different data types used in the application. Usually matching up with a specific db view in
macrostrat_api schema
*/

export interface Project {
  descrip: string;
  id?: number;
  project: string;
  timescale_id?: number;
}

export interface TimeScale {
  id: number;
  timescale: string;
  ref_id: number;
}

export interface ColumnGroupI {
  col_group: string;
  col_group_long: string;
  cols: ICol[];
  id: number;
  project_id: number;
}

export interface RefI {
  id?: number;
  pub_year: number;
  author: string;
  ref: string;
  doi?: string;
  url?: string;
}

export interface ColumnForm {
  col_id: number;
  col_name: string;
  col_number: number;
  notes?: string;
  ref: RefI;
}

// interface for col that shows up in column_group
export interface ICol {
  col_id: number;
  col_number?: number;
  col_name: string;
  status_code?: string;
}

export interface IColumnSection extends ICol {
  bottom: string;
  position_bottom: number;
  position_top: number;
  top: string;
  section_id: number;
  units?: number;
}

export interface UnitsView {
  id: number;
  unit_strat_name: string;
  strat_name: StratNameI;
  color: string;
  outcrop?: string;
  fo?: number;
  name_fo: string;
  age_bottom: number;
  lo?: number;
  name_lo: string;
  age_top: number;
  section_id: number;
  col_id: number;
  notes?: string;
  position_bottom: number;
  position_top: number;
  max_thick: number;
  min_thick: number;
}

export interface Lith {
  id: number;
  lith: string;
  lith_group?: string;
  lith_type: string;
  lith_class: string;
  lith_color: string;
}

export interface LithUnit extends Lith {
  unit_id: number;
}

export interface Environ {
  id: number;
  environ: string;
  environ_type: string;
  environ_class: string;
  environ_color: string;
}

export interface EnvironUnit extends Environ {
  unit_id: number;
}

export interface IntervalI {
  id: number;
  age_bottom: number;
  age_top: number;
  interval_name: string;
  interval_abbrev?: string;
  interval_color: string;
  rank: number;
}

export enum RANK {
  "SGp" = "SGp",
  "Gp" = "Gp",
  "SubGp" = "SubGp",
  "Fm" = "Fm",
  "Mbr" = "Mbr",
  "Bed" = "Bed",
}

export interface StratNameI {
  id: number;
  strat_name: string;
  rank: RANK;
  ref_id: number;
  concept_id?: number;
}