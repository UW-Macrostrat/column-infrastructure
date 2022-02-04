import { useState } from "react";
import { hyperStyled } from "@macrostrat/hyper";
import { Suggest, ItemRenderer, ItemPredicate } from "@blueprintjs/select";
import { Project, TimeScale } from "../types";
import {
  Button,
  FormGroup,
  InputGroup,
  MenuItem,
  Icon,
  Spinner,
  TextArea,
} from "@blueprintjs/core";
import {
  ModelEditor,
  useModelEditor,
  ModelEditButton,
  //@ts-ignore
} from "@macrostrat/ui-components/lib/esm";
import styles from "./comp.module.scss";
import pg, { usePostgrest } from "..";

const h = hyperStyled(styles);
interface TimeScaleSuggestProps {
  onChange: (e: TimeScale) => void;
  initialSelected?: number;
  onQueryChange?: (e: string) => void;
  timescales: TimeScale[];
}

const InterSuggest = Suggest.ofType<TimeScale>();

function TimeScaleSuggest(props: TimeScaleSuggestProps) {
  const selected_ = props.timescales.filter(
    (t) => t.id == props.initialSelected
  );
  let newSelected: TimeScale | undefined;
  if (selected_.length > 0) {
    newSelected = selected_[0];
  }

  const [selected, setSelected] = useState(newSelected);
  let itemz = [...props.timescales];

  const itemRenderer: ItemRenderer<TimeScale> = (
    item: TimeScale,
    { handleClick }
  ) => {
    const { id, timescale } = item;
    const active = selected?.timescale == timescale;
    return h(MenuItem, {
      key: id,
      labelElement: active ? h(Icon, { icon: "tick" }) : null,
      text: timescale,
      onClick: handleClick,
      active: active,
    });
  };

  const itemPredicate: ItemPredicate<TimeScale> = (
    query: string,
    item: TimeScale
  ) => {
    const { id, timescale } = item;

    return timescale.toLowerCase().indexOf(query.toLowerCase()) >= 0;
  };

  const onItemSelect = (item: TimeScale) => {
    setSelected(item);
    props.onChange(item);
  };
  //@ts-ignore
  return h(InterSuggest, {
    inputValueRenderer: (item: TimeScale) => item.timescale,
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

function ProjectEdit() {
  const {
    model,
    actions,
    isEditing,
    hasChanges,
  }: {
    model: Project;
    actions: any;
    isEditing: boolean;
    hasChanges: () => boolean;
  } = useModelEditor();

  const timescales: TimeScale[] = usePostgrest(pg.from("timescales"));

  // two text editors, name and description
  // could have a suggest for the timescale

  const defaultProjectName =
    model.project.length > 2 ? model.project : undefined;
  const defaultProjectDescrip =
    model.descrip.length > 2 ? model.descrip : undefined;

  const updateProject = (field: string, e: any) => {
    actions.updateState({ model: { [field]: { $set: e } } });
  };

  return h("div", [
    h(
      FormGroup,
      {
        helperText: "Add a name to your project",
        label: "Project Name",
        labelFor: "project-input",
        labelInfo: "(required)",
      },
      [
        h(InputGroup, {
          style: { width: "200px" },
          defaultValue: defaultProjectName,
          onChange: (e) => updateProject("project", e.target.value),
        }),
      ]
    ),
    h(
      FormGroup,
      {
        helperText: "Add a description to your project",
        label: "Project Description",
        labelFor: "descrip-input",
        labelInfo: "(recommended)",
      },
      [
        h(TextArea, {
          style: { minHeight: "170px", minWidth: "500px" },
          defaultValue: defaultProjectDescrip,
          onChange: (e) => updateProject("descrip", e.target.value),
        }),
      ]
    ),
    h(
      FormGroup,
      {
        helperText: "Most projects use International Ages",
        label: "Project Timescale",
        labelFor: "timescale-input",
        labelInfo: "(required)",
      },
      [
        h.if(timescales == undefined)(Spinner),
        h.if(timescales != undefined)(TimeScaleSuggest, {
          initialSelected: model.timescale_id,
          timescales,
          onChange: (e: TimeScale) => updateProject("timescale", e),
        }),
      ]
    ),
    h(
      Button,
      {
        intent: "success",
        onClick: () => actions.persistChanges(),
        disabled: !hasChanges(),
      },
      ["Submit"]
    ),
  ]);
}

interface ProjectEditorProps {
  project: Project | {};
  persistChanges: (e: Partial<Project>, c: Partial<Project>) => Project;
}

function ProjectEditor(props: ProjectEditorProps) {
  return h(
    ModelEditor,
    {
      model: props.project,
      //@ts-ignore
      persistChanges: props.persistChanges,
      canEdit: true,
      isEditing: true,
    },
    [h(ProjectEdit)]
  );
}

export { ProjectEditor };
