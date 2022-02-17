import { useState } from "react";
import { hyperStyled } from "@macrostrat/hyper";
import { Table } from "../../index";
import {
  Button,
  NumericInput,
  Collapse,
  InputGroup,
  Spinner,
} from "@blueprintjs/core";
import {
  ModelEditor,
  useModelEditor,
  ModelEditButton,
  //@ts-ignore
} from "@macrostrat/ui-components/lib/esm";
import styles from "../comp.module.scss";
import { ColumnForm, ColumnGroupI } from "../../types";
import { RefSuggest } from "../ref/ref-suggest";
import { RefI } from "../../types";
import pg, { usePostgrest } from "../../db";
import { RefEditor } from "../ref/ref-editor";
import { SubmitButton, CancelButton } from "..";

const h = hyperStyled(styles);

interface Model {
  model: ColumnForm;
  actions: any;
  hasChanges: () => boolean;
}

function ColumnRef() {
  const [open, setOpen] = useState(false);

  const { model, actions, hasChanges }: Model = useModelEditor();
  const refs: RefI[] = usePostgrest(
    pg.from("refs").select("id, pub_year, author, ref, doi, url")
  );

  if (!refs) return h(Spinner);

  const onClick = () => {
    setOpen(!open);
  };

  const onChange = (item: RefI) => {
    actions.updateState({ model: { ref: { $set: item } } });
  };
  // have the ref suggest as well as option to create new ref.
  return h("div", [
    h(RefSuggest, { refs, initialSelected: model.ref, onChange }),
    h(Button, { onClick }, ["New Ref"]),
    h(Collapse, { isOpen: open }, [h(NewRef)]),
  ]);
}

function NewRef() {
  const { model, actions, hasChanges }: Model = useModelEditor();

  const persistChanges = (e: RefI, c: Partial<RefI>) => {
    // would need to post ref to back as new ref first
    actions.updateState({ model: { ref: { $set: e } } });
    return e;
  };

  return h(RefEditor, { model: model.ref || {}, persistChanges });
}

/* 
Col Group: Suggest -> but only if you wanna switch
NOTES: text area field
REF: Suggest -> New Ref possiblity, collapse? 
*/

function ColumnEdit({ curColGroup }: { curColGroup: Partial<ColumnGroupI> }) {
  const { model, actions, hasChanges }: Model = useModelEditor();

  const updateColumn = (field: string, e: any) => {
    actions.updateState({ model: { [field]: { $set: e } } });
  };

  return h("div", [
    h(Table, { interactive: false }, [
      h("tbody", [
        h("tr", [
          h("td", [h("h4", ["Column Name"])]),
          h("td", [
            h(InputGroup, {
              style: { width: "200px" },
              defaultValue: model.col_name || undefined,
              onChange: (e) => updateColumn("col_name", e.target.value),
            }),
          ]),
        ]),
        h("tr", [
          h("td", [h("h4", ["Column Number"])]),
          h("td", [
            h(NumericInput, {
              style: { width: "200px" },
              defaultValue: model.col_number || undefined,
              onValueChange: (e) => updateColumn("col_number", e),
            }),
          ]),
        ]),
        h("tr", [
          h("td", [h("h4", ["Column Group"])]),
          h("td", [curColGroup.col_group]),
        ]),
        h("tr", [h("td", [h("h4", ["Ref"])]), h("td", [h(ColumnRef)])]),
      ]),
    ]),
    h(SubmitButton),
    h(CancelButton, { href: "/column" }),
  ]);
}

interface ColumnEditorProps {
  model: ColumnForm | {};
  curColGroup: Partial<ColumnGroupI>;
  persistChanges: (e: ColumnForm, c: Partial<ColumnForm>) => ColumnForm;
}

export function ColumnEditor(props: ColumnEditorProps) {
  return h(
    ModelEditor,
    {
      model: props.model,
      persistChanges: props.persistChanges,
      isEditing: true,
      canEdit: true,
    },
    [
      h(ColumnEdit, {
        curColGroup: props.curColGroup,
      }),
    ]
  );
}
