import h from "@macrostrat/hyper";
import { BasePage } from "../../src";
import {
  LoginForm,
  Register,
  RegisterModal,
  AuthProvider,
  AccountPage,
} from "../../src/auth";

function Home() {
  return h(BasePage, { query: {} }, [h(AccountPage)]);
}

export default Home;
