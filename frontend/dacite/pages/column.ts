import { Button } from "@blueprintjs/core";
import h from "@macrostrat/hyper";
import { useRouter } from "next/router";
import pg, { usePostgrest } from "../src";

export default function ColumnGroup() {
  const router = useRouter();
  const { col_id } = router.query;
  if (!col_id) return h("div");

  const colSections = usePostgrest(
    pg
      .from("col_sections")
      .select()
      .match({ col_id })
  );
  console.log(colSections);
  if (!colSections) return h("div");

  return h("div", [
    "Columns!!",
    h.if(colSections)("div", [
      colSections.map((colSec, i) => {
        return h("div", { key: i }, [Object.entries(colSec)]);
      }),
    ]),
  ]);
}
