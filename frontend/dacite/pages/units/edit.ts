import { hyperStyled } from "@macrostrat/hyper";
import pg, {
  usePostgrest,
  UnitsView,
  LithUnit,
  EnvironUnit,
  IntervalI,
  BasePage,
  UnitEditor,
} from "../../src";
import { useRouter } from "next/router";
import { Spinner } from "@blueprintjs/core";
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
  return { units, envs, liths };
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
  const { units, envs, liths } = getUnitData(unit_id);
  if (!units || !envs || !liths) return h(Spinner);
  const unit = units[0];

  const model = { unit, envs, liths };
  const persistChanges = (updatedModel, changeSet) => {
    console.log(updatedModel, changeSet);
  };

  return h(BasePage, { query: router.query }, [
    //@ts-ignore
    h(UnitEditor, { model, persistChanges }),
  ]);
}

export default UnitEdit;
