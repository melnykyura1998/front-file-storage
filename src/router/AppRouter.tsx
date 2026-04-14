import { Route, Routes } from "react-router-dom";
import { DrivePage } from "../pages/DrivePage";
import { LoginPage } from "../pages/LoginPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/drive" element={<DrivePage />} />
    </Routes>
  );
}
