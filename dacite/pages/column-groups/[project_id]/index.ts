import h from "@macrostrat/hyper";
import { GetServerSidePropsContext } from "next";
import pg, {
  ColumnGroupI,
  Row,
  BasePage,
  Table,
  CreateButton,
  EditButton,
} from "~/index";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const {
    query: { project_id },
  } = ctx;
  const { data, error } = await pg
    .from("col_group_with_cols")
    .select("*, project_id(project)")
    .match({ project_id: project_id });

  const projectName: string =
    data && data.length > 0 ? data[0].project_id.project : "";

  return { props: { project_id, projectName, columnGroups: data } };
}

export default function ColumnGroup(props: {
  projectName: string;
  project_id: number;
  columnGroups: ColumnGroupI[];
}) {
  const { project_id } = props;
  console.log(props.columnGroups);

  const headers = ["ID", "Name", "Col #", "Status"];

  return h(BasePage, { query: { project_id } }, [
    h("h3", [
      `Column Groups for Project #${props.project_id}: ${props.projectName}`,
      h(CreateButton, {
        href: `/column-groups/${project_id}/new`,
        text: "Add New Group",
      }),
    ]),
    h("div", { style: { display: "flex", flexWrap: "wrap" } }, [
      props.columnGroups.map((colGroup, i) => {
        return h(
          "div",
          { key: i, style: { textAlign: "center", height: "100%" } },
          [
            h("div.col-group-name", [
              h("h3", { style: { margin: 0 } }, colGroup.col_group_long),
              h(EditButton, {
                small: true,
                href: `/column-group/${colGroup.id}/edit`,
              }),
            ]),
            h(Table, { interactive: true, headers }, [
              colGroup.cols.map((id, i) => {
                return h(
                  Row,
                  {
                    key: id.col_id,
                    draggableId: id.col_name + id.col_id?.toString(),
                    index: i,
                    href: `/column/${id.col_id}`,
                  },
                  [
                    h("td", [id.col_id]),
                    h("td", [id.col_name]),
                    h("td", [id.col_number]),
                    h("td", [id.status_code]),
                  ]
                );
              }),
            ]),
            h(CreateButton, {
              href: `/column-group/${colGroup.id}/new-column`,
              text: "Add New Column",
            }),
          ]
        );
      }),
    ]),
  ]);
}
