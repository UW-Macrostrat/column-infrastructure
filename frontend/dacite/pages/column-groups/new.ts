import { hyperStyled } from "@macrostrat/hyper";
import pg, {
  usePostgrest,
  BasePage,
  Project,
  ColumnGroupEditor,
  ColumnGroupI,
} from "../../src";
import { useRouter } from "next/router";
import styles from "./colgroup.module.scss";
import { Spinner } from "@blueprintjs/core";
const h = hyperStyled(styles);

export default function NewProject() {
  const router = useRouter();
  const { project_id } = router.query;

  const projects: Project[] = usePostgrest(
    pg
      .from("projects")
      .select()
      .match({ id: project_id })
  );

  if (!projects) return h(Spinner);

  const newColumnGroup: Partial<ColumnGroupI> = {
    col_group: "",
    col_group_long: "",
  };

  const persistChanges = (
    e: Partial<ColumnGroupI>,
    c: Partial<ColumnGroupI>
  ) => {
    console.log(e, c);
    return c;
  };

  const project = projects[0];

  return h(BasePage, { query: router.query }, [
    h("h3", ["Create a New Column Group for ", project.project]),
    //@ts-ignore
    h(ColumnGroupEditor, { model: newColumnGroup, persistChanges }),
  ]);
}
