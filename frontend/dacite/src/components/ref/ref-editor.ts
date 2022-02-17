import { hyperStyled } from "@macrostrat/hyper";
import { Table } from "../../index";
import { NumericInput, TextArea, InputGroup } from "@blueprintjs/core";
import {
  ModelEditor,
  useModelEditor,
  ModelEditButton,
  //@ts-ignore
} from "@macrostrat/ui-components/lib/esm";
import styles from "../comp.module.scss";
import { RefI } from "../../types";
import { InfoCell, SubmitButton } from "..";

const h = hyperStyled(styles);

interface Model {
  model: RefI;
  actions: any;
  hasChanges: () => boolean;
}

function RefEdit() {
  const { model, actions, hasChanges }: Model = useModelEditor();
  //author: text, year: numeric (validation), ref:textArea, doi:text, url:text

  const updateRef = (field: string, e: any) => {
    actions.updateState({ model: { [field]: { $set: e } } });
  };

  return h("div", [
    h(Table, { interactive: false }, [
      h("tbody", [
        h("tr", [
          h(InfoCell, { text: "Author" }),
          h("td", [
            h(InputGroup, {
              style: { width: "200px" },
              defaultValue: model.author || undefined,
              onChange: (e) => updateRef("author", e.target.value),
            }),
          ]),
          h(InfoCell, { text: "Pub Year" }),
          h("td", [
            h(NumericInput, {
              style: { width: "200px" },
              defaultValue: model.pub_year || undefined,
              onValueChange: (e) => updateRef("pub_year", e),
            }),
          ]),
        ]),
        h("tr", [
          h(InfoCell, { text: "Ref" }),
          h("td", { colSpan: 3 }, [
            h(TextArea, { onChange: (e) => updateRef("ref", e.target.value) }),
          ]),
        ]),
        h("tr", [
          h(InfoCell, { text: "DOI" }),
          h("td", [
            h(InputGroup, {
              style: { width: "200px" },
              defaultValue: model.doi || undefined,
              onChange: (e) => updateRef("doi", e.target.value),
            }),
          ]),
          h(InfoCell, { text: "URL" }),
          h("td", [
            h(InputGroup, {
              style: { width: "200px" },
              defaultValue: model.url || undefined,
              onChange: (e) => updateRef("url", e.target.value),
            }),
          ]),
        ]),
      ]),
    ]),
    h(SubmitButton),
  ]);
}

interface RefEditorProps {
  model: RefI | {};
  persistChanges: (e: RefI, c: Partial<RefI>) => RefI;
}

export function RefEditor(props: RefEditorProps) {
  return h(
    ModelEditor,
    {
      model: props.model,
      persistChanges: props.persistChanges,
      isEditing: true,
      canEdit: true,
    },
    [h(RefEdit)]
  );
}
