import { filterOrAddIds, UnitEditorModel, UnitsView } from "~/index";

///////////////// helper functions //////////////
/* 
    This would be async and would persist to db 
    then would return db representation which we 
    would add to units in a Sync Action
*/
function persistUnit(unit: UnitEditorModel, position_bottom: number) {
  const newUnit = {
    ...unit.unit,
    lith_unit: [
      ...unit.liths.map((l) => {
        return { lith: l.lith };
      }),
    ],
    id: 666,
    position_bottom,
    color: unit.liths[0].lith_color || "#FFFFF",
  };
  return newUnit;
}

/////////////// Action Types ///////////////
type ToggleDrag = { type: "toggle-drag" };
type SetDivideIds = { type: "set-divide-ids"; id: number };
type AddUnitTop = { type: "add-unit-top"; unit: UnitEditorModel };
type AddUnitBottom = { type: "add-unit-bottom"; unit: UnitEditorModel };
type SwitchPositions = {
  type: "switch-positions";
  source: number;
  destination: number;
};

export type SyncActions =
  | SetDivideIds
  | AddUnitBottom
  | AddUnitTop
  | SwitchPositions
  | ToggleDrag;

export interface SectionStateI {
  units: UnitsView[];
  divideIds: number[];
  drag: boolean;
  sections: { [section_id: number]: [number, number] };
}

// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const sectionReducer = (state: SectionStateI, action: SyncActions) => {
  switch (action.type) {
    case "toggle-drag":
      return {
        ...state,
        drag: !state.drag,
      };
    case "set-divide-ids":
      const currentIds = [...state.divideIds];
      const id = action.id;
      const newIds = filterOrAddIds(id, currentIds);
      return {
        ...state,
        divideIds: newIds,
      };
    case "add-unit-top":
      // for each unit in section increment postion_bottom 1
      const currentUnits = [...state.units];
      for (let i = 0; i < currentUnits.length; i++) {
        //@ts-ignore
        currentUnits[i].position_bottom++;
      }
      const newTopUnit = persistUnit(
        action.unit,
        currentUnits[0].position_bottom - 1
      );
      return {
        ...state,
        units: [newTopUnit, ...currentUnits],
      };
    case "add-unit-bottom":
      // just append to end here
      const newBottomUnit = persistUnit(
        action.unit,
        state.units[state.units.length - 1].position_bottom + 1
      );
      return {
        ...state,
        units: [...state.units, newBottomUnit],
      };
    case "switch-positions":
      // somewhat non-effcient way to create deep copy
      let currUnits = JSON.parse(JSON.stringify([...state.units]));

      // assign new p_b to dragged unit
      currUnits[action.source].position_bottom =
        currUnits[action.destination].position_bottom;

      currUnits = reorder(currUnits, action.source, action.destination);

      //if we moved a unit up the column source > destination => increment
      // all p_bs from source+1 -> destination
      if (action.source > action.destination) {
        for (let i = action.destination + 1; i <= action.source; i++) {
          currUnits[i].position_bottom++;
        }
      } else if (action.source < action.destination) {
        for (let i = action.destination - 1; i >= action.source; i--) {
          currUnits[i].position_bottom--;
        }
      }

      return {
        ...state,
        units: currUnits,
      };
  }
};

export { sectionReducer };