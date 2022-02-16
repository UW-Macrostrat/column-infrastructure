import h from "@macrostrat/hyper";
import pg, { usePostgrest, Row, UnitsView } from "../../src";
import { BasePage, Table } from "../../src";
import { useRouter } from "next/router";
import { Spinner, Button } from "@blueprintjs/core";

function Units() {
  const router = useRouter();
  const { project_id, col_id, section_id } = router.query;
  const units: UnitsView[] = usePostgrest(
    pg
      .from("units_view")
      .select()
      .order("age_top", { ascending: true })
      .match({ section_id: section_id, col_id: col_id })
  );
  console.log(units);
  const headers = [
    "ID",
    "Strat Name",
    "Bottom Interval",
    "Top Interval",
    "Color",
    "Thickness",
  ];
  const onClick = (unit: UnitsView) => {
    router.push(
      `/units/edit?project_id=${project_id}&col_id=${col_id}&section_id=${section_id}&unit_id=${unit.id}`
    );
  };
  if (!units) return h(Spinner);
  return h(BasePage, { query: router.query }, [
    h("h3", [
      "Units",
      h(
        Button,
        {
          intent: "success",
          minimal: true,
          onClick: () => {
            router.push(
              `/units/new?project_id=${project_id}&col_id=${col_id}&section_id=${section_id}&unit_id=null`
            );
          },
        },
        ["Add new unit"]
      ),
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
        units.map((unit, i) => {
          return h(Row, { key: i, onClick: () => onClick(unit) }, [
            h("td", [unit.id]),
            h("td", [
              unit.strat_name
                ? `${unit.strat_name} ${unit.rank}`
                : unit.unit_strat_name || "unnamed",
            ]),
            h("td", [unit.name_fo]),
            h("td", [unit.name_lo]),
            h("td", { style: { backgroundColor: unit.color } }, [unit.color]),
            h("td", [`${unit.min_thick} - ${unit.max_thick}`]),
          ]);
        }),
      ]),
    ]),
  ]);
}

export default Units;
