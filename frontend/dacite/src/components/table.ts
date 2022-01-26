import h from "@macrostrat/hyper";
import { ReactChild } from "react";

interface RowProps {
  onClick: (e: any) => void;
  children: ReactChild;
}

function Row(props: RowProps) {
  return h("tr", { onClick: props.onClick }, [props.children]);
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

export { Row, Table };
