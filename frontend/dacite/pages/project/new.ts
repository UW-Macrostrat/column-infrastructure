import { hyperStyled } from "@macrostrat/hyper";
import pg, { usePostgrest, BasePage, Project, ProjectEditor } from "../../src";
import { useRouter } from "next/router";
import styles from "./project.module.scss";
const h = hyperStyled(styles);

export default function NewProject() {
  const router = useRouter();

  const newProject: Project = {
    project: "",
    descrip: "",
    timescale_id: -1,
  };

  const persistChanges = (e: Partial<Project>, c: Partial<Project>) => {
    console.log(e, c);
    return c;
  };

  return h(BasePage, { query: router.query }, [
    h("h3", ["Create a New Project"]),
    //@ts-ignore
    h(ProjectEditor, { project: newProject, persistChanges }),
  ]);
}
