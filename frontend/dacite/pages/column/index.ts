import h from "@macrostrat/hyper";
import { useRouter } from "next/router";
import pg, {
  usePostgrest,
  IColumnSection,
  Row,
  BasePage,
  Table,
  EditButton,
  CreateButton,
} from "../../src";
import { createLink } from "../../src/components/helpers";

/* 
Creates section arrays by finding the lowest posistion_bottom and highest
position_bottom. Sets a bottom and top strat_name based on this 
sorting. 
*/
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
  /* 
  Create a unique object for each section
  and calculate the highest and lowest strat_name
  */

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
  const { col_id, project_id, col_group_id } = router.query;
  if (!col_id) return h("div");

  const { data, col_name } = dataPreProcess(col_id);

  if (!data) return h("div");
  const headers = Object.keys(data[0]);

  return h(BasePage, { query: router.query }, [
    h("h3", [
      `Sections for ${col_name}`,
      h(EditButton, {
        href: createLink("/column/edit", {
          ...router.query,
        }),
      }),
    ]),
    h.if(data.filter((d) => d.section_id != undefined).length == 0)("div", [
      h("h3", [
        "Looks like there are no sections or units. To begin create a new unit",
      ]),
      h(CreateButton, {
        minimal: false,
        href: createLink("/units/new", {
          ...router.query,
          section_id: undefined,
        }),
        text: "Create Unit",
      }),
    ]),
    h.if(data.filter((d) => d.section_id != undefined).length > 0)(
      Table,
      { interactive: true },
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
            return h(
              Row,
              {
                key: i,
                href: createLink("/units", {
                  ...router.query,
                  section_id: col.section_id,
                }),
              },
              [
                h("td", [col.section_id]),
                h("td", [col.top]),
                h("td", [col.bottom]),
                h("td", [h("a", `view ${col.units} units`)]),
              ]
            );
          }),
        ]),
      ]
    ),
  ]);
}
