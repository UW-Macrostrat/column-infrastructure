import { hyperStyled } from "@macrostrat/hyper";
import pg, {
  usePostgrest,
  BasePage,
  Project,
  ProjectEditor,
  QueryI,
  PagePropsBaseI,
} from "../../src";
import { useRouter } from "next/router";
import styles from "./project.module.scss";
import { Spinner } from "@blueprintjs/core";
import { getCookie } from "cookies-next";
const h = hyperStyled(styles);

export default function EditProject(props: PagePropsBaseI) {
  const router = useRouter();
  const { project_id } = router.query;
  const project: Project = usePostgrest(
    pg
      .auth(props.token)
      .from("projects")
      .select()
      .match({ id: project_id })
      .limit(1)
  );

  if (!project) return h(Spinner);

  const persistChanges = async (e: Project, c: Partial<Project>) => {
    console.log("token", props.token);
    const { data, error } = await pg
      .auth(props.token)
      .from("projects")
      .update(c)
      .match({ id: e.id });
    console.log("Error", error, data);
    if (!error) {
      router.push("/");
      return data[0];
    } else {
      // error catching here
    }
  };

  return h(BasePage, { query: props.query, token: props.token }, [
    h("h3", ["Create a New Project"]),
    //@ts-ignore
    h(ProjectEditor, { project: project[0], persistChanges }),
  ]);
}

export async function getServerSideProps(ctx) {
  const { req, res, query } = ctx;

  const token = getCookie("jwt_token", { req, res });

  return {
    props: { token, query }, // will be passed to the page component as props
  };
}
