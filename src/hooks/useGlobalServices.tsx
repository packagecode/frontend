import { EncryptDataTypes } from "@/enums/EncryptDataTypes";
import useAxiosInstance from "@/hooks/useAxiosInstance";
import Permission from "@/interface/Permission";
import store from "@/redux/store";
import Cookies from "js-cookie";
import { useCallback } from "react";

const useGlobalServices = () => {
  const stores = store.getState();
  const { axiosInstance, api, csrf, landLordApi } = useAxiosInstance();
  const rootDomainCheck = useCallback(async () => {
    const subdomain = window.location.hostname.split(".")[0];
    return ["app", "www"].includes(subdomain);
  }, []);

  const getCsrfCookie = useCallback(
    async (landlord: boolean = false): Promise<string | undefined> => {
      let csrfToken = Cookies.get("XSRF-TOKEN");

      if (!csrfToken) {
        try {
          await csrf(landlord); // Fetch CSRF token
          csrfToken = Cookies.get("XSRF-TOKEN");
        } catch (error) {
          console.error("Error fetching CSRF token:", error);
        }
      }

      return csrfToken;
    },
    []
  );

  const validateClient = useCallback(async (domain: string | null = null) => {
    await getCsrfCookie();
    if (!domain) {
      domain = stores.domain;
    }
    const response = await axiosInstance.post(landLordApi("/validate-org"), {
      domain: domain
    });
    localStorage.setItem("orgLogoUrl", response.data?.org?.org_logo_url);
    return response.data;
  }, []);

  const hasRole = useCallback((role: string) => {
    let returnVal = false;
    const roles: string[] = stores.roles || [];
    roles.forEach((r: any) => {
      if (r.name === role) {
        returnVal = true;
      }
    });
    return returnVal;
  }, []);

  const hasPermission = useCallback(
    (permission: string | string[]): boolean => {
      const permissions: Permission[] = stores.permissions ?? [];

      if (typeof permission === "string") {
        return permissions.some(value => value.name === permission);
      }

      // Check if every permission in the array is included in the user's permissions
      if (Array.isArray(permission)) {
        return permission.every(perm =>
          permissions.some(value => value.name === perm)
        );
      }

      return false;
    },
    []
  );

  const blobToImage = useCallback((blob: Blob) => {
    return window.URL.createObjectURL(blob);
  }, []);

  const blob2Url = useCallback((url: string) => {
    return new Promise(resolve => {
      if (import.meta.env.NODE_ENV === "production") {
        resolve(url);
      } else {
        axiosInstance({
          url: api(url),
          method: "GET",
          responseType: "blob"
        }).then((response: any) => resolve(blobToImage(response.data)));
      }
    });
  }, []);

  const clearLocalStorageExceptAuth = () => {
    // Keys to keep
    const keysToKeep = [
      EncryptDataTypes.SETTINGS_KEY,
      EncryptDataTypes.ALL_PERMISSIONS_KEY,
      EncryptDataTypes.USER_PERMISSION_KEY,
      EncryptDataTypes.USER_ROLES_KEY,
      EncryptDataTypes.USER_KEY,
      "isLogin",
      "token"
    ];
    // Get all keys from localStorage
    const allKeys = Object.keys(localStorage);

    // Filter out keys that we want to keep
    const keysToRemove = allKeys.filter(key => !keysToKeep.includes(key));
    // Remove each key that is not in the keysToKeep array
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
  };

  const toQueryString = (obj: { [key: string]: any }): string => {
    return "?".concat(
      Object.keys(obj)
        .map(key =>
          obj[key] || obj[key] === 0
            ? `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
            : null
        )
        .filter(item => item !== null)
        .join("&")
    );
  };

  const getFileNameFromContentDisposition = (headers: any): string => {
    const regex = /filename=(.+)/g;
    const match = regex.exec(headers["content-disposition"]);
    return match ? match[1].replace(/"/g, "") : "file";
  };

  const downloadFile = (downloadUrl: string) => async (): Promise<boolean> => {
    try {
      const response = await axiosInstance.get(downloadUrl, {
        responseType: "arraybuffer"
      });

      const { data, headers } = response;
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = getFileNameFromContentDisposition(headers);
      link.click();

      // Clean up the object URL
      URL.revokeObjectURL(link.href);

      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    getCsrfCookie,
    validateClient,
    rootDomainCheck,
    hasRole,
    hasPermission,
    blobToImage,
    blob2Url,
    clearLocalStorageExceptAuth,
    toQueryString,
    getFileNameFromContentDisposition,
    downloadFile
  };
};

export default useGlobalServices;
