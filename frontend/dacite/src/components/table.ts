import { hyperStyled } from "@macrostrat/hyper";
import Link from "next/link";
import { ReactChild } from "react";
import styles from "./comp.module.scss";

const h = hyperStyled(styles);

interface RowProps {
  children: ReactChild;
  href: string;
}

function Row(props: RowProps) {
  return h(Link, { href: props.href }, [
    h("tr", { onClick: (e: MouseEvent) => e.stopPropagation() }, [
      props.children,
    ]),
  ]);
}

interface InfoCellI {
  text: string;
}
function InfoCell(props: InfoCellI) {
  return h("td", [h("h4.strat-name", [props.text])]);
}

interface TableProps {
  interactive: boolean;
  children: ReactChild;
}

function Table(props: TableProps) {
  const baseClass = "bp3-html-table .bp3-html-table-bordered";
  let tableClassName = props.interactive
    ? `${baseClass} .bp3-interactive`
    : baseClass;

  return h("div.table-container", [
    h(`table.${tableClassName}`, { style: { width: "100%" } }, [
      props.children,
    ]),
  ]);
}

export { Row, Table, InfoCell };
