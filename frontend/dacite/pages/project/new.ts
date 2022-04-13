import { hyperStyled } from "@macrostrat/hyper";
import pg, {
  usePostgrest,
  PagePropsBaseI,
  BasePage,
  Project,
  ProjectEditor,
  QueryI,
} from "../../src";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import styles from "./project.module.scss";
import axios from "axios";

const h = hyperStyled(styles);

export default function NewProject(props: PagePropsBaseI) {
  const router = useRouter();

  const newProject: Project = {
    project: "",
    descrip: "",
    timescale_id: undefined,
  };

  const persistChanges = async (e: Project, c: Partial<Project>) => {
    const url = "http://localhost:3001/projects";
    const res = await axios.post(
      url,
      {
        ...e,
      },
      {
        headers: { Authorization: `Bearer ${props.token}` },
      }
    );
    // const { data, error } = await pg
    //   .auth(props.token)
    //   .from("projects")
    //   .insert([e]);
    console.log(res);
    router.push("/");
    return data[0];
  };

  return h(BasePage, { query: props.query, token: props.token }, [
    h("h3", ["Create a New Project"]),
    //@ts-ignore
    h(ProjectEditor, { project: newProject, persistChanges }),
  ]);
}

export async function getServerSideProps(ctx) {
  const { req, res, query } = ctx;

  const token = getCookie("jwt_token", { req, res });

  return {
    props: { token, query }, // will be passed to the page component as props
  };
}
