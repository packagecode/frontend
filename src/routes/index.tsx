import PrivateRoutes from "@/components/PrivateRoute/PrivateRoute";
import RequiredClientCheck from "@/components/RequiredClientCheck";
import CRM_DASHBOARD from "@/container/dashboards/crm/crm";
import { DMS_BASE_URL } from "@/main";
import App from "@/pages/App";
import Auth from "@/pages/auth";
import Login from "@/pages/auth/login";
import Roles from "@/pages/dashboard/authentication/roles/roles";
import UserAppInfo from "@/pages/dashboard/authentication/users/userAppInfo";
import Users from "@/pages/dashboard/authentication/users/users";
import DepartmentTypes from "@/pages/dashboard/customerMaster/channel/departmentTypes";
import Badges from "@/pages/dashboard/customerMaster/badge/badges";
import DepartmentCategories from "@/pages/dashboard/customerMaster/category/departmentCategories";
import DepartmentLocationTypes from "@/pages/dashboard/customerMaster/locationType/departmentLocationTypes";

import NotFound from "@/pages/error/error404";
import Home from "@/pages/welcome";
import { Navigate, Route, Routes } from "react-router-dom";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path={DMS_BASE_URL} element={<Home />} />
      <Route path={DMS_BASE_URL} element={<RequiredClientCheck />}>
        <Route path={DMS_BASE_URL} element={<Auth />}>
          <Route path={`${DMS_BASE_URL}login`} element={<Login />} />
        </Route>
        <Route path={DMS_BASE_URL} element={<PrivateRoutes />}>
          <Route path="" element={<App />}>
            <Route path="dashboards" element={<CRM_DASHBOARD />} />
            <Route path="users" element={<Users />} />
            <Route path="roles" element={<Roles />} />
            <Route path="users-app-info" element={<UserAppInfo />} />
            <Route path="department/channel" element={<DepartmentTypes />} />
            <Route path="department/badges" element={<Badges />} />
            <Route path="department/category" element={<DepartmentCategories />} />
            <Route path="department/location-type" element={<DepartmentLocationTypes />} />
          </Route>
        </Route>
      </Route>
      <Route path={`${DMS_BASE_URL}404`} element={<NotFound />} />
      <Route path="*" element={<Navigate to="404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
