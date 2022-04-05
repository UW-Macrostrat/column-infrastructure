import { useState } from "react";
import {
  TextInput,
  Text,
  PasswordInput,
  Button,
  Box,
  Group,
  Modal,
  Anchor,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { Icon } from "@blueprintjs/core";
import { useAuth, Credentials, UserInfo } from "./context";
import styles from "./auth.module.scss";
import { getCookie } from "./utils";

interface AuthFormI {
  onSubmit: (e: any) => void;
  error: string | null;
}

function LoginForm({ onSubmit, error }: AuthFormI) {
  const form = useForm<Credentials>({
    initialValues: {
      username: "",
      password: "",
    },
  });

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto">
      <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
        <TextInput
          icon={<Icon icon="user" />}
          mt="sm"
          required
          label="Username"
          placeholder="Choose a username"
          {...form.getInputProps("username")}
        />
        <PasswordInput
          icon={<Icon icon="lock" />}
          mt="sm"
          label="Password"
          placeholder="Password"
          {...form.getInputProps("password")}
        />

        {error && (
          <Text color="red" size="sm" mt="sm">
            {error}
          </Text>
        )}

        <Group position="right" mt="md">
          <Button type="submit">Login</Button>
        </Group>
      </form>
    </Box>
  );
}

function Register({ onSubmit, error }: AuthFormI) {
  const form = useForm<UserInfo>({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      confirmPassword: "",
    },

    validationRules: {
      password: (value) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value),
      confirmPassword: (value, values) => value == values?.password,
    },
    errorMessages: {
      password:
        "Password should contain 1 number, 1 letter and at least 6 characters",
      confirmPassword: "Passwords do not match",
    },
  });

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto">
      <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
        <Group direction="row" position="apart">
          <TextInput
            mt="sm"
            required
            label="First Name"
            placeholder="Your first name"
            {...form.getInputProps("firstName")}
          />
          <TextInput
            mt="sm"
            required
            label="Last Name"
            placeholder="Your first name"
            {...form.getInputProps("lastName")}
          />
        </Group>
        <TextInput
          icon={<Icon icon="user" />}
          mt="sm"
          required
          label="Username"
          placeholder="Choose a username"
          {...form.getInputProps("username")}
        />
        <PasswordInput
          icon={<Icon icon="lock" />}
          mt="sm"
          label="Password"
          placeholder="Password"
          {...form.getInputProps("password")}
        />

        <PasswordInput
          mt="sm"
          icon={<Icon icon="lock" />}
          label="Confirm password"
          placeholder="Confirm password"
          {...form.getInputProps("confirmPassword")}
        />
        {error && (
          <Text color="red" size="sm" mt="sm">
            {error}
          </Text>
        )}
        <Group position="right" mt="md">
          <Button type="submit">Register</Button>
        </Group>
      </form>
    </Box>
  );
}

function RegisterModal({ initialOpen = true }: { initialOpen: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  const [loggingOn, setLogin] = useState(true);
  const title = loggingOn ? "Login" : "Register";

  const { login, username, error, registerError, runAction } = useAuth();

  const loginSubmit = (values: Credentials) => {
    runAction({ type: "login", payload: values });
  };

  const registerSubmit = (values: UserInfo) => {
    runAction({ type: "register", payload: values });
  };

  console.log(login, username, error);
  return (
    <div>
      <Modal opened={open} onClose={() => setOpen(false)} title={title}>
        {loggingOn ? (
          <LoginForm onSubmit={loginSubmit} error={error} />
        ) : (
          <Register onSubmit={registerSubmit} error={registerError} />
        )}
        <Anchor
          onClick={() => setLogin(!loggingOn)}
          component="button"
          type="button"
          color="gray"
          size="sm"
        >
          {!loggingOn
            ? "Have an account? Login"
            : "Don't have an account? Register"}
        </Anchor>
      </Modal>
    </div>
  );
}

export { LoginForm, Register, RegisterModal };
