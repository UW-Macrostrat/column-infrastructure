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

/* 
Needs a strat_name displayer, we'll be stricter with editing that

Need interval suggest component (2), Need A color picker, Contact suggests.
Tags for liths and environs; adding components for those too.
*/
function UnitEdit() {
  const router = useRouter();
  const { project_id, col_id, section_id, unit_id } = router.query;
  if (!unit_id) return h(Spinner);

  const model = { unit: {}, liths: [], envs: [] };
  const persistChanges = (
    updatedModel: UnitsView,
    changeSet: Partial<UnitsView>
  ) => {
    console.log(updatedModel, changeSet);
  };

  return h(BasePage, { query: router.query }, [
    //@ts-ignore
    h(UnitEditor, { model, persistChanges }),
  ]);
}

export default UnitEdit;
