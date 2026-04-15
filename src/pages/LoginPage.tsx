import { useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { authActions } from "../store/actions";
import type { RootState } from "../store/types";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function LoginPage() {
  const dispatch = useDispatch();
  const { error, status, token } = useSelector(
    (state: RootState) => state.auth,
  );
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  if (token) {
    return <Navigate to="/drive" replace />;
  }

  const isLoading = status === "loading";

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === "login") {
      dispatch(authActions.loginRequest({ email, password }));
      return;
    }

    dispatch(authActions.registerRequest({ email, password, name }));
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10 dark:bg-slate-950">
      <section className="w-full max-w-5xl rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-900 lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:gap-10 lg:p-10">
        <div className="space-y-6 border-b border-slate-200 pb-8 dark:border-slate-800 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-10">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              File Storage
            </p>
            <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">
              Collaborative image drive with folders, search, and permissions.
            </h1>
          </div>
        </div>

        <div className="pt-8 lg:pt-0">
          <div className="mb-6 flex rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              type="button"
              className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium ${
                mode === "login"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white"
                  : "text-slate-500"
              }`}
              onClick={() => setMode("login")}
            >
              Sign in
            </button>
            <button
              type="button"
              className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium ${
                mode === "register"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white"
                  : "text-slate-500"
              }`}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            {mode === "register" ? (
              <Input
                label="Full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            ) : null}
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            {error ? (
              <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
                {error}
              </p>
            ) : null}
            <div className="flex flex-col gap-3">
              <Button type="submit" fullWidth disabled={isLoading}>
                {isLoading
                  ? "Working..."
                  : mode === "login"
                    ? "Sign in"
                    : "Create account"}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
