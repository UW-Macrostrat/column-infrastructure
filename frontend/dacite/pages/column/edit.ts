import { hyperStyled } from "@macrostrat/hyper";
import {
  useTableSelect,
  tableUpdate,
  BasePage,
  ColumnGroupI,
  ColumnEditor,
  ColumnForm,
} from "../../src";
import { useRouter } from "next/router";
import styles from "./column.module.scss";
import { Spinner } from "@blueprintjs/core";
import { createLink } from "../../src/components/helpers";
const h = hyperStyled(styles);

const getData = (project_id: any, col_id: any) => {
  // get all col_groups for project, find one matches col_group_id
  const colGroups: Partial<ColumnGroupI>[] = useTableSelect({
    tableName: "col_group_view",
    columns: "id, col_group, col_group_long",
    match: { project_id: project_id },
  });

  const column: ColumnForm[] = useTableSelect({
    tableName: "col_form",
    match: { col_id: col_id },
  });

  return { colGroups, column };
};

export default function EditColumn() {
  const router = useRouter();
  const { project_id, col_group_id, col_id } = router.query;
  const { colGroups, column } = getData(project_id, col_id);

  if (!colGroups || !column) return h(Spinner);
  const curColGroup = colGroups.filter((cg) => cg.id == col_group_id);

  const persistChanges = async (
    e: ColumnForm,
    changes: Partial<ColumnForm>
  ) => {
    console.log(e, changes);
    // port names to match db (only col_numer -> col)
    let ref_id: number | undefined = undefined;
    if (changes.col_number) {
      changes.col = changes.col_number;
      delete changes.col_number;
    }
    if (changes.ref) {
      // handle the changing of a ref, either one that exists or was created
      ref_id = changes.ref.id;
      delete changes.ref;
    }
    const { data, error } = await tableUpdate({
      tableName: "cols",
      changes,
      id: e.col_id,
    });

    if (!error) {
      if (ref_id) {
        const ref_col = { ref_id: ref_id };
        const { data: data_, error } = await tableUpdate({
          tableName: "col_refs",
          changes: ref_col,
          id: { col_id: e.col_id },
        });
      }
      if (error) {
        //catch errror
      }
      const url = createLink("/column-groups", {
        project_id: project_id,
      });
      router.push(url);
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
      persistChanges,
      curColGroup: curColGroup[0],
    }),
  ]);
}
