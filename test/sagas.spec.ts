import { strict as assert } from "node:assert";
import { describe, it } from "mocha";
import { runSaga } from "redux-saga";
import { api } from "../src/api/client";
import { actionTypes } from "../src/store/actions";
import { handleLogin } from "../src/store/sagas";

describe("handleLogin saga", () => {
  it("dispatches auth success for demo-token login", async () => {
    const dispatched: unknown[] = [];
    const originalGet = api.get;
    api.get = async () => ({
      data: {
        id: "demo-user",
        email: "demo@example.com",
        name: "Demo User",
        isDemo: true,
      },
    });

    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
      },
      handleLogin,
      {
        type: actionTypes.LOGIN_REQUEST,
        payload: {
          email: "demo@example.com",
          password: "password123",
          useDemoToken: true,
        },
      },
    ).toPromise();

    assert.equal(
      dispatched.some(
        (action) =>
          (action as { type?: string }).type === actionTypes.AUTH_SUCCESS,
      ),
      true,
    );
    assert.equal(
      dispatched.some(
        (action) =>
          (action as { type?: string }).type === actionTypes.TREE_REQUEST,
      ),
      true,
    );

    api.get = originalGet;
  });
});
