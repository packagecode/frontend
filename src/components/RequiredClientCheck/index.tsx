import { showToast } from "@/contexts/Toast";
import useGlobalServices from "@/hooks/useGlobalServices";
import store from "@/redux/store";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

interface CheckRouteProps {}

const RequiredClientCheck: React.FC<CheckRouteProps> = () => {
  const [isChecked, setIsChecked] = useState(false);
  const { validateClient } = useGlobalServices();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stores = store.getState();
        await validateClient(stores.domain);
        setIsChecked(true);
      } catch {
        showToast("error", "Client not found!");
        navigate("/404", { replace: true });
      }
    };

    fetchData();
  }, []);

  if (!isChecked) {
    return null;
  }

  return <Outlet />;
};

export default RequiredClientCheck;
