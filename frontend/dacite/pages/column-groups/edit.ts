import { hyperStyled } from "@macrostrat/hyper";
import pg, {
  usePostgrest,
  useTableSelect,
  BasePage,
  Project,
  ColumnGroupEditor,
  ColumnGroupI,
  tableUpdate,
} from "../../src";
import { useRouter } from "next/router";
import styles from "./colgroup.module.scss";
import { Spinner } from "@blueprintjs/core";
const h = hyperStyled(styles);

export default function EditColumnGroup() {
  const router = useRouter();
  const { project_id, col_group_id } = router.query;

  const projects: Project[] = useTableSelect({
    tableName: "projects",
    match: parseInt(project_id),
    limit: 1,
  });

  const colGroups: Partial<ColumnGroupI>[] = useTableSelect({
    tableName: "col_groups",
    match: parseInt(col_group_id),
  });

  if (!projects || !colGroups) return h(Spinner);

  const columnGroup: Partial<ColumnGroupI> = colGroups[0];

  const persistChanges = async (
    e: Partial<ColumnGroupI>,
    changes: Partial<ColumnGroupI>
  ) => {
    const { data, error } = await tableUpdate({
      tableName: "col_groups",
      changes,
      id: e.id || 0,
    });
    if (!error) {
      router.push(`/column-groups?project_id=${project_id}`);
      return data[0];
    } else {
      console.error(error);
    }
  };

  const project = projects[0];

  return h(BasePage, { query: router.query }, [
    h("h3", ["Create a New Column Group for ", project.project]),
    //@ts-ignore
    h(ColumnGroupEditor, { model: columnGroup, persistChanges }),
  ]);
}
