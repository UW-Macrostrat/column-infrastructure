import { hyperStyled } from "@macrostrat/hyper";
import pg, {
  usePostgrest,
  BasePage,
  ColumnGroupI,
  ColumnEditor,
  ColumnForm,
  PagePropsBaseI,
} from "../../src";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import styles from "./column.module.scss";
import { Spinner } from "@blueprintjs/core";
import { createLink } from "../../src/components/helpers";
const h = hyperStyled(styles);

const getData = (project_id: number, token: string) => {
  // get all col_groups for project, find one matches col_group_id
  const colGroups: Partial<ColumnGroupI>[] = usePostgrest(
    pg
      .auth(token)
      .from("col_group_view")
      .select("id, col_group, col_group_long")
      .match({ project_id: project_id })
  );
  return colGroups;
};

export default function NewColumn(props: PagePropsBaseI) {
  const router = useRouter();
  const { project_id, col_group_id } = props.query;
  const colGroups = getData(project_id, props.token);

  if (!colGroups) return h(Spinner);
  const curColGroup = colGroups.filter((cg) => cg.id == col_group_id);

  const persistChanges = async (e: ColumnForm, c: Partial<ColumnForm>) => {
    console.log(e, c);
    //create the correct column object for persistence.
    //       project_id, col_group_id, col (#), col_name, status_code, col_type
    //get the id back and enter that into the ref_col table
    const newColumn = {
      project_id,
      col_group_id,
      col: e.col_number,
      col_name: e.col_name,
      status_code: "in process",
      col_type: "column",
    };
    const { data, error } = await pg
      .auth(props.token)
      .from("cols")
      .insert([newColumn]);
    if (!error) {
      const col_id: number = data[0].id;
      const ref_col = { ref_id: e.ref.id, col_id: col_id };
      const { data: data_, error } = await pg
        .auth(props.token)
        .from("col_refs")
        .insert([ref_col]);
      if (!error) {
        const url = createLink("/column-groups", { project_id: project_id });
        router.push(url);
        return e;
      } else {
        //catch errror
      }
    } else {
      //catch error
    }
  };

  return h(BasePage, { query: props.query, token: props.token }, [
    h("h3", [
      `Add a new column to ${curColGroup[0].col_group_long}(${curColGroup[0].col_group})`,
    ]),
    //@ts-ignore
    h(ColumnEditor, {
      model: {},
      colGroups,
      persistChanges,
      curColGroup: curColGroup[0],
    }),
  ]);
}

export async function getServerSideProps(ctx) {
  const { req, res, query } = ctx;

  const token = getCookie("jwt_token", { req, res });

  return {
    props: { token, query }, // will be passed to the page component as props
  };
}
