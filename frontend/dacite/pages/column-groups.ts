import { Button } from "@blueprintjs/core";
import h from "@macrostrat/hyper";
import { useRouter } from "next/router";
import pg, { usePostgrest, Project, ColumnGroupI, Row } from "../src";

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

  const onClick = (col_id: number) => {
    router.push(`/column?project_id=${project_id}&col_id=${col_id}`);
  };
  return h("div", [
    h("h3", [
      project.project,
      h(Button, { minimal: true, intent: "success" }, ["Add New Group"]),
    ]),
    h("div", { style: { display: "flex", flexWrap: "wrap" } }, [
      columnGroups.map((colGroup, i) => {
        return h("div.table-container", { style: { margin: "10px" } }, [
          h(
            "table.bp3-html-table .bp3-html-table-bordered .bp3-interactive .bp3-html-table-condensed",
            { key: i },
            [
              h("thead", [
                h("tr", [h("td", colGroup.col_group_long)]),
                h("tr", [h("td", "Column ID")]),
              ]),
              h("tbody", [
                colGroup.col_ids.map((id, i) => {
                  return h(Row, { key: i, onClick: () => onClick(id) }, [
                    h("td", [id]),
                  ]);
                }),
                h(Button, { fill: true, minimal: true, intent: "success" }, [
                  "Add New Column",
                ]),
              ]),
            ]
          ),
        ]);
      }),
    ]),
  ]);
}
