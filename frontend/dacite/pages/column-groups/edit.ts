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
  const { project_id, col_group_id } = router.query;

  const projects: Project[] = usePostgrest(
    pg
      .from("projects")
      .select()
      .match({ id: project_id })
  );
  const colGroups: Partial<ColumnGroupI>[] = usePostgrest(
    pg
      .from("col_groups")
      .select()
      .match({ id: col_group_id })
  );
  if (!projects || !colGroups) return h(Spinner);

  const columnGroup: Partial<ColumnGroupI> = colGroups[0];

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
    h(ColumnGroupEditor, { model: columnGroup, persistChanges }),
  ]);
}
