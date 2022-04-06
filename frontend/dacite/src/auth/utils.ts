import pg from "..";

interface GetCookieI {
  cookieName: string;
}

interface setCookieI extends GetCookieI {
  cookieValue: string;
}

function setCookie(props: setCookieI) {
  const d = new Date();
  d.setTime(d.getTime() + 1 * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie =
    props.cookieName + "=" + props.cookieValue + ";" + expires + ";path=/";
}

function getCookie(props: GetCookieI) {
  let name = props.cookieName + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function removeCookie(props: GetCookieI) {
  document.cookie = props.cookieName + "=; Max-Age=-99999999;";
}

interface LoginI {
  username: string;
  password: string;
}

async function login(props: LoginI) {
  const { data, error } = await pg.rpc("login", {
    username: props.username,
    pass: props.password,
  });

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
  const token = getCookie({ cookieName: "jwt_token" });
  console.log(token);
  const { data, error } = await pg
    .auth(getCookie({ cookieName: "jwt_token" }))
    .rpc("get_username");
  return { data, error };
}

export { setCookie, getCookie, login, createUser, getStatus };
