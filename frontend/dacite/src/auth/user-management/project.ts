import h from "@macrostrat/hyper";
import { Accordion, Text, Group, Button } from "@mantine/core";
import { User, UserI } from "./user";
import projectData from "./fake-users.json";

const projects = projectData.projects;

interface ProjectI {
  id: number;
  project: string;
  descrip: string;
}

function ProjectAccordionLabel(props: ProjectI) {
  return h("div", [
    h(Group, { direction: "column" }, [
      h(Text, { size: "sm" }, [props.project]),
      h(Text, { size: "xs", color: "dimmed" }, [props.descrip]),
    ]),
  ]);
}

function ProjectManagement() {
  const items = projects.map((project) =>
    h(Accordion.Item, { label: h(ProjectAccordionLabel, { ...project }) }, [
      project.users.map((user) => {
        return h(User, { ...user });
      }),
      h(Button, {color: "green", mt: "sm"}, ["Add new user"])
    ])
  );

  return h("div", { style: { minWidth: "500px" } }, [h(Accordion, [items])]);
}

export { ProjectManagement };
