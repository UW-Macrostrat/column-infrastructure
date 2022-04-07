import { hyperStyled } from "@macrostrat/hyper";
import { getCookie } from "cookies-next";
import pg, {
  usePostgrest,
  UnitsView,
  LithUnit,
  EnvironUnit,
  UnitEditorModel,
  BasePage,
  UnitEditor,
  PagePropsBaseI,
} from "../../src";
import {
  conductChangeSet,
  detectDeletionsAndAdditions,
} from "../../src/components/helpers";
import { useRouter } from "next/router";
import { Spinner } from "@blueprintjs/core";
import styles from "./units.module.scss";
const h = hyperStyled(styles);

function getUnitData(unit_id: number) {
  const units: UnitsView[] = usePostgrest(
    pg.from("units_view").select().match({ id: unit_id }).limit(1)
  );
  const envs: EnvironUnit[] = usePostgrest(
    pg.from("environ_unit").select().match({ unit_id: unit_id })
  );
  const liths: LithUnit[] = usePostgrest(
    pg.from("lith_unit").select().match({ unit_id: unit_id })
  );
  return { units, envs, liths };
}

/* 
Needs a strat_name displayer, we'll be stricter with editing that

Need interval suggest component (2), Need A color picker, Contact suggests.
Tags for liths and environs; adding components for those too.
*/
function UnitEdit(props: PagePropsBaseI) {
  const { project_id, col_id, section_id, unit_id } = props.query;
  if (!unit_id) return h(Spinner);
  const { units, envs, liths } = getUnitData(unit_id);
  if (!units || !envs || !liths) return h(Spinner);
  const unit = units[0];

  const model = { unit, envs, liths };
  const persistChanges = async (
    updatedModel: UnitEditorModel,
    changeSet: Partial<UnitEditorModel>
  ) => {
    if (changeSet.unit) {
      const changes = conductChangeSet(unit, changeSet.unit);
      const { data, error } = await pg
        .auth(props.token)
        .from("units")
        .update(changes)
        .match({ id: unit.id });
    }

    if (changeSet.envs) {
      const { deletions, additions } = detectDeletionsAndAdditions(
        envs,
        changeSet.envs
      );
      if (additions.length > 0) {
        const inserts = additions.map((i) => {
          return { unit_id: unit.id, environ_id: i };
        });
        const { data, error } = await pg.from("unit_environs").insert(inserts);
      }
      if (deletions.length > 0) {
        const { data, error } = await pg
          .auth(props.token)
          .from("unit_environs")
          .delete()
          .in("environ_id", deletions)
          .match({ unit_id: unit.id });
      }
    }
    if (changeSet.liths) {
      const { deletions, additions } = detectDeletionsAndAdditions(
        liths,
        changeSet.liths
      );
      if (additions.length > 0) {
        const inserts = additions.map((i) => {
          return { unit_id: unit.id, lith_id: i };
        });
        const { data, error } = await pg
          .auth(props.token)
          .from("unit_liths")
          .insert(inserts);
      }
      if (deletions.length > 0) {
        const { data, error } = await pg
          .auth(props.token)
          .from("unit_liths")
          .delete()
          .in("lith_id", deletions)
          .match({ unit_id: unit.id });
      }
    }
    return updatedModel;
  };

  return h(BasePage, { query: props.query, token: props.token }, [
    h("h3", [
      "Edit Unit: ",
      unit.unit_strat_name ||
        `${unit.strat_name?.strat_name} ${unit.strat_name.rank}`,
    ]),
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

export default UnitEdit;
