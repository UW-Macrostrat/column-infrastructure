import h from "@macrostrat/hyper";
import { Projects } from "./project";
import { getCookie } from "cookies-next";
import pg, { usePostgrest, Project } from "../src";

function Home(props: any) {
  return h(Projects, { ...props });
}

export async function getServerSideProps(ctx) {
  const { req, res } = ctx;

  const token = getCookie("jwt_token", { req, res });
  const { data, error } = await pg.auth(token).from("projects");

  return {
    props: { projects: data || [], token: token || null }, // will be passed to the page component as props
  };
}

export default Home;
