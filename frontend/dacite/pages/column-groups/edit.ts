import { hyperStyled } from "@macrostrat/hyper";
import { getCookie } from "cookies-next";
import pg, {
  usePostgrest,
  BasePage,
  Project,
  ColumnGroupEditor,
  ColumnGroupI,
  PagePropsBaseI,
} from "../../src";
import { useRouter } from "next/router";
import styles from "./colgroup.module.scss";
import { Spinner } from "@blueprintjs/core";
const h = hyperStyled(styles);

export default function EditColumnGroup(props: PagePropsBaseI) {
  const router = useRouter();
  const { project_id, col_group_id } = props.query;

  const projects: Project[] = usePostgrest(
    pg.auth(props.token).from("projects").select().match({ id: project_id })
  );
  const colGroups: Partial<ColumnGroupI>[] = usePostgrest(
    pg.auth(props.token).from("col_groups").select().match({ id: col_group_id })
  );
  if (!projects || !colGroups) return h(Spinner);

  const columnGroup: Partial<ColumnGroupI> = colGroups[0];

  const persistChanges = async (
    e: Partial<ColumnGroupI>,
    c: Partial<ColumnGroupI>
  ) => {
    const { data, error } = await pg
      .auth(props.token)
      .from("col_groups")
      .update(c)
      .match({ id: e.id });
    console.log(e, c);
    if (!error) {
      router.push(`/column-groups?project_id=${project_id}`);
      return data[0];
    } else {
      console.error(error);
    }
  };

  const project = projects[0];

  return h(BasePage, { query: props.query, token: props.token }, [
    h("h3", ["Create a New Column Group for ", project.project]),
    //@ts-ignore
    h(ColumnGroupEditor, { model: columnGroup, persistChanges }),
  ]);
}

export async function getServerSideProps(ctx) {
  const { req, res, query } = ctx;

  const token = getCookie("jwt_token", { req, res });

  return {
    props: { token, query }, // will be passed to the page component as props
  };
}
