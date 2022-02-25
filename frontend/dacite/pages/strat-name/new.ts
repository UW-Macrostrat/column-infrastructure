import { hyperStyled } from "@macrostrat/hyper";
import {
  StratNameI,
  BasePage,
  StratNameEditor,
} from "../../src";
import { useRouter } from "next/router";
import styles from "./stratname.module.scss";

const h = hyperStyled(styles);

export default function EditColumnGroup() {
  const router = useRouter();
  const { project_id, col_group_id, strat_name_id } = router.query;

  const persistChanges = async (e: StratNameI, c: Partial<StratNameI>) => {
    // const { data, error } = await pg
    //   .from("strat_name")
    //   .update(c)
    //   .match({ id: e.id });
    console.log(e, c);
    // if (!error) {
    //   router.push(`/column-groups?project_id=${project_id}`);
    //   return data[0];
    // } else {
    //   console.error(error);
    // }
  };

  return h(BasePage, { query: router.query }, [
    h("h3", ["Make New Stratigraphic Name "]),
    //@ts-ignore
    h(StratNameEditor, { model: {}, persistChanges }),
  ]);
}
