import { hyperStyled } from "@macrostrat/hyper";
import pg, {
  usePostgrest,
  UnitsView,
  LithUnit,
  EnvironUnit,
  IntervalI,
  IntervalRow,
  BasePage,
  TagBody,
  ColorBlock,
  Table,
  UnitEditor,
} from "../../src";
import { useRouter } from "next/router";
import { Spinner, NumericInput, TextArea } from "@blueprintjs/core";
import styles from "./units.module.scss";

const h = hyperStyled(styles);

function getUnitData(unit_id: number) {
  const units: UnitsView[] = usePostgrest(
    pg
      .from("units_view")
      .select()
      .match({ id: unit_id })
      .limit(1)
  );
  const envs: EnvironUnit[] = usePostgrest(
    pg
      .from("environ_unit")
      .select()
      .match({ unit_id: unit_id })
  );
  const liths: LithUnit[] = usePostgrest(
    pg
      .from("lith_unit")
      .select()
      .match({ unit_id: unit_id })
  );
  const intervals: IntervalI[] = usePostgrest(pg.from("intervals"));
  return { units, envs, liths, intervals };
}

/* 
Needs a strat_name displayer, we'll be stricter with editing that

Need interval suggest component (2), Need A color picker, Contact suggests.
Tags for liths and environs; adding components for those too.
*/
function UnitEdit() {
  const router = useRouter();
  const { project_id, col_id, section_id, unit_id } = router.query;
  if (!unit_id) return h(Spinner);
  const { units, envs, liths, intervals } = getUnitData(unit_id);
  if (!units || !envs || !liths || !intervals) return h(Spinner);
  const unit = units[0];

  const model = { unit, envs, liths, intervals };
  const persistChanges = (e, c) => {
    console.log(e, c);
  };

  return h(BasePage, { query: router.query }, [
    h(UnitEditor, { model, persistChanges }),
  ]);

  //   return h(BasePage, { query: router.query }, [
  //     h("h3", ["Edit Unit: ", unit.strat_name]),
  //     h(Table, { interactive: false }, [
  //       h("tbody", [
  //         h("tr", [
  //           h("td", [h("h4.strat-name", ["Stratigraphic Name: "])]),
  //           h("td", [
  //             unit.strat_name,
  //             h("a", { style: { fontSize: "10px" } }, ["(modify)"]),
  //           ]),
  //         ]),
  //         h(IntervalRow, {
  //           age_top: unit.age_top,
  //           position_top: unit.position_top,
  //           initialSelected: {
  //             id: unit.lo || 0,
  //             interval_name: unit.name_lo,
  //           },
  //           intervals,
  //           onChange: (interval: IntervalI) => console.log(interval),
  //           onPositionChange: (e) => console.log(e),
  //         }),
  //         h(IntervalRow, {
  //           onPositionChange: (e) => console.log(e),
  //           age_bottom: unit.age_bottom,
  //           position_bottom: unit.position_bottom,
  //           initialSelected: {
  //             id: unit.fo || 0,
  //             interval_name: unit.name_fo,
  //           },
  //           intervals,
  //           onChange: (interval: IntervalI) => console.log(interval),
  //         }),
  //         h("tr", [
  //           h("td", [h("h4.strat-name", ["Color: "])]),
  //           h("td", [
  //             h(ColorBlock, {
  //               onChange: (color) => console.log(color),
  //               color: unit.color,
  //             }),
  //           ]),
  //           h("td", [h("h4.strat-name", ["Min-Thick: "])]),
  //           h("td", [
  //             h(NumericInput, {
  //               onValueChange: () => {},
  //               defaultValue: unit.min_thick,
  //             }),
  //           ]),
  //           h("td", [h("h4.strat-name", ["Max-Thick: "])]),
  //           h("td", [
  //             h(NumericInput, {
  //               onValueChange: () => {},
  //               defaultValue: unit.max_thick,
  //             }),
  //           ]),
  //         ]),
  //         h("tr", [
  //           h("td", [h("h4.strat-name", "Notes: ")]),
  //           h("td", { colspan: 5 }, [h(TextArea)]),
  //         ]),
  //         h("tr", [
  //           h("td", [h("h4.strat-name", ["Lithologies: "])]),
  //           h("td", { colspan: 5 }, [
  //             liths.map((lith_, i) => {
  //               const {
  //                 id,
  //                 lith_color,
  //                 lith,
  //                 lith_class,
  //                 lith_group,
  //                 lith_type,
  //               } = lith_;
  //               return h(TagBody, {
  //                 key: i,
  //                 id,
  //                 color: lith_color,
  //                 isEditing: true,
  //                 onClickDelete: (e) => console.log(e),
  //                 name: lith,
  //                 description: lith_class,
  //               });
  //             }),
  //           ]),
  //         ]),
  //         h("tr", [
  //           h("td", [h("h4.strat-name", ["Environments: "])]),
  //           h("td", { colspan: 5 }, [
  //             envs.map((envir, i) => {
  //               const { id, environ, environ_color, environ_class } = envir;
  //               return h(TagBody, {
  //                 key: i,
  //                 id,
  //                 color: environ_color,
  //                 isEditing: true,
  //                 onClickDelete: (e) => console.log(e),
  //                 name: environ,
  //                 description: environ_class,
  //               });
  //             }),
  //           ]),
  //         ]),
  //       ]),
  //     ]),
  //   ]);
}

export default UnitEdit;
