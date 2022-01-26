import h from "@macrostrat/hyper";
import { useRouter } from "next/router";
import pg, { usePostgrest, IColumnSection, Row, BasePage } from "../src";

function dataPreProcess(col_id: any) {
  const colSections: IColumnSection[] = usePostgrest(
    pg
      .from("col_sections")
      .select()
      .match({ col_id })
  );
  if (!colSections) return [];
  const col_name = colSections[0]["col_name"];

  let data: any = {};
  colSections.forEach((col) => {
    const { section_id, position_bottom, top, bottom } = col;
    if (!data[section_id]) {
      data[section_id] = {
        section_id,
        lowest: position_bottom,
        highest: position_bottom,
        top,
        bottom,
        units: 1,
      };
    } else {
      if (data[section_id]["lowest"] < position_bottom) {
        // replace bottom and lowest
        data[section_id]["lowest"] = position_bottom;
        data[section_id]["bottom"] = bottom;
      } else if (data[section_id]["highest"] > position_bottom) {
        // replace top
        data[section_id]["highest"] = position_bottom;
        data[section_id]["top"] = top;
      }
      data[section_id]["units"]++;
    }
  });
  data = Object.values(data).map((section: any) => {
    delete section["lowest"];
    delete section["highest"];
    return section;
  });
  return { data, col_name };
}

export default function ColumnGroup() {
  const router = useRouter();
  const { col_id, project_id } = router.query;
  if (!col_id) return h("div");

  const { data, col_name } = dataPreProcess(col_id);

  if (!data) return h("div");

  const headers = Object.keys(data[0]);

  const onClick = (col) => {
    router.push(
      `/units?project_id=${project_id}&col_id=${col_id}&section_id=${col.section_id}`
    );
  };
  return h(BasePage, { query: router.query }, [
    h("h3", [`Sections for ${col_name}`]),
    h("div.table-container", [
      h(
        "table.bp3-html-table .bp3-html-table-bordered .bp3-interactive",
        { style: { width: "100%" } },
        [
          h("thead", [
            h("tr", [
              headers.map((head, i) => {
                return h("th", { key: i }, [head]);
              }),
            ]),
          ]),
          h("tbody", [
            data.map((col, i) => {
              return h(Row, { key: i, onClick: () => onClick(col) }, [
                h("td", [col.section_id]),
                h("td", [col.top]),
                h("td", [col.bottom]),
                h("td", [h("a", `view ${col.units} units`)]),
              ]);
            }),
          ]),
        ]
      ),
    ]),
  ]);
}
