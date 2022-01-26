import h from "@macrostrat/hyper";
import pg, { usePostgrest, Row, Project, BasePage } from "../src";
import { useRouter } from "next/router";
import { Button } from "@blueprintjs/core";

function Home() {
  const projects: Project[] = usePostgrest(pg.from("projects"));
  const router = useRouter();
  if (!projects) return h("div");

  const onClick = (project: Project) => {
    router.push(`/column-groups?project_id=${project.id}`);
  };

  const headers = Object.keys(projects[0]);

  return h(BasePage, { query: {} }, [
    h("h3,", [
      "Choose a Project",
      h(Button, { minimal: true, intent: "success" }, ["Create New Project"]),
    ]),
    h("div.table-container", [
      h("table.bp3-html-table .bp3-html-table-bordered .bp3-interactive", [
        h("thead", [
          h("tr", [
            headers.map((head, i) => {
              return h("th", { key: i }, [head]);
            }),
          ]),
        ]),
        h("tbody", [
          projects.map((project, i) => {
            return h(Row, { key: i, onClick: () => onClick(project) }, [
              h("td", [project.id]),
              h("td", [project.project]),
              h("td", [project.descrip]),
              h("td", [project.timescale_id]),
            ]);
          }),
        ]),
      ]),
    ]),
  ]);
}

export default Home;
