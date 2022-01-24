import h from "@macrostrat/hyper";
import Link from "next/link";
import { Button } from "@blueprintjs/core";
import pg, { usePostgrest } from "../src";

function Home() {
  const projects = usePostgrest(pg.from("projects"));

  if (!projects) return h("div");

  return h("div", [
    projects.map((project) => {
      return h(Link, { href: `/column-groups?project_id=${project.id}` }, [
        h(Button, [project.project]),
      ]);
    }),
  ]);
}

export default Home;
