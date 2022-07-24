import h from "@macrostrat/hyper";
import { PostgrestError, PostgrestResponse } from "@supabase/postgrest-js";
import { GetServerSideProps } from "next";
import pg, {
  BasePage,
  EditButton,
  createUnitBySections,
  UnitsView,
  ColSectionI,
  fetchIdsFromColId,
  IdsFromCol,
  UnitSectionTable,
  isServer,
} from "~/index";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let {
    query: { col_id },
  } = ctx;
  if (Array.isArray(col_id)) {
    col_id = col_id[0];
  }

  const query: IdsFromCol = await fetchIdsFromColId(parseInt(col_id ?? "0"));

  const { data: colSections, error: e }: PostgrestResponse<ColSectionI> =
    await pg.rpc("get_col_section_data", {
      column_id: col_id,
    });

  const {
    data: column,
    error: col_error,
  }: PostgrestResponse<{ col_name: string }> = await pg
    .from("cols")
    .select("col_name")
    .match({ id: col_id });

  const { data: units, error: unit_error }: PostgrestResponse<UnitsView> =
    await pg
      .from("unit_strat_name_expanded")
      .select(
        /// joins the lith_unit and environ_unit table
        "*,strat_names(*, strat_names_meta(*)),lith_unit!unit_liths_unit_id_fkey(*),environ_unit!unit_environs_unit_id_fkey(*)"
      )
      .order("position_bottom", { ascending: true })
      .match({ col_id: col_id });

  const sections: { [section_id: string | number]: UnitsView[] }[] =
    createUnitBySections(units);

  const errors = [e, col_error, unit_error].filter((e) => e != null);
  return {
    props: {
      col_id,
      colSections,
      column,
      errors,
      query,
      sections,
    },
  };
};

export default function Columns(props: {
  col_id: string;
  colSections: ColSectionI[];
  column: { col_name: string }[];
  errors: PostgrestError[];
  query: IdsFromCol;
  sections: { [section_id: number | string]: UnitsView[] }[];
}) {
  const { col_id, colSections, column, query, sections, errors } = props;

  console.log(sections);

  const columnName = column ? column[0].col_name : null;

  return h(BasePage, { query, errors }, [
    h("h3", [
      `Sections for Column: ${columnName}`,
      h(EditButton, {
        href: `/column/${col_id}/edit`,
      }),
    ]),
    // there doesn't appear to be a good solution yet, so this is the best we can do. It loses the SSR
    // for this component unfortunately
    h.if(!isServer())(UnitSectionTable, { sections, colSections, col_id }),
  ]);
}
