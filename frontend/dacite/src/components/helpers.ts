import { QueryI } from ".";
import { EnvironUnit, LithUnit, UnitsView } from "..";

/* 
performs a shallow difference comparison between two UnitsView objects.
Necesary for how the ModelEditor conducts changeSet
*/
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
    "notes",
  ];
  Object.entries(og).map(([key, val], i) => {
    if (key == "strat_name") {
      changes.strat_name_id = changeset.strat_name.id;
    } else if (changeset[key] && changeset[key] != val && keys.includes(key)) {
      changes[key] = changeset[key];
    }
  });
  return changes;
};

/* 
returns a list of number ids for the envs or liths to be deleted or 
added from a unit.
*/
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

/* 
Returns a string url for a next link that creates the query string from 
the passed 'query' object
*/
const createLink = (base: string, query: QueryI) => {
  let queryString = "?";
  Object.entries(query).map(([key, value], i) => {
    if (queryString == "?") {
      queryString = queryString + `${key}=${value}`;
    } else {
      queryString = queryString + `&${key}=${value}`;
    }
  });
  return base + queryString;
};

export { conductChangeSet, detectDeletionsAndAdditions, createLink };
