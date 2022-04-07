import { hyperStyled } from "@macrostrat/hyper";
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
import { getCookie } from "cookies-next";
const h = hyperStyled(styles);

export default function NewProject(props: PagePropsBaseI) {
  const router = useRouter();
  const { project_id } = props.query;

  const projects: Project[] = usePostgrest(
    pg.auth(props.token).from("projects").select().match({ id: project_id })
  );

  if (!projects) return h(Spinner);

  const newColumnGroup: Partial<ColumnGroupI> = {
    col_group: "",
    col_group_long: "",
  };

  const persistChanges = async (
    e: Partial<ColumnGroupI>,
    c: Partial<ColumnGroupI>
  ) => {
    const { data, error } = await pg
      .auth(props.token)
      .from("col_groups")
      .insert([{ ...e, project_id: project_id }]);
    if (!error) {
      router.push(`/column-groups?project_id=${project_id}`);
      return data[0];
    } else {
      //catch error
    }
  };

  const project = projects[0];

  return h(BasePage, { query: props.query, token: props.token }, [
    h("h3", ["Create a New Column Group for ", project.project]),
    //@ts-ignore
    h(ColumnGroupEditor, { model: newColumnGroup, persistChanges }),
  ]);
}
export async function getServerSideProps(ctx) {
  const { req, res, query } = ctx;

  const token = getCookie("jwt_token", { req, res });

  return {
    props: { token, query }, // will be passed to the page component as props
  };
}
