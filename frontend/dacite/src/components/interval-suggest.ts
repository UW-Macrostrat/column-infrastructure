import { useState, useEffect } from "react";
import { hyperStyled } from "@macrostrat/hyper";
import { Suggest, ItemRenderer, ItemPredicate } from "@blueprintjs/select";
import { MenuItem, Icon, NumericInput, Spinner } from "@blueprintjs/core";
import { IntervalI } from "../types";
import pg from "../db";
import styles from "./comp.module.scss";

const h = hyperStyled(styles);

interface IntervalProps {
  onChange: (e: IntervalI) => void;
  initialSelected?: Partial<IntervalI>;
  onQueryChange?: (e: string) => void;
}

interface IntervalSuggestProps extends IntervalProps {
  intervals: IntervalI[];
}

const InterSuggest = Suggest.ofType<IntervalI>();

function IntervalSuggest(props: IntervalSuggestProps) {
  const [selected, setSelected] = useState(props.initialSelected);
  let itemz = [...props.intervals];

  const itemRenderer: ItemRenderer<IntervalI> = (
    item: IntervalI,
    { handleClick }
  ) => {
    const { id, interval_name } = item;
    const active = selected?.interval_name == interval_name;
    return h(MenuItem, {
      key: id,
      labelElement: active ? h(Icon, { icon: "tick" }) : null,
      text: interval_name,
      onClick: handleClick,
      active: active,
    });
  };

  const itemPredicate: ItemPredicate<IntervalI> = (
    query: string,
    item: IntervalI
  ) => {
    const { id, interval_name } = item;

    return interval_name.toLowerCase().indexOf(query.toLowerCase()) >= 0;
  };

  const onItemSelect = (item: IntervalI) => {
    setSelected(item);
    props.onChange(item);
  };
  //@ts-ignore
  return h(InterSuggest, {
    inputValueRenderer: (item: IntervalI) => item.interval_name,
    items: itemz.slice(0, 200),
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

interface IntervalRowProps extends IntervalProps {
  age_bottom?: number;
  age_top?: number;
  position_top?: number;
  position_bottom?: number;
  onPositionChange: (e: number) => void;
}

function IntervalRow(props: IntervalRowProps) {
  const [intervals, setIntervals] = useState([]);
  const getIntervals = async (query) => {
    if (query.length > 2) {
      const { data, error } = await pg
        .from("intervals")
        .select()
        .like("interval_name", `%${query}%`)
        .limit(200);
      setIntervals(data);
    } else {
      const { data, error } = await pg
        .from("intervals")
        .select()
        .limit(50);
      setIntervals(data);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const { data, error } = await pg
        .from("intervals")
        .select()
        .limit(50);
      setIntervals(data);
    };
    getData();
  }, []);

  const label: string = props.age_top ? "Top (LO): " : "Bottom (FO): ";

  const positionLabel: string = props.position_bottom
    ? "Position Bottom: "
    : "Position Top: ";

  const ageLabel: string = props.age_bottom ? "Age Bottom: " : "Age Top: ";

  return h("tr", [
    h("td", [h("h4", { style: { margin: 0 } }, [label])]),
    h("td", [
      h.if(intervals == undefined)(Spinner),
      h.if(intervals != undefined)(IntervalSuggest, {
        intervals: intervals,
        onChange: props.onChange,
        onQueryChange: getIntervals,
        initialSelected: props.initialSelected,
      }),
    ]),
    h("td", [h("h4", { style: { margin: 0 } }, [ageLabel])]),
    h("td", [props.age_bottom || props.age_top, " ma"]),
    h("td", [h("h4", { style: { margin: 0 } }, [positionLabel])]),
    h("td", [
      h(NumericInput, {
        onValueChange: props.onPositionChange,
        defaultValue: props.position_bottom || props.position_top,
      }),
    ]),
  ]);
}

export { IntervalRow };
