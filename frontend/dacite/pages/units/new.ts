import { hyperStyled } from "@macrostrat/hyper";
import { getCookie } from "cookies-next";
import pg, {
  UnitsView,
  BasePage,
  UnitEditor,
  UnitEditorModel,
  PagePropsBaseI,
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
function NewUnit(props: PagePropsBaseI) {
  const { project_id, col_id, section_id } = props.query;

  const model = { unit: { col_id }, liths: [], envs: [] };
  const persistChanges = async (
    updatedModel: UnitEditorModel,
    changeSet: Partial<UnitEditorModel>
  ) => {
    let s_id = section_id;
    if (s_id == null || typeof s_id === undefined) {
      // we're making a new section with this unit
      const { data, error } = await pg
        .auth(props.token)
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
      .auth(props.token)
      .from("units")
      .insert([{ col_id: col_id, ...unit }]);

    unit_id = data[0].id;
    if (changeSet.envs) {
      const inserts = changeSet.envs.map((e) => {
        return { unit_id: unit_id, environ_id: e.id };
      });
      const { data, error } = await pg
        .auth(props.token)
        .from("unit_environs")
        .insert(inserts);
    }
    if (changeSet.liths) {
      const inserts = changeSet.liths.map((e) => {
        return { unit_id: unit_id, lith_id: e.id };
      });
      const { data, error } = await pg
        .auth(props.token)
        .from("unit_liths")
        .insert(inserts);
    }
  };

  return h(BasePage, { query: props.query, token: props.token }, [
    //@ts-ignore
    h(UnitEditor, { model, persistChanges }),
  ]);
}

export async function getServerSideProps(ctx) {
  const { req, res, query } = ctx;

  const token = getCookie("jwt_token", { req, res });

  return {
    props: { token, query }, // will be passed to the page component as props
  };
}

export default NewUnit;
