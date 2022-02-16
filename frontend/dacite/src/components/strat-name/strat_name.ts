import { useState, useEffect } from "react";
import { Suggest, ItemRenderer, ItemPredicate } from "@blueprintjs/select";
import { Icon, MenuItem, Spinner } from "@blueprintjs/core";
import pg, { usePostgrest } from "../../db";
import { hyperStyled } from "@macrostrat/hyper";
import styles from "../comp.module.scss";
import { StratNameI } from "../..";

const h = hyperStyled(styles);

interface StratSuggestProps {
  initialSelected: StratNameI | undefined;
  strat_names: StratNameI[];
  onChange: (item: StratNameI) => void;
  onQueryChange?: (query: string) => void;
}

function StratNameSuggest(props: StratSuggestProps) {
  let itemz = [...props.strat_names];
  if (
    props.initialSelected &&
    props.strat_names.map((s) => s.id).includes(props.initialSelected.id)
  ) {
    const spot = itemz.map((s) => s.id).indexOf(props.initialSelected.id);
    itemz.splice(spot, 1);
  }

  const [selected, setSelected] = useState(props.initialSelected);

  const itemRenderer: ItemRenderer<StratNameI> = (
    item: StratNameI,
    { handleClick, index }
  ) => {
    const active = selected?.id == item.id;
    return h(MenuItem, {
      key: index,
      labelElement: active ? h(Icon, { icon: "tick" }) : null,
      text: `${item.strat_name} (${item.rank})`,
      onClick: handleClick,
      active: active,
    });
  };

  const itemPredicate: ItemPredicate<StratNameI> = (
    query: string,
    item: StratNameI
  ) => {
    return item.strat_name.toLowerCase().indexOf(query.toLowerCase()) >= 0;
  };

  const onItemSelect = (item: StratNameI) => {
    setSelected(item);
    props.onChange(item);
  };
  //@ts-ignore
  return h(Suggest, {
    inputValueRenderer: (item: StratNameI) => item.strat_name,
    items: itemz,
    popoverProps: {
      minimal: true,
      popoverClassName: styles.mySuggest,
    },
    selectedItem: selected,
    onItemSelect: onItemSelect,
    itemRenderer: itemRenderer,
    itemPredicate: itemPredicate,
    onQueryChange: props.onQueryChange,
    resetOnQuery: true,
  });
}

const getStratNames = async (
  query: string,
  setNames: (e: StratNameI[]) => void
) => {
  if (query.length > 2) {
    const { data, error } = await pg
      .from("strat_names")
      .select()
      .like("strat_name", `%${query}%`)
      .limit(50);
    //const strat_names = data.map((n) => `${n.strat_name} (${n.rank})`);
    setNames(data);
  } else {
    const { data, error } = await pg
      .from("strat_names")
      .select()
      .limit(50);
    //const strat_names = data.map((n) => `${n.strat_name} (${n.rank})`);
    setNames(data);
  }
};

interface StratCellProps {
  initialSelected: StratNameI | undefined;
  onChange: (item: StratNameI) => void;
}

function StratNameCell(props: StratCellProps) {
  const [names, setNames] = useState<StratNameI[]>([]);

  const onQueryChange = (i: string) => {
    getStratNames(i, (e: StratNameI[]) => setNames(e));
  };

  useEffect(() => {
    onQueryChange("");
  }, []);

  return h(StratNameSuggest, {
    strat_names: names,
    onQueryChange: onQueryChange,
    onChange: props.onChange,
    initialSelected: props.initialSelected,
  });
}

export { StratNameSuggest, StratNameCell };
