import { useState } from "react";
import { hyperStyled } from "@macrostrat/hyper";
import { Suggest, ItemRenderer, ItemPredicate } from "@blueprintjs/select";
import { MenuItem, Icon } from "@blueprintjs/core";
import styles from "./comp.module.scss";
import { RefI } from "..";

const h = hyperStyled(styles);

const InterSuggest = Suggest.ofType<RefI>();

interface RefSuggestProps {
  initialSelected: RefI | undefined;
  refs: RefI[];
  onChange: (item: RefI) => void;
  onQueryChange?: (query: string) => void;
}

function RefSuggest(props: RefSuggestProps) {
  const selected_ = props.refs.filter((t) => t.id == props.initialSelected?.id);
  let newSelected: RefI | undefined;
  if (selected_.length > 0) {
    newSelected = selected_[0];
  }

  const [selected, setSelected] = useState(newSelected);
  let itemz = [...props.refs];

  const itemRenderer: ItemRenderer<RefI> = (item: RefI, { handleClick }) => {
    const { id, author, pub_year } = item;
    const active = selected?.id == id;
    return h(MenuItem, {
      key: id,
      labelElement: active ? h(Icon, { icon: "tick" }) : null,
      text: `${author}(${pub_year})`,
      onClick: handleClick,
      active: active,
    });
  };

  const itemPredicate: ItemPredicate<RefI> = (query: string, item: RefI) => {
    const { id, author } = item;

    return author.toLowerCase().indexOf(query.toLowerCase()) >= 0;
  };

  const onItemSelect = (item: RefI) => {
    setSelected(item);
    props.onChange(item);
  };
  //@ts-ignore
  return h(InterSuggest, {
    inputValueRenderer: (item: RefI) => `${item.author}(${item.pub_year})`,
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

export { RefSuggest };
