import { Button } from "@blueprintjs/core";
import h from "@macrostrat/hyper";
import { useRouter } from "next/router";
import pg, { usePostgrest } from "../src";

export default function ColumnGroup() {
  const router = useRouter();
  const { project_id } = router.query;
  if (!project_id) return h("div");

  const columnGroups = usePostgrest(
    pg
      .from("col_group_view")
      .select()
      .match({ project_id: project_id })
  );
  if (!columnGroups) return h("div");
  return h("div", [
    "Column Groups!!",
    h("div", [
      columnGroups.map((colGroup, i) => {
        return h("div", { key: i }, [
          colGroup.col_group_long,
          colGroup.col_ids.map((id, i) => {
            return h(
              Button,
              {
                key: i,
                minimal: true,
                onClick: () => router.push(`/column?col_id=${id}`),
              },
              id
            );
          }),
        ]);
      }),
    ]),
  ]);
}
