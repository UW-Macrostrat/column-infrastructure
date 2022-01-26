import { hyperStyled } from "@macrostrat/hyper";
import {
  UnitsView,
  LithUnit,
  EnvironUnit,
  IntervalI,
  IntervalRow,
  BasePage,
  TagBody,
  ColorBlock,
  Table,
} from "../index";
import { NumericInput, TextArea } from "@blueprintjs/core";
import styles from "./comp.module.scss";

const h = hyperStyled(styles);
/* 
Needs a strat_name displayer, we'll be stricter with editing that

Need interval suggest component (2), Need A color picker, Contact suggests.
Tags for liths and environs; adding components for those too.
*/
function UnitEdit({ model }) {
  const { unit, envs, liths, intervals } = model;
  console.log(model);

  return h("div", [
    h("h3", ["Edit Unit: ", unit.strat_name]),
    h(Table, { interactive: false }, [
      h("tbody", [
        h("tr", [
          h("td", [h("h4.strat-name", ["Stratigraphic Name: "])]),
          h("td", [
            unit.strat_name,
            h("a", { style: { fontSize: "10px" } }, ["(modify)"]),
          ]),
        ]),
        h(IntervalRow, {
          age_top: unit.age_top,
          position_top: unit.position_top,
          initialSelected: {
            id: unit.lo || 0,
            interval_name: unit.name_lo,
          },
          intervals,
          onChange: (interval: IntervalI) => console.log(interval),
          onPositionChange: (e) => console.log(e),
        }),
        h(IntervalRow, {
          onPositionChange: (e) => console.log(e),
          age_bottom: unit.age_bottom,
          position_bottom: unit.position_bottom,
          initialSelected: {
            id: unit.fo || 0,
            interval_name: unit.name_fo,
          },
          intervals,
          onChange: (interval: IntervalI) => console.log(interval),
        }),
        h("tr", [
          h("td", [h("h4.strat-name", ["Color: "])]),
          h("td", [
            h(ColorBlock, {
              onChange: (color) => console.log(color),
              color: unit.color,
            }),
          ]),
          h("td", [h("h4.strat-name", ["Min-Thick: "])]),
          h("td", [
            h(NumericInput, {
              onValueChange: () => {},
              defaultValue: unit.min_thick,
            }),
          ]),
          h("td", [h("h4.strat-name", ["Max-Thick: "])]),
          h("td", [
            h(NumericInput, {
              onValueChange: () => {},
              defaultValue: unit.max_thick,
            }),
          ]),
        ]),
        h("tr", [
          h("td", [h("h4.strat-name", "Notes: ")]),
          h("td", { colspan: 5 }, [h(TextArea)]),
        ]),
        h("tr", [
          h("td", [h("h4.strat-name", ["Lithologies: "])]),
          h("td", { colspan: 5 }, [
            liths.map((lith_, i) => {
              const {
                id,
                lith_color,
                lith,
                lith_class,
                lith_group,
                lith_type,
              } = lith_;
              return h(TagBody, {
                key: i,
                id,
                color: lith_color,
                isEditing: true,
                onClickDelete: (e) => console.log(e),
                name: lith,
                description: lith_class,
              });
            }),
          ]),
        ]),
        h("tr", [
          h("td", [h("h4.strat-name", ["Environments: "])]),
          h("td", { colspan: 5 }, [
            envs.map((envir, i) => {
              const { id, environ, environ_color, environ_class } = envir;
              return h(TagBody, {
                key: i,
                id,
                color: environ_color,
                isEditing: true,
                onClickDelete: (e) => console.log(e),
                name: environ,
                description: environ_class,
              });
            }),
          ]),
        ]),
      ]),
    ]),
  ]);
}

interface UnitEditorModel {
  unit: UnitsView;
  envs: EnvironUnit[];
  liths: LithUnit[];
  intervals: IntervalI[];
}

interface UnitEditorProps {
  persistChanges: (e: Partial<UnitsView>, c: Partial<UnitsView>) => UnitsView;
  model: UnitEditorModel | {};
}

function UnitEditor(props: UnitEditorProps) {
  return h(UnitEdit, { model: props.model });
}

export { UnitEditor };
