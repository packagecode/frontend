import { useSetupWizard } from "@/contexts/SetupWizardContext.tsx";
import { EncryptDataTypes } from "@/enums/EncryptDataTypes";
import useAxiosInstance from "@/hooks/useAxiosInstance";
import useGlobalServices from "@/hooks/useGlobalServices.tsx";
import useSettingsActions from "@/hooks/useSettingsActions";
import useSetupWizardAction from "@/hooks/useSetupWizardAction";
import Permission from "@/interface/Permission";
import User from "@/interface/User";
import { useCallback } from "react";
import useEncrypt, { decryptData } from "./useEncrypt";

interface LoginResponse {
  token: string;
  user: User;
}

const useAuthService = () => {
  const { getCsrfCookie } = useGlobalServices();
  const { updateSettings } = useSettingsActions();
  const { checkAccountCompleteness } = useSetupWizardAction();
  const { dispatch } = useSetupWizard();
  const { axiosInstance, api } = useAxiosInstance();
  const { encryptData } = useEncrypt();

  const login = useCallback(
    async (
      email: string,
      password: string,
      remember_me: boolean
    ): Promise<LoginResponse> => {
      try {
        await getCsrfCookie();
        const response = await axiosInstance.post(api("login"), {
          email,
          password,
          device_name: window.navigator.userAgent,
          remember_me
        });
        if (response.data.token) {
          localStorage.setItem("isLogin", JSON.stringify(true));
        }
        const responseME = await axiosInstance.get(api("me"));
        const settings = await axiosInstance.get(api("settings"));
        const responseAllPermissions = await axiosInstance.get(
          api("permissions")
        );
        const allPermissionLists = responseAllPermissions.data.permissions;
        const roles: any = responseME.data.me.roles;
        const rolePermission: any = [];
        if (roles) {
          roles.forEach((role: any) => {
            rolePermission.push(role.permissions);
          });
        }
        const permissions: Permission[] =
          roles.length > 0
            ? responseME.data.me.permissions.concat(rolePermission)
            : responseME.data.me.permissions;
        localStorage.setItem(
          EncryptDataTypes.USER_KEY,
          encryptData(JSON.stringify(responseME.data.me))
        );
        localStorage.setItem(
          EncryptDataTypes.USER_ROLES_KEY,
          encryptData(JSON.stringify(roles))
        );
        localStorage.setItem(
          EncryptDataTypes.USER_PERMISSION_KEY,
          encryptData(JSON.stringify(permissions))
        );
        localStorage.setItem(
          EncryptDataTypes.ALL_PERMISSIONS_KEY,
          encryptData(JSON.stringify(allPermissionLists))
        );
        checkAccountCompleteness(dispatch);
        updateSettings(settings.data.settings);
        return response.data;
      } catch (error: any) {
        throw error.response.data;
      }
    },
    [getCsrfCookie, updateSettings]
  );

  const logout = useCallback(async () => {
    try {
      const response = await axiosInstance.delete(api("logout"));
      localStorage.clear();
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }, []);

  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem("isLogin");
    const user = localStorage.getItem(EncryptDataTypes.USER_KEY);
    if (!token || !user) return false;

    const decryptedUser = decryptData(user);
    const authUser: User | null = decryptedUser
      ? JSON.parse(decryptedUser)
      : null;

    return !!authUser?.id;
  }, []);

  return {
    login,
    logout,
    isAuthenticated
  };
};

export default useAuthService;
