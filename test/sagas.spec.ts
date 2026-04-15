import { strict as assert } from "node:assert";
import { describe, it } from "mocha";
import { runSaga } from "redux-saga";
import { api } from "../src/api/client";
import { actionTypes } from "../src/store/actions";
import { handleLogin } from "../src/store/sagas";

describe("handleLogin saga", () => {
  it("dispatches auth success for email/password login", async () => {
    const dispatched: unknown[] = [];
    const originalPost = api.post;
    api.post = async () => ({
      data: {
        token: "token-123",
        user: {
          id: "user-1",
          email: "user@example.com",
          name: "User",
        },
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
          email: "user@example.com",
          password: "password123",
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

    api.post = originalPost;
  });
});
