import { hyperStyled } from "@macrostrat/hyper";
import { tableInsert, BasePage, Project, ProjectEditor } from "../../src";
import { useRouter } from "next/router";
import styles from "./project.module.scss";
const h = hyperStyled(styles);

export default function NewProject() {
  const newProject: Project = {
    project: "",
    descrip: "",
    timescale_id: undefined,
  };

  const persistChanges = async (project: Project, c: Partial<Project>) => {
    const { data, error } = await tableInsert({
      row: project,
      tableName: "projects",
    });
    return data[0];
  };

  return h(BasePage, { query: {} }, [
    h("h3", ["Create a New Project"]),
    //@ts-ignore
    h(ProjectEditor, { project: newProject, persistChanges }),
  ]);
}
