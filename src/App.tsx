import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./router/AppRouter";
import { authActions } from "./store/actions";
import type { RootState } from "./store/types";

function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    document.title = "File Storage MVP";
  }, []);

  useEffect(() => {
    if (token && !user) {
      dispatch(authActions.fetchMeRequest());
    }
  }, [dispatch, token, user]);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
