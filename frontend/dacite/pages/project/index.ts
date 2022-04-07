import h from "@macrostrat/hyper";
import {
  Row,
  Project,
  BasePage,
  Table,
  EditButton,
  CreateButton,
} from "../../src";

function Projects(props: any) {
  const projects: Project[] = props.projects;

  const headers = Object.keys(projects[0]);

  return h(BasePage, { query: {}, token: props.token }, [
    h("h3,", [
      "Choose a Project",
      h(CreateButton, {
        minimal: true,
        href: "/project/new?project_id=null",
        text: "Create New Project",
      }),
    ]),
    h(Table, { interactive: true }, [
      h("thead", [
        h("tr", [
          headers.map((head, i) => {
            return h("th", { key: i }, [head]);
          }),
        ]),
      ]),
      h("tbody", [
        projects.map((project, i) => {
          return h(
            Row,
            { key: i, href: `/column-groups?project_id=${project.id}` },
            [
              h("td", [project.id]),
              h("td", [project.project]),
              h("td", [project.descrip]),
              h("td", [project.timescale_id]),
              h("td", [
                h(EditButton, {
                  href: `/project/edit?project_id=${project.id}`,
                }),
              ]),
            ]
          );
        }),
      ]),
    ]),
  ]);
}

export { Projects };
