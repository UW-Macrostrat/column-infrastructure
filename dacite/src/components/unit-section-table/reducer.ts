import { DropResult } from "react-beautiful-dnd";
import { filterOrAddIds, UnitEditorModel, UnitsView } from "~/index";

///////////////// helper functions //////////////
/* 
    This would be async and would persist to db 
    then would return db representation which we 
    would add to units in a Sync Action
*/
function persistUnit(unit: UnitEditorModel) {
  let color = "#FFFFF";
  if (
    typeof unit.unit.lith_unit !== "undefined" &&
    unit.unit.lith_unit.length > 0
  ) {
    color = unit.unit?.lith_unit[0].lith_color;
  }
  const newUnit = {
    ...unit.unit,
    id: unit.unit.id ?? 666,
    color: unit.unit.color ?? color,
  };
  return newUnit;
}

// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number): void => {
  const [removed] = list.splice(startIndex, 1);
  list.splice(endIndex, 0, removed);
};

/////////////// Data Types //////////////////

type SectionUnits = { [section_id: string | number]: UnitsView[] }[];

/////////////// Action Types ///////////////

type SetMergeIds = { type: "set-merge-ids"; id: number };
type SetDivideIds = { type: "set-divide-ids"; id: number };
type MergeIds = { type: "merge-ids" };
type DroppedUnit = {
  type: "dropped-unit";
  result: DropResult;
};
type ToggleDrag = { type: "toggle-drag" };
type ToggleUnitsView = { type: "toggle-units-view" };
type AddUnitAt = {
  type: "add-unit-at";
  section_index: number;
  unit_index: number;
  unit: UnitEditorModel;
};

type EditUnitAt = {
  type: "edit-unit-at";
  section_index: number;
  unit_index: number;
  unit: UnitEditorModel;
};

export type SyncActions =
  | SetMergeIds
  | SetDivideIds
  | DroppedUnit
  | MergeIds
  | ToggleDrag
  | AddUnitAt
  | EditUnitAt
  | ToggleUnitsView;

export interface ColumnStateI {
  sections: SectionUnits;
  mergeIds: number[];
  divideIds: number[];
  drag: boolean;
  unitsView: boolean;
}

const columnReducer = (state: ColumnStateI, action: SyncActions) => {
  const currSections: SectionUnits = JSON.parse(JSON.stringify(state.sections));
  switch (action.type) {
    case "set-merge-ids":
      const currentIds = [...state.mergeIds];
      const id = action.id;
      const newIds = filterOrAddIds(id, currentIds);
      return {
        ...state,
        mergeIds: newIds,
      };
    case "set-divide-ids":
      const currentDiIds = [...state.divideIds];
      const id_ = action.id;
      const newDiIds = filterOrAddIds(id_, currentDiIds);
      return {
        ...state,
        divideIds: newDiIds,
      };
    case "toggle-drag":
      return {
        ...state,
        drag: !state.drag,
      };
    case "toggle-units-view":
      return {
        ...state,
        unitsView: !state.unitsView,
      };
    case "merge-ids":
      console.log("Merging sections ", state.mergeIds);
      return state;
    case "add-unit-at":
      // this will encapsulate the add top and bottom
      // mutate a the sections list in place
      const section_id = Object.keys(currSections[action.section_index])[0];

      currSections[action.section_index][section_id].splice(
        action.unit_index,
        0,
        persistUnit(action.unit)
      );
      return {
        ...state,
        sections: currSections,
      };
    case "edit-unit-at":
      const section_id_ = Object.keys(currSections[action.section_index])[0];

      currSections[action.section_index][section_id_].splice(
        action.unit_index,
        1,
        persistUnit(action.unit)
      );
      return {
        ...state,
        sections: currSections,
      };
    case "dropped-unit":
      if (typeof action.result.destination === "undefined") return state;
      let source_index = action.result.source.index;
      let destination_index = action.result.destination.index;

      /// our drop result source and destination provide
      // The index of where to find the section in our list as well
      //  as the section_id itself.
      const [sourceSectionIndex, sourceSection] =
        action.result.source.droppableId.split(" ");
      const [destSectionIndex, destSection] =
        action.result.destination.droppableId.split(" ");

      if (sourceSection === destSection) {
        // same unit
        reorder(
          currSections[parseInt(sourceSectionIndex)][sourceSection],
          source_index,
          destination_index
        );
      } else {
        // we changed sections!
        const [movedUnit] = currSections[parseInt(sourceSectionIndex)][
          sourceSection
        ].splice(source_index, 1);
        movedUnit["section_id"] = parseInt(destSection);

        currSections[parseInt(destSectionIndex)][destSection].splice(
          destination_index,
          0,
          movedUnit
        );
      }

      return {
        ...state,
        sections: currSections,
      };
  }
};

export { columnReducer };