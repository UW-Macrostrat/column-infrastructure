import { useState, useEffect } from "react";
import { Suggest, ItemRenderer, ItemPredicate } from "@blueprintjs/select";
import { Icon, MenuItem, Spinner } from "@blueprintjs/core";
import pg, { usePostgrest } from "../db";
import { hyperStyled } from "@macrostrat/hyper";
import styles from "./comp.module.scss";

const h = hyperStyled(styles);

interface StratSuggestProps {
  initialSelected: string | undefined;
  strat_names: string[];
  onChange: (item: string) => void;
  onQueryChange?: (query: string) => void;
}

function StratNameSuggest(props: StratSuggestProps) {
  let itemz = [...props.strat_names];
  if (
    props.initialSelected &&
    props.strat_names.includes(props.initialSelected)
  ) {
    const spot = itemz.indexOf(props.initialSelected);
    itemz.splice(spot, 1);
  }

  const [selected, setSelected] = useState(props.initialSelected);

  const itemRenderer: ItemRenderer<string> = (
    item: String,
    { handleClick, index }
  ) => {
    const active = selected == item;
    return h(MenuItem, {
      key: index,
      labelElement: active ? h(Icon, { icon: "tick" }) : null,
      text: item,
      onClick: handleClick,
      active: active,
    });
  };

  const itemPredicate: ItemPredicate<string> = (
    query: string,
    item: string
  ) => {
    return item.toLowerCase().indexOf(query.toLowerCase()) >= 0;
  };

  const onItemSelect = (item: string) => {
    setSelected(item);
    props.onChange(item);
  };
  //@ts-ignore
  return h(Suggest, {
    inputValueRenderer: (item: string) => item,
    items: props.initialSelected ? [props.initialSelected, ...itemz] : itemz,
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
  setNames: (e: string[]) => void
) => {
  if (query.length > 2) {
    const { data, error } = await pg
      .from("strat_names")
      .select("strat_name,rank")
      .like("strat_name", `%${query}%`)
      .limit(50);
    const strat_names = data.map((n) => `${n.strat_name} (${n.rank})`);
    setNames(strat_names);
  } else {
    const { data, error } = await pg
      .from("strat_names")
      .select("strat_name,rank")
      .limit(50);
    const strat_names = data.map((n) => `${n.strat_name} (${n.rank})`);
    setNames(strat_names);
  }
};

interface StratCellProps {
  initialSelected: string | undefined;
  onChange: (item: string) => void;
}

function StratNameCell(props: StratCellProps) {
  const [names, setNames] = useState<string[]>([""]);

  const onQueryChange = (i: string) => {
    getStratNames(i, (e: string[]) => setNames(e));
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
