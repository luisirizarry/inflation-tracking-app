import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import Categories from "../pages/categories/CategoryList";
import CategoryDetail from "../pages/categories/CategoryDetail";
import ItemDetail from "../pages/items/ItemDetail";
import LoginForm from "../pages/authentication/LoginForm";
import SignupForm from "../pages/authentication/SignupForm";
import UserPreferences from "../pages/user/UserPreferences";
import Notifications from "../pages/notifications/Notifications";
import PrivateRoute from "./PrivateRoute";

function AppRoutes({ login, signup }) {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<LoginForm login={login} />} />
      <Route path="/signup" element={<SignupForm signup={signup} />} />

      {/* Private Routes: Only accessible if logged in */}
      <Route element={<PrivateRoute />}>
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:id" element={<CategoryDetail />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/preferences" element={<UserPreferences />} />
        {/* <Route path="/notifications" element={<Notifications />} /> */}
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;