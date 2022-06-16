import React, { useReducer } from "react";
import { hyperStyled } from "@macrostrat/hyper";
import {
  ColumnStateI,
  UnitEditorModel,
  UnitsView,
  ColSectionsTable,
  ColSectionI,
  MinEditorToggle,
} from "~/index";
import { columnReducer } from "../column";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { DropResult, DroppableProvided } from "react-beautiful-dnd";
import { ColumnPageBtnMenu, useRowUnitEditor } from "./helpers";

import styles from "~/components/comp.module.scss";
import { SectionTable } from "./section";
import { NewSectionBtn } from "../unit/minimal-unit-editor";
import { UnitRowEditorModal } from "./unit";

const h = hyperStyled(styles);

interface SectionUnitTableProps {
  state: ColumnStateI;
  onDragEnd: (r: DropResult) => void;
  addSectionAt: (n: number) => void;
  addUnitAt: (
    u: UnitEditorModel,
    section_index: number,
    unit_index: number
  ) => void;
  editUnitAt: (
    u: UnitEditorModel,
    section_index: number,
    unit_index: number
  ) => void;
}

function SectionsDropContainer(props: SectionUnitTableProps) {
  const {
    state: { sections, moved },
    onDragEnd,
  } = props;
  const {
    editOpen,
    triggerEditor,
    onCancel,
    unit_index,
    section_index,
    editMode,
  } = useRowUnitEditor();

  const unitForEditor = Object.values(sections[section_index])[0][unit_index];
  const dialogTitle =
    editMode.mode == "edit"
      ? `Edit unit #${unitForEditor?.id ?? ""}`
      : `Add unit ${editMode.mode} unit #${unitForEditor?.id ?? ""}`;

  const persistChanges = (e: UnitEditorModel, c: Partial<UnitEditorModel>) => {
    if (editMode.mode == "edit") {
      props.editUnitAt(e, section_index, unit_index);
    } else {
      let i = unit_index;
      if (editMode.mode == "below") {
        i++;
      }
      props.addUnitAt(e, section_index, i);
    }
    onCancel();
  };

  const editingModel = editMode.copy
    ? { unit: unitForEditor }
    : { unit: { lith_unit: [], environ_unit: [] } };

  return h("div", [
    h(UnitRowEditorModal, {
      model: editingModel,
      persistChanges: persistChanges,
      onCancel: onCancel,
      title: dialogTitle,
      open: editOpen && !editMode.inRow,
    }),
    h(DragDropContext, { onDragEnd }, [
      h(
        Droppable,
        {
          droppableId: "unit-section-tables",
          type: "SECTIONS",
          isCombineEnabled: true,
        },
        [
          (provided: DroppableProvided) => {
            return h(
              "div",
              { ...provided.droppableProps, ref: provided.innerRef },
              [
                h(NewSectionBtn, {
                  index: 0,
                  addNewSection: props.addSectionAt,
                }),
                sections.map((section, i) => {
                  const addUnitAt = (e: UnitEditorModel, n: number) => {
                    props.addUnitAt(e, i, n);
                  };
                  return h(React.Fragment, [
                    h(SectionTable, {
                      addUnitAt,
                      editingModel,
                      section,
                      unit_index,
                      section_index,
                      editOpen,
                      editMode,
                      triggerEditor,
                      onCancel,
                      dialogTitle,
                      persistChanges,
                      index: i,
                      drag: props.state.drag,
                      moved,
                    }),
                    h(NewSectionBtn, {
                      index: i + 1,
                      addNewSection: props.addSectionAt,
                    }),
                  ]);
                }),
                provided.placeholder,
              ]
            );
          },
        ]
      ),
    ]),
  ]);
}

function UnitSectionTable(props: {
  colSections: ColSectionI[];
  sections: { [section_id: number | string]: UnitsView[] }[];
}) {
  const { colSections, sections } = props;

  const [state, dispatch] = useReducer(columnReducer, {
    sections,
    originalSections: sections,
    mergeIds: [],
    moved: {},
    drag: false,
    unitsView: true,
  });

  const onChange = (id: number) => {
    dispatch({ type: "set-merge-ids", id });
  };

  const onDragEnd = (r: DropResult) => {
    if (r.type == "SECTIONS") {
      dispatch({ type: "dropped-section", result: r });
    } else {
      dispatch({ type: "dropped-unit", result: r });
    }
  };

  const addUnitAt = (
    unit: UnitEditorModel,
    section_index: number,
    unit_index: number
  ) => {
    dispatch({
      type: "add-unit-at",
      section_index,
      unit,
      unit_index,
    });
  };

  const editUnitAt = (
    unit: UnitEditorModel,
    section_index: number,
    unit_index: number
  ) => {
    dispatch({
      type: "edit-unit-at",
      section_index,
      unit,
      unit_index,
    });
  };
  const addSectionAt = (index: number) => {
    dispatch({ type: "add-section-at", index });
  };
  return h("div", [
    h(ColumnPageBtnMenu, {
      state: {
        unitsView: state.unitsView,
        drag: state.drag,
        mergeIds: state.mergeIds,
        moved: state.moved,
      },
      toggleUnitsView: () => dispatch({ type: "toggle-units-view" }),
      toggleDrag: () => {
        dispatch({ type: "toggle-drag" });
      },
      divideSection: () => {},
      mergeSections: () => {},
      noSectionView: colSections.length == 0,
    }),
    h.if(colSections.length > 0 && !state.unitsView)(ColSectionsTable, {
      colSections,
      onChange,
    }),
    h.if(state.sections.length > 0 && state.unitsView)(
      "div.unit-section-container",
      [
        h("div.unit-section-tables", [
          h(SectionsDropContainer, {
            state,
            onDragEnd,
            editUnitAt,
            addUnitAt,
            addSectionAt,
          }),
        ]),
      ]
    ),
  ]);
}

export { UnitSectionTable };
