import h from "@macrostrat/hyper";
import { ReactChild } from "react";

interface RowProps {
  onClick: (e: any) => void;
  children: ReactChild;
}

function Row(props: RowProps) {
  return h("tr", { onClick: props.onClick }, [props.children]);
}

export { Row };
