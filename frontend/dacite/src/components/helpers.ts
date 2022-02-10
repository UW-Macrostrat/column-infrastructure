import { EnvironUnit, LithUnit, UnitsView } from "..";

const conductChangeSet = (og: UnitsView, changeset: UnitsView) => {
  const changes = {};
  const keys = [
    "strat_name",
    "color",
    "outcrop",
    "fo",
    "lo",
    "position_bottom",
    "position_top",
    "max_thick",
    "min_thick",
    "section_id",
    "col_id",
  ];
  Object.entries(og).map(([key, val], i) => {
    if (changeset[key] && changeset[key] != val && keys.includes(key)) {
      changes[key] = changeset[key];
    }
  });
  return changes;
};

const detectDeletionsAndAdditions = (
  og: EnvironUnit[] | LithUnit[],
  changes: EnvironUnit[] | LithUnit[]
) => {
  let deletions: number[] | [] = [];
  let additions: number[] | [] = [];

  const present_og: any = {};

  og.map((o) => {
    Object.assign(present_og, { [o.id]: true });
  });

  changes.map((c) => {
    let key = c.id;
    if (present_og[key]) {
      delete present_og[key];
    } else {
      additions = [...additions, c.id];
    }
  });
  deletions = Object.keys(present_og).map((i) => parseInt(i));
  return { deletions, additions };
};

export { conductChangeSet, detectDeletionsAndAdditions };
