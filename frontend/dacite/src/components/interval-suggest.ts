import { hyperStyled } from "@macrostrat/hyper";
import { Suggest, ItemRenderer, ItemPredicate } from "@blueprintjs/select";
import { MenuItem, Icon, NumericInput } from "@blueprintjs/core";
import { IntervalI } from "../types";
import styles from "./comp.module.scss";

const h = hyperStyled(styles);

interface IntervalSuggestProps {
  intervals: IntervalI[];
  onChange: (e: IntervalI) => void;
  initialSelected?: Partial<IntervalI>;
}

const InterSuggest = Suggest.ofType<IntervalI>();

function IntervalSuggest(props: IntervalSuggestProps) {
  let itemz = [...props.intervals];

  const itemRenderer: ItemRenderer<IntervalI> = (
    item: IntervalI,
    { handleClick, modifiers, query }
  ) => {
    const { id, interval_name } = item;
    return h(MenuItem, {
      key: id,
      labelElement: modifiers.active ? h(Icon, { icon: "tick" }) : null,
      text: interval_name,
      onClick: handleClick,
      active: modifiers.active,
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
    props.onChange(item);
  };
  //@ts-ignore
  return h(InterSuggest, {
    inputValueRenderer: (item: IntervalI) => item.interval_name,
    items: itemz,
    popoverProps: {
      minimal: true,
      popoverClassName: styles.mySuggest,
    },
    defaultSelectedItem: props.initialSelected,
    onItemSelect: onItemSelect,
    itemRenderer: itemRenderer,
    itemPredicate: itemPredicate,
    resetOnQuery: true,
  });
}

interface IntervalRowProps extends IntervalSuggestProps {
  age_bottom?: number;
  age_top?: number;
  position_top?: number;
  position_bottom?: number;
  onPositionChange: (e: number) => void;
}

function IntervalRow(props: IntervalRowProps) {
  const label: string = props.age_top ? "Top (LO): " : "Bottom (FO): ";

  const positionLabel: string = props.position_bottom
    ? "Position Bottom: "
    : "Position Top: ";

  const ageLabel: string = props.age_bottom ? "Age Bottom: " : "Age Top: ";

  return h("tr", [
    h("td", [h("h4", { style: { margin: 0 } }, [label])]),
    h("td", [
      h(IntervalSuggest, {
        intervals: props.intervals,
        onChange: props.onChange,
        initialSelected: props.initialSelected,
      }),
    ]),
    h("td", [h("h4", { style: { margin: 0 } }, [ageLabel])]),
    h("td", [props.age_bottom || props.age_top]),
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
