import h from "@macrostrat/hyper";
import { Projects } from "./project";
import { LoginForm, Register, RegisterModal, AuthProvider } from "../auth";

function Home() {
  return h("div", [h(AuthProvider, [h(RegisterModal)])]);
}

export default Home;
