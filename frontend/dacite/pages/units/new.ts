import { hyperStyled } from "@macrostrat/hyper";
import { BasePage, UnitEditor, UnitEditorModel } from "../../src";
import { persistNewUnitChanges } from "./new-helpers";
import { useRouter } from "next/router";
import styles from "./units.module.scss";
const h = hyperStyled(styles);

function NewUnit() {
  const router = useRouter();
  const { project_id, col_id, section_id } = router.query;

  const model = { unit: { col_id }, liths: [], envs: [] };

  const persistChanges = async (
    updatedModel: UnitEditorModel,
    changeSet: Partial<UnitEditorModel>
  ) => {
    return await persistNewUnitChanges(
      updatedModel,
      changeSet,
      section_id,
      col_id
    );
  };

  return h(BasePage, { query: router.query }, [
    //@ts-ignore
    h(UnitEditor, { model, persistChanges }),
  ]);
}

export default NewUnit;
