import { hyperStyled } from "@macrostrat/hyper";
import { getCookie } from "cookies-next";
import pg, {
  StratNameI,
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
  const { name, unit_id } = props.query;

  const persistChanges = async (e: StratNameI, c: Partial<StratNameI>) => {
    const { data, error } = await pg
      .auth(props.token)
      .from("strat_names")
      .insert([e]);
    const strat_name_id: number = data[0].id;
    if (!error) {
      const { data, error } = await pg
        .auth(props.token)
        .from("units")
        .update({ strat_name_id: strat_name_id })
        .match({ id: unit_id });
      router.push(createLink("/units/edit", { ...props.query }));
      // return data[0];
    } else {
      console.error(error);
    }
  };

  let model: Partial<StratNameI> = {};
  if (name != undefined) {
    model.strat_name = name;
  }

  return h(BasePage, { query: props.query, token: props.token }, [
    h("h3", ["Make New Stratigraphic Name "]),
    //@ts-ignore
    h(StratNameEditor, {
      model,
      persistChanges,
    }),
  ]);
}

export async function getServerSideProps(ctx) {
  const { req, res, query } = ctx;

  const token = getCookie("jwt_token", { req, res });

  return {
    props: { token, query }, // will be passed to the page component as props
  };
}
