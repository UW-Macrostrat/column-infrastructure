import { getCookie } from "cookies-next";
import pg from "..";
import { UserInfo } from "./context";

interface LoginI {
  username: string;
  password: string;
}

async function login(props: LoginI) {
  console.log(props);
  const { data, error } = await pg.auth("").rpc("login", {
    username: props.username,
    pass: props.password,
  });
  console.log(data, error);
  return { data, error };
}

async function createUser(props: UserInfo) {
  const { data, error } = await pg.auth("").rpc("create_user", {
    firstname: props.firstName,
    lastname: props.lastName,
    pass: props.password,
    username: props.username,
  });

  return { data, error };
}

async function getStatus() {
  const token: string = getCookie("jwt_token");
  console.log(token);
  if (typeof token === undefined) {
    return { data: {}, error: { message: "no longer logged in" } };
  }
  const { data, error } = await pg.auth(token).rpc("get_username");
  return { data, error };
}

export { getCookie, login, createUser, getStatus };
