import { hyperStyled } from "@macrostrat/hyper";
import {
  StratNameI,
  BasePage,
  StratNameEditor,
  tableInsert,
  tableUpdate,
} from "../../src";
import { useRouter } from "next/router";
import styles from "./stratname.module.scss";
import { createLink } from "../../src/components/helpers";

const h = hyperStyled(styles);

export default function EditColumnGroup() {
  const router = useRouter();
  const { name, unit_id } = router.query;

  const persistChanges = async (e: StratNameI, c: Partial<StratNameI>) => {
    const { data, error } = await tableInsert({
      tableName: "strat_names",
      row: e,
    });
    console.log(data);
    const strat_name_id: number = data[0].id;
    if (!error) {
      const { data, error } = await tableUpdate({
        tableName: "units",
        changes: { strat_name_id: strat_name_id },
        id: parseInt(unit_id),
      });

      router.push(createLink("/units/edit", { ...router.query }));
      // return data[0];
    } else {
      console.error(error);
    }
  };

  let model: Partial<StratNameI> = {};
  if (name != undefined && typeof name == "string") {
    model.strat_name = name;
  }

  return h(BasePage, { query: router.query }, [
    h("h3", ["Make New Stratigraphic Name "]),
    //@ts-ignore
    h(StratNameEditor, {
      model,
      persistChanges,
    }),
  ]);
}
