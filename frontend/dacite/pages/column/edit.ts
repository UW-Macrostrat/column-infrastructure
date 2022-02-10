import { hyperStyled } from "@macrostrat/hyper";
import pg, {
  usePostgrest,
  BasePage,
  ColumnGroupI,
  ColumnEditor,
  ColumnForm,
} from "../../src";
import { useRouter } from "next/router";
import styles from "./column.module.scss";
import { Spinner } from "@blueprintjs/core";
const h = hyperStyled(styles);

const getData = (project_id: any, col_id: any) => {
  // get all col_groups for project, find one matches col_group_id
  const colGroups: Partial<ColumnGroupI>[] = usePostgrest(
    pg
      .from("col_group_view")
      .select("id, col_group, col_group_long")
      .match({ project_id: project_id })
  );
  const column: ColumnForm[] = usePostgrest(
    pg
      .from("col_form")
      .select()
      .match({ col_id: col_id })
  );
  return { colGroups, column };
};

export default function EditColumn() {
  const router = useRouter();
  const { project_id, col_group_id, col_id } = router.query;
  const { colGroups, column } = getData(project_id, col_id);

  if (!colGroups || !column) return h(Spinner);
  const curColGroup = colGroups.filter((cg) => cg.id == col_group_id);

  const persistChanges = async (e: ColumnForm, c: Partial<ColumnForm>) => {
    console.log(e, c);
    // port names to match db (only col_numer -> col)
    let ref_id: number | undefined = undefined;
    if (c.col_number) {
      c.col = c.col_number;
      delete c.col_number;
    }
    if (c.ref) {
      ref_id = c.ref.id;
      delete c.ref;
    }
    const { data, error } = await pg
      .from("cols")
      .update(c)
      .match({ id: e.col_id });
    if (!error) {
      if (ref_id) {
        const ref_col = { ref_id: ref_id };
        const { data: data_, error } = await pg
          .from("col_refs")
          .update(ref_col)
          .match({ col_id: e.col_id });
      }
      if (error) {
        //catch errror
      }
      router.push(`/column-groups?project_id=${project_id}`);
      return e;
    } else {
      //catch error
    }

    // check if ref has changed

    return e;
  };

  return h(BasePage, { query: router.query }, [
    h("h3", [
      `Edit column ${column[0].col_name}, part of ${curColGroup[0].col_group_long}(${curColGroup[0].col_group})`,
    ]),
    //@ts-ignore
    h(ColumnEditor, {
      model: column[0],
      colGroups,
      persistChanges,
      curColGroup: curColGroup[0],
    }),
  ]);
}
