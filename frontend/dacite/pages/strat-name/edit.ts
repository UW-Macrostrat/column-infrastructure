import { hyperStyled } from "@macrostrat/hyper";
import { getCookie } from "cookies-next";
import { Spinner } from "@blueprintjs/core";
import pg, {
  StratNameI,
  usePostgrest,
  BasePage,
  StratNameEditor,
  PagePropsBaseI,
} from "../../src";
import { useRouter } from "next/router";
import styles from "./stratname.module.scss";
import { createLink } from "../../src/components/helpers";

const h = hyperStyled(styles);

export default function EditColumnGroup(props: PagePropsBaseI) {
  const router = useRouter();
  const { project_id, col_group_id, strat_name_id } = props.query;

  if (!strat_name_id) return h(Spinner);

  const strat_names: StratNameI[] = usePostgrest(
    pg
      .auth(props.token)
      .from("strat_names")
      .select()
      .match({ id: strat_name_id })
  );

  if (!strat_names) return h(Spinner);

  const persistChanges = async (e: StratNameI, c: Partial<StratNameI>) => {
    const { data, error } = await pg
      .auth(props.token)
      .from("strat_names")
      .update(c)
      .match({ id: e.id });
    console.log(e, c);
    if (!error) {
      router.push(createLink("/units/edit", { ...props.query }));
      return data[0];
    } else {
      console.error(error);
    }
  };

  const strat_name = strat_names[0];

  return h(BasePage, { query: props.query, token: props.token }, [
    h("h3", ["Edit Stratigraphic Name ", strat_name.strat_name]),
    //@ts-ignore
    h(StratNameEditor, { model: strat_name, persistChanges }),
  ]);
}

export async function getServerSideProps(ctx) {
  const { req, res, query } = ctx;

  const token = getCookie("jwt_token", { req, res });

  return {
    props: { token, query }, // will be passed to the page component as props
  };
}
