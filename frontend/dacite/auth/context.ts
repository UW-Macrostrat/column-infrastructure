import { useReducer, createContext, useContext } from "react";
import { createUser, login, setCookie } from "./utils";
import h from "@macrostrat/hyper";

/////////////////// base data types ////////////////////////
export type Credentials = { username: string; password: string };
type LoginStatus = {
  username: string | null;
  login: boolean;
  error: string | null;
};
export type UserInfo = Credentials & {
  firstName: string;
  lastName: string;
  confirmPassword: string;
};

///////////////////////// async actions /////////////////////////
type Login = { type: "login"; payload: Credentials };
type Logout = { type: "logout" };
type Register = { type: "register"; payload: UserInfo };

type AuthAsyncActions = Login | Logout | Register;

////////////////////////// sync actions/////////////////////////
type AuthSuccess = { type: "auth-form-success"; payload: LoginStatus };
type AuthFailure = { type: "auth-form-failure"; payload: LoginStatus };

type RegisterSuccess = { type: "register-success" };
type RegisterFailure = { type: "register-failure"; payload: { error: string } };

type AuthSyncActions =
  | AuthSuccess
  | AuthFailure
  | RegisterSuccess
  | RegisterFailure;

function useAuthActions(
  dispatch: React.Dispatch<AuthAsyncActions | AuthSyncActions>
) {
  return async (action: AuthAsyncActions | AuthSyncActions) => {
    switch (action.type) {
      case "login":
        // login
        const { data, error } = await login(action.payload);
        if (error) {
          return dispatch({
            type: "auth-form-failure",
            payload: { username: null, error: error.message, login: false },
          });
        }
        //set token as cookie
        //@ts-ignore
        const token = data?.token;
        setCookie({ cookieName: "jwt_token", cookieValue: `bearer ${token}` });
        return dispatch({
          type: "auth-form-success",
          payload: {
            username: action.payload.username,
            error: null,
            login: true,
          },
        });
      case "register":
        const { data: data_, error: error_ } = await createUser(action.payload);
        if (error_) {
          return dispatch({
            type: "register-failure",
            payload: { error: error_.message },
          });
        }
        return dispatch({ type: "register-success" });
      default:
        return dispatch(action);
    }
  };
}

interface AuthStateI {
  login: boolean;
  username: string | null;
  error: string | null;
  registerError: string | null;
}

interface AuthCtxI extends AuthStateI {
  runAction(action: AuthSyncActions | AuthAsyncActions): Promise<void>;
}

const authDefaultState: AuthStateI = {
  login: false,
  username: null,
  error: null,
  registerError: null,
};

const AuthContext = createContext<AuthCtxI>({
  ...authDefaultState,
  async runAction() {},
});

function authReducer(
  state = authDefaultState,
  action: AuthSyncActions | AuthAsyncActions
) {
  switch (action.type) {
    case "auth-form-success":
      return {
        ...state,
        username: action.payload.username,
        error: action.payload.error,
        login: action.payload.login,
      };
    case "auth-form-failure":
      return {
        ...state,
        login: false,
        error: action.payload.error,
        username: null,
      };
    case "register-success":
      return {
        ...state,
        registerError: null,
      };
    case "register-failure":
      return { ...state, registerError: action.payload.error };
    default:
      console.warn("Unknown Action", action);
      return state;
  }
}

function AuthProvider(props: any) {
  const [state, dispatch] = useReducer(authReducer, authDefaultState);
  const runAction = useAuthActions(dispatch);

  return h(
    AuthContext.Provider,
    { value: { ...state, runAction } },
    props.children
  );
}

const useAuth = () => useContext(AuthContext);

export { AuthContext, AuthProvider, useAuth };
