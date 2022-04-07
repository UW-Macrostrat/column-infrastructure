import h from "@macrostrat/hyper";
import Link from "next/link";
import { Icon, MenuDivider, MenuItem } from "@blueprintjs/core";
import { ProjectManagement, UserSelect } from "./user-management";
import { Popover2 } from "@blueprintjs/popover2";
import { Button as Btn, Menu } from "@blueprintjs/core";
import { TextInput, Text, Box, Group, Button } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { useAuth } from "./context";
import { useState } from "react";

interface ProfileI {
  firstName: string;
  lastName: string;
  userName: string;
}

function Profile(props: ProfileI) {
  const form = useForm<ProfileI>({
    initialValues: {
      firstName: props.firstName,
      lastName: props.lastName,
      userName: props.userName,
    },
  });

  const onSubmit = (values: ProfileI) => {
    console.log(values);
  };

  return (
    <Box sx={{ maxWidth: 400 }}>
      <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
        <Group direction="row">
          <TextInput
            mt="sm"
            label="First Name"
            placeholder="Your first name"
            {...form.getInputProps("firstName")}
          />
          <TextInput
            mt="sm"
            label="Last Name"
            placeholder="Your first name"
            {...form.getInputProps("lastName")}
          />
        </Group>
        <TextInput
          icon={<Icon icon="user" />}
          mt="sm"
          label="Username"
          placeholder="Choose a username"
          {...form.getInputProps("userName")}
        />

        <Group position="right" mt="md">
          <Button type="submit">Update Profile</Button>
        </Group>
      </form>
    </Box>
  );
}

function AccountPage() {
  // in reality we'll use the Auth context to get user info and make
  // queries to the database for this info
  const user: ProfileI = {
    firstName: "Casey",
    lastName: "Idzikowski",
    userName: "cidzikowski",
  };

  return h(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        padding: "50px",
        alignItems: "center",
      },
    },
    [
      h(Group, { direction: "column" }, [
        h(Text, { size: "xl" }, ["Hello ", user.firstName]),
        h(Text, { size: "md", color: "dimmed" }, [
          "Here you can manage your public profile as well as manage user access to your projects",
        ]),
      ]),
      h(Profile, { ...user }),
      h(Group, { direction: "column", mt: "lg" }, [
        h(Text, { size: "xl" }, ["Manage user access to projects"]),
        h(Text, { size: "md", color: "dimmed" }, [
          "Here you can manage your public profile as well as manage user access to your projects",
        ]),
      ]),
      h(ProjectManagement),
      h(UserSelect, {
        users: [
          {
            id: 1,
            firstName: "Casey",
            lastName: "Idzikowski",
            username: "cidzikowski",
          },
          {
            id: 2,
            firstName: "Casey",
            lastName: "Idowski",
            username: "cidzikowski",
          },
          {
            id: 3,
            firstName: "Casey",
            lastName: "Idzikow",
            username: "cidzikowski",
          },
        ],
        onUserSelect: (e: any) => console.log(e),
      }),
    ]
  );
}

function AccountMenu() {
  const { username, runAction } = useAuth();
  return h(Menu, [
    h(Link, { href: "/account" }, [
      h(MenuItem, { icon: "cog", text: "Account" }),
    ]),
    h(MenuDivider),
    h(MenuItem, {
      icon: "log-out",
      text: `${username} Logout`,
      onClick: () => runAction({ type: "logout" }),
    }),
  ]);
}

/* if login is false, then it should open the login form */
function AccountButton() {
  const { login, username, runAction } = useAuth();

  const onClick = () => {
    runAction({ type: "request-login-form" });
  };
  return h(
    Popover2,
    { content: h(AccountMenu), minimal: true, disabled: !login },
    [
      h(Btn, {
        minimal: true,
        icon: "person",
        onClick: login ? undefined : onClick,
      }),
    ]
  );
}

export { Profile, AccountPage, AccountButton };
