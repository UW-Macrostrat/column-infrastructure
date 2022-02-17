import h from "@macrostrat/hyper";
import pg, { usePostgrest, Row, UnitsView, CreateButton } from "../../src";
import { BasePage, Table } from "../../src";
import { useRouter } from "next/router";
import { Spinner, Button } from "@blueprintjs/core";
import { createLink } from "../../src/components/helpers";

function Units() {
  const router = useRouter();
  const { project_id, col_id, col_group_id, section_id } = router.query;
  const units: UnitsView[] = usePostgrest(
    pg
      .from("units_view")
      .select()
      .order("age_top", { ascending: true })
      .match({ section_id: section_id, col_id: col_id })
  );

  const headers = [
    "ID",
    "Strat Name",
    "Bottom Interval",
    "Top Interval",
    "Color",
    "Thickness",
  ];

  if (!units) return h(Spinner);
  return h(BasePage, { query: router.query }, [
    h("h3", [
      "Units",
      h(CreateButton, {
        href: createLink("/units/new", {
          ...router.query,
          unit_id: undefined,
        }),
        text: "Add new unit",
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
        units.map((unit, i) => {
          return h(
            Row,
            {
              key: i,
              href: createLink("/units/edit", {
                ...router.query,
                unit_id: unit.id,
              }),
            },
            [
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
            ]
          );
        }),
      ]),
    ]),
  ]);
}

export default Units;
