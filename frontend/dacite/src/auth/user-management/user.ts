import h from "@macrostrat/hyper";
import { Icon } from "@blueprintjs/core";
import { forwardRef, useState } from "react";
import { Select, Text, Group, SelectItem, Button } from "@mantine/core";

import data from "./fake-users.json";

const roleData: RoleI[] = data.roles.map((r) => {
  const obj: RoleI = {
    id: r.id,
    value: r.role,
    label: r.role,
    description: r.description,
  };
  return obj;
});

interface RoleI {
  id: number;
  value: string;
  label: string;
  description: string;
}
interface RolesI extends React.ComponentPropsWithoutRef<"div"> {
  roles: RoleI[];
  defaultRole?: string;
  onRoleSelect: (value: any) => void;
}

const RoleSelectItem = forwardRef<HTMLDivElement, RoleI>((props: RoleI, ref) =>
  h("div", { ref, ...props }, [
    h(Group, { noWrap: true, direction: "column" }, [
      h(Text, { size: "sm" }, [props.label]),
      h(Text, { size: "xs", color: "dimmed" }, [props.description]),
    ]),
  ])
);

function RoleSelect(props: RolesI) {
  const [value, setValue] = useState(props.defaultRole);

  const onChange = (value: string) => {
    setValue(value);
    props.onRoleSelect(value);
  };

  return h(Select, {
    onChange,
    value,
    searchable: true,
    itemComponent: RoleSelectItem,
    data: props.roles,
    // label: "Choose a data role",
    placeholder: "Pick One",
    filter: (value: string, item: SelectItem) =>
      item.label.toLowerCase().includes(value.toLowerCase().trim()) ||
      item.description.toLowerCase().includes(value.toLowerCase().trim()),
  });
}

export interface UserI {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role?: string;
}

function User(props: UserI) {
  const onRoleSelect = (role: any) => {
    console.log(role, props.id, props.username);
  };

  return h(Group, { mt: "sm" }, [
    h(Text, { size: "md" }, [props.username]),
    h(RoleSelect, { roles: roleData, defaultRole: props.role, onRoleSelect }),
    h(Button, { color: "red", size: "xs" }, [
      h(Icon, { icon: "trash", size: 14 }),
    ]),
  ]);
}

interface UserSelectI {
  users: UserI[];
  onUserSelect: (e: any) => void;
}

interface SelectData {
  id: number;
  value: string;
  label: string;
}

function UserSelect(props: UserSelectI) {
  const userData: SelectData[] = props.users.map((user) => {
    const obj: SelectData = {};
    obj.id = user.id;
    obj.label = `${user.firstName} ${user.lastName} (${user.username})`;
    obj.value = obj.label;
    return obj;
  });

  return h(Select, {
    data: userData,
    onChange: props.onUserSelect,
  });
}

export { RoleSelect, User, UserSelect };
