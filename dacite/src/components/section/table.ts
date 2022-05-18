import { hyperStyled } from "@macrostrat/hyper";
import styles from "../comp.module.scss";
import { ColSectionI } from "~/types";
import { Table, Row } from "../table";
import { SectionUnitCheckBox } from "../column";

const h = hyperStyled(styles);

function ColSectionsTable(props: {
  headers: any[];
  colSections: ColSectionI[];
  onChange: (id: number) => void;
}) {
  const { headers, colSections, onChange } = props;
  return h(Table, { interactive: true, headers }, [
    colSections.map((section, i) => {
      return h(
        Row,
        {
          href: `/section/${section.id}`,
          key: i,
          draggableId: section.id.toString() + " " + section.bottom,
          index: i,
        },
        [
          h(
            "td",
            {
              onClick: (e: React.MouseEvent<HTMLTableCellElement>) =>
                e.stopPropagation(),
            },
            [
              h(SectionUnitCheckBox, {
                data: section.id,
                onChange: onChange,
              }),
            ]
          ),
          h("td", [section.id]),
          h("td", [section.top]),
          h("td", [section.bottom]),
          h("td", [
            h(
              "a",
              { href: `/section/${section.id}` },
              `view ${section.unit_count} units`
            ),
          ]),
        ]
      );
    }),
  ]);
}

export { ColSectionsTable };