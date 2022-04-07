import { getCookie } from "cookies-next";
import pg from "..";

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

async function createUser(props: LoginI) {
  const { data, error } = await pg.rpc("create_user", {
    username: props.username,
    pass: props.password,
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
