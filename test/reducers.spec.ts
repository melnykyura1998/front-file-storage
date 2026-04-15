import { strict as assert } from "node:assert";
import { describe, it } from "mocha";
import { authActions, driveActions } from "../src/store/actions";
import { rootReducer } from "../src/store/reducers";

describe("rootReducer", () => {
  it("stores successful authentication data", () => {
    const state = rootReducer(
      undefined,
      authActions.authSuccess({
        token: "token-123",
        user: {
          id: "user-1",
          email: "user@example.com",
          name: "User",
        },
      }),
    );

    assert.equal(state.auth.token, "token-123");
    assert.equal(state.auth.user?.email, "user@example.com");
    assert.equal(state.auth.status, "authenticated");
  });

  it("updates folder items after a successful load", () => {
    const state = rootReducer(
      undefined,
      driveActions.itemsSuccess({
        parent: null,
        breadcrumbs: [],
        folders: [
          {
            id: "folder-1",
            name: "Designs",
            parentId: null,
            position: 0,
            isPublic: false,
            ownerId: "user-1",
          },
        ],
        files: [],
      }),
    );

    assert.equal(state.drive.folders.length, 1);
    assert.equal(state.drive.folders[0]?.name, "Designs");
  });
});
