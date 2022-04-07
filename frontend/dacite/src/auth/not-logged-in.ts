import h from "@macrostrat/hyper";
import { Button, NonIdealState } from "@blueprintjs/core";
import { useAuth } from ".";
/* 
A base, non ideal state component for when no one is logged in, basic
page that just says not logged in and a button click will trigger the login/register panel 
*/

function NotLoggedIn() {
  const { runAction } = useAuth();

  return h(
    NonIdealState,
    {
      icon: "person",
      title: "No one logged in!",
      description: "Login or create a new user to start editing some projects",
    },
    [
      h(
        Button,
        {
          onClick: () => runAction({ type: "request-login-form" }),
          intent: "primary",
        },
        ["Login"]
      ),
    ]
  );
}

export { NotLoggedIn };
