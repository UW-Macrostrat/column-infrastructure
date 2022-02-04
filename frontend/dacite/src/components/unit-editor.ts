import { hyperStyled } from "@macrostrat/hyper";
import {
  UnitsView,
  LithUnit,
  EnvironUnit,
  IntervalI,
  IntervalRow,
  TagContainerCell,
  ColorBlock,
  Table,
} from "../index";
import {
  Tooltip2 as Tooltip,
  Popover2 as Popover,
} from "@blueprintjs/popover2";
import { Button, NumericInput, TextArea } from "@blueprintjs/core";
import {
  ModelEditor,
  useModelEditor,
  ModelEditButton,
} from "@macrostrat/ui-components/lib/esm";
import styles from "./comp.module.scss";
import { EnvTagsAdd, LithTagsAdd } from ".";

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

  const onClickDelete = (env) => {
    const filteredLiths = [...envs].filter((l) => l.id != env.id);
    actions.updateState({ model: { envs: { $set: filteredLiths } } });
  };

  const onClick = (env) => {
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

  const onClickDelete = (lith) => {
    const filteredLiths = [...liths].filter((l) => l.id != lith.id);
    actions.updateState({ model: { liths: { $set: filteredLiths } } });
  };

  const onClick = (lith) => {
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

  return h([
    h("td", [h("h4.strat-name", ["Min-Thick: "])]),
    h("td", [
      h(NumericInput, {
        onValueChange: (e) => update("min_thick", e),
        defaultValue: unit?.min_thick,
      }),
    ]),
    h("td", [h("h4.strat-name", ["Max-Thick: "])]),
    h("td", [
      h(NumericInput, {
        onValueChange: (e) => update("max_thick", e),
        defaultValue: unit?.max_thick,
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
  const { unit } = model;

  const updateUnit = (field: string, e: any) => {
    actions.updateState({ model: { unit: { [field]: { $set: e } } } });
  };

  return h("div", [
    h(Table, { interactive: false }, [
      h("tbody", [
        h("tr", [
          h("td", [h("h4.strat-name", ["Stratigraphic Name: "])]),
          h("td", [
            unit?.strat_name,
            h("a", { style: { fontSize: "10px" } }, ["(modify)"]),
          ]),
        ]),
        h(IntervalRow, {
          age_top: unit?.age_top,
          position_top: unit?.position_top,
          initialSelected: {
            id: unit?.lo || 0,
            interval_name: unit?.name_lo,
          },
          onChange: (interval: IntervalI) => {
            const { id: lo, interval_name: name_lo, age_top } = interval;
            actions.updateState({
              model: {
                unit: {
                  lo: { $set: lo },
                  name_lo: { $set: name_lo },
                  age_top: { $set: age_top },
                },
              },
            });
          },
          onPositionChange: (e) => updateUnit("position_top", e),
        }),
        h(IntervalRow, {
          onPositionChange: (e) => updateUnit("position_bottom", e),
          age_bottom: unit?.age_bottom,
          position_bottom: unit?.position_bottom,
          initialSelected: {
            id: unit?.fo || 0,
            interval_name: unit?.name_fo,
          },
          onChange: (interval: IntervalI) => {
            const { id: fo, interval_name: name_fo, age_bottom } = interval;
            actions.updateState({
              model: {
                unit: {
                  fo: { $set: fo },
                  name_fo: { $set: name_fo },
                  age_bottom: { $set: age_bottom },
                },
              },
            });
          },
        }),
        h("tr", [
          h("td", [h("h4.strat-name", ["Color: "])]),
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
          h("td", [h("h4.strat-name", "Notes: ")]),
          h("td", { colSpan: 5 }, [
            h(TextArea),
            h("b", ["NOTE: There is no notes in the db... "]),
          ]),
        ]),
        h("tr", [
          h("td", [h("h4.strat-name", ["Lithologies: "])]),
          h("td", { colSpan: 5 }, [h(LithTags)]),
        ]),
        h("tr", [
          h("td", [h("h4.strat-name", ["Environments: "])]),
          h("td", { colSpan: 5 }, [h(EnvTags)]),
        ]),
      ]),
    ]),
    h(
      Button,
      {
        intent: "success",
        disabled: !hasChanges(),
        onClick: () => actions.persistChanges(),
      },
      ["Submit"]
    ),
  ]);
}

interface UnitEditorModel {
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
