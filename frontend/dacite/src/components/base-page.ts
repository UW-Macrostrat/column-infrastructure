import { hyperStyled } from "@macrostrat/hyper";
import { Icon } from "@blueprintjs/core";
import Link from "next/link";
import styles from "./comp.module.scss";
import { ReactChild } from "react";
import { AuthProvider, RegisterModal, AccountButton } from "../auth";
const h = hyperStyled(styles);

export interface QueryI {
  project_id?: number;
  col_id?: number;
  section_id?: number;
  unit_id?: number;
  col_group_id?: number;
  strat_name_id?: number;
  name?: string;
}

interface BasePageProps {
  query: QueryI;
  children: ReactChild;
}

/* 
Creates the breadcrumbs at the top of each page based on the router query
*/
export function BasePage(props: BasePageProps) {
  const { query } = props;
  const { project_id, col_id, col_group_id, section_id, unit_id } = query;

  const Icon_ = () => h(Icon, { icon: "chevron-right" });
  const breadCrumbs = [
    { name: "Projects", href: "/", predicate: project_id },
    {
      name: "Column Groups",
      href: `/column-groups?project_id=${project_id}`,
      predicate: col_id,
    },
    {
      name: "Sections",
      href: `/column?project_id=${project_id}&col_group_id=${col_group_id}&col_id=${col_id}`,
      predicate: section_id,
    },
    {
      name: "Units",
      href: `/units?project_id=${project_id}&col_group_id=${col_group_id}&col_id=${col_id}&section_id=${section_id}`,
      predicate: unit_id,
    },
  ].filter((crumb) => crumb.predicate);

  return h("div.page", [
    h(AuthProvider, [
      h("div.bread-crumbs", [
        breadCrumbs.map((crumb, i) => {
          const last = i == breadCrumbs.length - 1;
          if (last) {
            return h(Link, { href: crumb.href, key: i }, [
              h("a", [crumb.name]),
            ]);
          } else {
            return h("div", { key: i }, [
              h(Link, { href: crumb.href }, [h("a", [crumb.name])]),
              h(Icon_),
            ]);
          }
        }),
      ]),
      h(RegisterModal),
      h("div", { style: { position: "fixed", right: 0, top: 0 } }, [
        h(AccountButton),
      ]),
      props.children,
    ]),
  ]);
}
