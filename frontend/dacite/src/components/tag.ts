import { hyperStyled } from "@macrostrat/hyper";
import { Tooltip2 as Tooltip } from "@blueprintjs/popover2";
import { Tag } from "@blueprintjs/core";
import styles from "./comp.module.scss";

const h = hyperStyled(styles);

interface tagBody {
  name: string;
  description: string;
  color: string;
  onClickDelete?: (e) => void;
  id?: number;
  disabled?: boolean;
  isEditing?: boolean;
}

export function isTooDark(hexcolor) {
  var r = parseInt(hexcolor.substr(1, 2), 16);
  var g = parseInt(hexcolor.substr(3, 2), 16);
  var b = parseInt(hexcolor.substr(4, 2), 16);
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq < 90;
}

/**
 *
 * @param props: tagBody
 * @returns
 */
function TagBody(props: tagBody) {
  const {
    name,
    description,
    color,
    onClickDelete,
    isEditing = false,
    id = 10000,
    disabled = false,
  } = props;

  const showName = name.length > 0 ? name : "Tag Preview";
  const darkTag = isTooDark(color);

  const textColor = darkTag ? "white" : "black";

  const onRemove = () => {
    onClickDelete(id);
  };

  return h(Tooltip, { content: description, disabled }, [
    h(
      Tag,
      {
        key: id,
        large: true,
        round: true,
        onRemove: isEditing && onRemove,
        style: { backgroundColor: color, color: textColor },
      },
      [showName]
    ),
  ]);
}

export { TagBody };
