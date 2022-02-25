import React from "react";
import { hyperStyled } from "@macrostrat/hyper";
import Link from "next/link";
import {
  UnitsView,
  LithUnit,
  EnvironUnit,
  IntervalRow,
  IntervalDataI,
  TagContainerCell,
  ColorBlock,
  Table,
} from "../../index";
import {
  Tooltip2 as Tooltip,
  Popover2 as Popover,
} from "@blueprintjs/popover2";
import { Button, NumericInput, TextArea } from "@blueprintjs/core";
import {
  ModelEditor,
  useModelEditor,
  ModelEditButton,
  //@ts-ignore
} from "@macrostrat/ui-components/lib/esm";
import styles from "../comp.module.scss";
import {
  CancelButton,
  EnvTagsAdd,
  InfoCell,
  LithTagsAdd,
  SubmitButton,
} from "..";
import { createLink } from "../helpers";
import { useRouter } from "next/router";

const h = hyperStyled(styles);

function EnvTags() {
  const {
    model,
    isEditing,
    actions,
  }: {
    model: UnitEditorModel;
    isEditing: boolean;
    actions: any;
  } = useModelEditor();
  const { envs } = model;

  const tagData = envs.map((env) => {
    return {
      id: env.id,
      color: env.environ_color,
      name: env.environ,
      description: env.environ_class,
    };
  });

  const onClickDelete = (id: number) => {
    const filteredEnvs = [...envs].filter((l) => l.id != id);
    actions.updateState({ model: { envs: { $set: filteredEnvs } } });
  };

  const onClick = (env: Partial<EnvironUnit>) => {
    actions.updateState({ model: { envs: { $push: [env] } } });
  };

  return h("div.tag-container", [
    h(TagContainerCell, { data: tagData, onClickDelete, isEditing }),
    h(Popover, { content: h(EnvTagsAdd, { onClick }) }, [
      h(Tooltip, { content: "Add an environment" }, [
        h(Button, { icon: "plus", minimal: true, intent: "success" }),
      ]),
    ]),
  ]);
}
function LithTags() {
  const {
    model,
    isEditing,
    actions,
  }: {
    model: UnitEditorModel;
    isEditing: boolean;
    actions: any;
  } = useModelEditor();
  const { liths } = model;

  const tagData = liths.map((lith) => {
    return {
      id: lith.id,
      color: lith.lith_color,
      name: lith.lith,
      description: lith.lith_class,
    };
  });

  const onClickDelete = (id: number) => {
    const filteredLiths = [...liths].filter((l) => l.id != id);
    actions.updateState({ model: { liths: { $set: filteredLiths } } });
  };

  const onClick = (lith: Partial<LithUnit>) => {
    actions.updateState({ model: { liths: { $push: [lith] } } });
  };

  return h("div.tag-container", [
    h(TagContainerCell, { data: tagData, onClickDelete, isEditing }),
    h(Popover, { content: h(LithTagsAdd, { onClick }) }, [
      h(Tooltip, { content: "Add a lithology" }, [
        h(Button, { icon: "plus", minimal: true, intent: "success" }),
      ]),
    ]),
  ]);
}
function UnitThickness() {
  const {
    model,
    actions,
  }: { model: UnitEditorModel; actions: any } = useModelEditor();
  const { unit } = model;

  const update = (field: string, e: any) => {
    actions.updateState({ model: { unit: { [field]: { $set: e } } } });
  };

  return h(React.Fragment, [
    h(InfoCell, { text: "Min-Thick: " }),
    h("td", [
      h(NumericInput, {
        onValueChange: (e) => update("min_thick", e),
        defaultValue: unit?.min_thick,
      }),
    ]),
    h(InfoCell, { text: "Max-Thick: " }),
    h("td", [
      h(NumericInput, {
        onValueChange: (e) => update("max_thick", e),
        defaultValue: unit?.max_thick,
      }),
    ]),
  ]);
}

function StratName() {
  const router = useRouter();
  const { model } = useModelEditor();
  const { unit }: UnitEditorModel = model;

  const href = unit.strat_name_id
    ? createLink(`/strat-name/edit`, {
        ...router.query,
        strat_name_id: unit.strat_name_id,
      })
    : "new";

  return h("tr", [
    h(InfoCell, { text: "Stratigraphic Name: " }),
    h("td", [
      unit?.strat_name || unit.unit_strat_name || "Unnamed",
      h(Link, { href }, [
        h("a", { style: { fontSize: "10px" } }, ["(modify)"]),
      ]),
    ]),
  ]);
}

