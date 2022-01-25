export interface Project {
  descrip: string;
  id: number;
  project: string;
  timescale_id: number;
}

export interface ColumnGroupI {
  col_group: string;
  col_group_long: string;
  col_ids: number[];
  id: number;
  project_id: number;
}

export interface ColumnI {
  col_id: number;
  col_name: string;
  bottom: string;
  position_bottom: number;
  position_top: number;
  top: string;
  section_id: number;
  units?: number;
}

export interface UnitsView {
  id: number;
  strat_name: string;
  color: string;
  outcrop: string;
  fo?: number;
  name_fo: string;
  age_bottom: number;
  lo?: number;
  name_lo: string;
  age_top: number;
  section_id: number;
  col_id: number;
  position_bottom: number;
  position_top: number;
  max_thick: number;
  min_thick: number;
}
