import { hyperStyled } from "@macrostrat/hyper";
import pg, {
  UnitsView,
  BasePage,
  UnitEditor,
  UnitEditorModel,
} from "../../src";
import { useRouter } from "next/router";
import { Spinner } from "@blueprintjs/core";
import styles from "./units.module.scss";
const h = hyperStyled(styles);

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

/* 
Needs a strat_name displayer, we'll be stricter with editing that

Need interval suggest component (2), Need A color picker, Contact suggests.
Tags for liths and environs; adding components for those too.
*/
function NewUnit() {
  const router = useRouter();
  const { project_id, col_id, section_id } = router.query;

  const model = { unit: { col_id }, liths: [], envs: [] };
  const persistChanges = async (
    updatedModel: UnitEditorModel,
    changeSet: Partial<UnitEditorModel>
  ) => {
    let s_id = section_id;
    if (s_id == null || s_id == "undefined") {
      // we're making a new section with this unit
      const { data, error } = await pg
        .from("sections")
        .insert([{ col_id: col_id }]);
      console.log("section!!", data);
      s_id = data ? data[0].id : null;
    }
    console.log(updatedModel, changeSet);
    let unit_id: number;

    const unit: Partial<UnitsView> = {};
    keys.map((k) => {
      if (k == "strat_name") {
        unit.strat_name_id = changeSet.unit?.strat_name.id;
      } else {
        //@ts-ignore
        unit[k] = changeSet.unit[k];
      }
    });
    unit.section_id = s_id;
    const { data, error } = await pg
      .from("units")
      .insert([{ col_id: col_id, ...unit }]);

    unit_id = data[0].id;
    if (changeSet.envs) {
      const inserts = changeSet.envs.map((e) => {
        return { unit_id: unit_id, environ_id: e.id };
      });
      const { data, error } = await pg.from("unit_environs").insert(inserts);
    }
    if (changeSet.liths) {
      const inserts = changeSet.liths.map((e) => {
        return { unit_id: unit_id, lith_id: e.id };
      });
      const { data, error } = await pg.from("unit_liths").insert(inserts);
    }
  };

  return h(BasePage, { query: router.query }, [
    //@ts-ignore
    h(UnitEditor, { model, persistChanges }),
  ]);
}

export default NewUnit;
