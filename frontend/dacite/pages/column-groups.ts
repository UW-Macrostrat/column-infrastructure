import { Button } from "@blueprintjs/core";
import h from "@macrostrat/hyper";
import { useRouter } from "next/router";
import pg, {
  usePostgrest,
  Project,
  ColumnGroupI,
  Row,
  BasePage,
  Table,
} from "../src";

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

  const onClick = (col_id: number, col_group_id: number) => {
    router.push(
      `/column?project_id=${project_id}&col_group_id=${col_group_id}&col_id=${col_id}`
    );
  };
  return h(BasePage, { query: router.query }, [
    h("h3", [
      project.project,
      h(
        Button,
        {
          minimal: true,
          intent: "success",
          onClick: () =>
            router.push(
              `/column-groups/new?project_id=${project_id}&col_id=null`
            ),
        },
        ["Add New Group"]
      ),
    ]),
    h("div", { style: { display: "flex", flexWrap: "wrap" } }, [
      columnGroups.map((colGroup, i) => {
        return h(
          "div",
          { key: i, style: { textAlign: "center", height: "100%" } },
          [
            h("div.col-group-name", [
              h("h3", { style: { margin: 0 } }, colGroup.col_group_long),
              h(Button, {
                minimal: true,
                small: true,
                intent: "success",
                icon: "edit",
                onClick: () =>
                  router.push(
                    `/column-groups/edit?project_id=${project.id}&col_group_id=${colGroup.id}&col_id=null`
                  ),
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
                    { key: i, onClick: () => onClick(id.col_id, colGroup.id) },
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
            h(
              Button,
              {
                fill: true,
                minimal: true,
                intent: "success",
                onClick: () =>
                  router.push(
                    `/column/new?project_id=${project.id}&col_group_id=${colGroup.id}&col_id=null`
                  ),
              },
              ["Add New Column"]
            ),
          ]
        );
      }),
    ]),
  ]);
}
