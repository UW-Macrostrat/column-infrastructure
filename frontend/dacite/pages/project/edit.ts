import { hyperStyled } from "@macrostrat/hyper";
import {
  useTableSelect,
  tableUpdate,
  BasePage,
  Project,
  ProjectEditor,
} from "../../src";
import { useRouter } from "next/router";
import styles from "./project.module.scss";
import { Spinner } from "@blueprintjs/core";
const h = hyperStyled(styles);

export default function NewProject() {
  const router = useRouter();
  const { project_id } = router.query;
  const project: Project = useTableSelect({
    tableName: "projects",
    match: parseInt(project_id),
    limit: 1,
  });

  if (!project) return h(Spinner);

  const persistChanges = async (e: Project, changes: Partial<Project>) => {
    const { data, error } = await tableUpdate({
      tableName: "projects",
      id: e.id,
      changes,
    });

    console.log("Error", error);
    if (!error) {
      router.push("/");
      return data[0];
    } else {
      // error catching here
    }
  };

  return h(BasePage, { query: router.query }, [
    h("h3", ["Create a New Project"]),
    //@ts-ignore
    h(ProjectEditor, { project: project[0], persistChanges }),
  ]);
}
