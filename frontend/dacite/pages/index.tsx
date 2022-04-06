import h from "@macrostrat/hyper";
import { Projects } from "./project";
import { getCookie } from "cookies-next";

function Home(props: any) {
  console.log(props);
  return h(Projects, { ...props });
}

export async function getServerSideProps({ req, res }) {
  const token = getCookie("jwt_token", { req, res });

  return {
    props: { message: `Next.js is awesome`, token }, // will be passed to the page component as props
  };
}

export default Home;
