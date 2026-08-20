import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import TestForm from "../pages/TestForm/TestForm";
import Questions from "../pages/Questions/Questions";
import Preview from "../pages/Preview/Preview";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { Outlet } from "react-router-dom";

const AppLayout = () => (
  <>
    <Header />
    <Sidebar />
    <div className="app-content"><Outlet /></div>
  </>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tests/create" element={<TestForm />} />
          <Route path="/tests/:id/edit" element={<TestForm />} />
          <Route path="/tests/:id/questions" element={<Questions />} />
          <Route path="/tests/:id/preview" element={<Preview />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;