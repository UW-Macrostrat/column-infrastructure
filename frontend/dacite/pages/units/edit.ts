import { hyperStyled } from "@macrostrat/hyper";
import { UnitEditorModel, BasePage, UnitEditor } from "../../src";
import { useRouter } from "next/router";
import { Spinner } from "@blueprintjs/core";
import { getUnitData, persistUnitChanges } from "./edit-helpers";
import styles from "./units.module.scss";
const h = hyperStyled(styles);

/* 
Needs a strat_name displayer, we'll be stricter with editing that

Need interval suggest component (2), Need A color picker, Contact suggests.
Tags for liths and environs; adding components for those too.
*/
function UnitEdit() {
  const router = useRouter();
  const { unit_id } = router.query;
  if (!unit_id) return h(Spinner);

  const { units, envs, liths } = getUnitData(unit_id);
  if (!units || !envs || !liths) return h(Spinner);
  const unit = units[0];

  const model = { unit, envs, liths };

  const persistChanges = async (
    updatedModel: UnitEditorModel,
    changeSet: Partial<UnitEditorModel>
  ) => {
    return await persistUnitChanges(unit, envs, liths, updatedModel, changeSet);
  };

  return h(BasePage, { query: router.query }, [
    h("h3", [
      "Edit Unit: ",
      unit.unit_strat_name ||
        `${unit.strat_name?.strat_name} ${unit.strat_name.rank}`,
    ]),
    //@ts-ignore
    h(UnitEditor, { model, persistChanges }),
  ]);
}

export default UnitEdit;