interface UnitPositionI {
  position_bottom?: number;
  position_top?: number;
  onPositionChange: (e: number) => void;
}

function UnitPosition(props: UnitPositionI) {
  const positionLabel: string = props.position_bottom
    ? "Position Bottom: "
    : "Position Top: ";

  return h(React.Fragment, [
    h(InfoCell, { text: positionLabel }),
    h("td", [
      h(NumericInput, {
        onValueChange: props.onPositionChange,
        defaultValue: props.position_bottom || props.position_top,
      }),
    ]),
  ]);
}

/* 
Needs a strat_name displayer, we'll be stricter with editing that

Need interval suggest component (2), Need A color picker, Contact suggests.
Tags for liths and environs; adding components for those too.
*/
function UnitEdit() {
  const { model, hasChanges, actions, ...rest } = useModelEditor();
  console.log(model, actions, rest);
  const { unit }: { unit: UnitsView } = model;

  const updateUnit = (field: string, e: any) => {
    actions.updateState({ model: { unit: { [field]: { $set: e } } } });
  };

  const onChangeLo = (interval: IntervalDataI) => {
    const { data } = interval;
    const { id: lo, interval_name: name_lo, age_top } = data;
    actions.updateState({
      model: {
        unit: {
          lo: { $set: lo },
          name_lo: { $set: name_lo },
          age_top: { $set: age_top },
        },
      },
    });
  };

  const onChangeFo = (interval: IntervalDataI) => {
    const { data } = interval;
    const { id: fo, interval_name: name_fo, age_bottom } = data;
    actions.updateState({
      model: {
        unit: {
          fo: { $set: fo },
          name_fo: { $set: name_fo },
          age_bottom: { $set: age_bottom },
        },
      },
    });
  };

  return h("div", [
    h(Table, { interactive: false }, [
      h("tbody", [
        h(StratName),
        h("tr", [
          h(IntervalRow, {
            age_top: unit?.age_top,
            initialSelected: {
              value: unit?.name_lo,
              data: { id: unit?.lo || 0, interval_name: unit?.name_lo },
            },
            onChange: onChangeLo,
          }),
          h(UnitPosition, {
            onPositionChange: (e) => updateUnit("position_top", e),
            position_top: unit?.position_top,
          }),
        ]),
        h("tr", [
          h(IntervalRow, {
            age_bottom: unit?.age_bottom,
            initialSelected: {
              value: unit?.name_fo,
              data: {
                id: unit?.fo || 0,
                interval_name: unit?.name_fo,
              },
            },
            onChange: onChangeFo,
          }),
          h(UnitPosition, {
            onPositionChange: (e) => updateUnit("position_bottom", e),
            position_bottom: unit?.position_bottom,
          }),
        ]),
        h("tr", [
          h(InfoCell, { text: "Color: " }),
          h("td", [
            h(ColorBlock, {
              onChange: (color) => {
                actions.updateState({
                  model: { unit: { color: { $set: color } } },
                });
              },
              color: unit?.color,
            }),
          ]),
          h(UnitThickness),
        ]),
        h("tr", [
          h(InfoCell, { text: "Notes: " }),
          h("td", { colSpan: 5 }, [
            h(TextArea, {
              value: unit.notes,
              onChange: (e) => updateUnit("notes", e.target.value),
            }),
          ]),
        ]),
        h("tr", [
          h(InfoCell, { text: "Lithologies: " }),
          h("td", { colSpan: 5 }, [h(LithTags)]),
        ]),
        h("tr", [
          h(InfoCell, { text: "Environments: " }),
          h("td", { colSpan: 5 }, [h(EnvTags)]),
        ]),
      ]),
    ]),
    h(SubmitButton),
    h(CancelButton, { href: "/units" }),
  ]);
}

export interface UnitEditorModel {
  unit: UnitsView;
  envs: EnvironUnit[];
  liths: LithUnit[];
}

interface UnitEditorProps {
  persistChanges: (e: Partial<UnitsView>, c: Partial<UnitsView>) => UnitsView;
  model: UnitEditorModel | {};
}

function UnitEditor(props: UnitEditorProps) {
  return h(
    ModelEditor,
    {
      model: props.model,
      //@ts-ignore
      persistChanges: props.persistChanges,
      canEdit: true,
      isEditing: true,
    },
    [h(UnitEdit)]
  );
}

export { UnitEditor };
