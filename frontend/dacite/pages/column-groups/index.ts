import h from "@macrostrat/hyper";
import { useRouter } from "next/router";
import pg, {
  usePostgrest,
  Project,
  ColumnGroupI,
  Row,
  BasePage,
  Table,
  CreateButton,
  EditButton,
} from "../../src";

export default function ColumnGroup() {
  const router = useRouter();
  const { project_id } = router.query;
  if (!project_id) return h("div");
  const projects: Project[] = usePostgrest(
    pg
      .from("projects")
      .select()
      .match({ id: project_id })
      .limit(1)
  );
  const columnGroups: ColumnGroupI[] = usePostgrest(
    pg
      .from("col_group_view")
      .select()
      .match({ project_id: project_id })
  );

  if (!columnGroups || !projects) return h("div");
  const project = projects[0];

  return h(BasePage, { query: router.query }, [
    h("h3", [
      project.project,
      h(CreateButton, {
        href: `/column-groups/new?project_id=${project_id}&col_id=null`,
        text: "Add New Group",
      }),
    ]),
    h("div", { style: { display: "flex", flexWrap: "wrap" } }, [
      columnGroups.map((colGroup, i) => {
        return h(
          "div",
          { key: i, style: { textAlign: "center", height: "100%" } },
          [
            h("div.col-group-name", [
              h("h3", { style: { margin: 0 } }, colGroup.col_group_long),
              h(EditButton, {
                small: true,
                href: `/column-groups/edit?project_id=${project.id}&col_group_id=${colGroup.id}`,
              }),
            ]),
            h(Table, { interactive: true }, [
              h("thead", [
                h("tr", [
                  h("td", "ID"),
                  h("td", "Name"),
                  h("td", "Col #"),
                  h("td", "Status"),
                ]),
              ]),
              h("tbody", [
                colGroup.cols.map((id, i) => {
                  return h(
                    Row,
                    {
                      key: i,
                      href: `/column?project_id=${project_id}&col_group_id=${colGroup.id}&col_id=${id.col_id}`,
                    },
                    [
                      h("td", [id.col_id]),
                      h("td", [id.col_name]),
                      h("td", [id.col_number]),
                      h("td", [id.status_code]),
                    ]
                  );
                }),
              ]),
            ]),
            h(CreateButton, {
              href: `/column/new?project_id=${project.id}&col_group_id=${colGroup.id}&col_id=null`,
              text: "Add New Column",
            }),
          ]
        );
      }),
    ]),
  ]);
}
