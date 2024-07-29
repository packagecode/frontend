import TaxonomyJson from "@/assets/json/Taxonomy.json";
import { EncryptDataTypes } from "@/enums/EncryptDataTypes";
import { encryptData, storageToDecrypt } from "@/hooks/useEncrypt";
import React, { ReactNode, createContext, useContext, useReducer } from "react";

interface SettingsState {
  currency: string;
  taxonomy: any;
  settings: any;
}
const settings = storageToDecrypt(EncryptDataTypes.SETTINGS_KEY);

const initialState: SettingsState = {
  currency: settings ? settings?.currency : "BDT",
  taxonomy: settings ? settings?.taxonomy : TaxonomyJson,
  settings: settings ? settings : {}
};

type Action =
  | { type: "SET_CURRENCY"; payload: string }
  | { type: "SET_SETTINGS"; payload: any }
  | { type: "SET_TAXONOMY"; payload: any };

const reducer = (state: SettingsState, action: Action): SettingsState => {
  switch (action.type) {
    case "SET_CURRENCY":
      return { ...state, currency: action.payload };
    case "SET_SETTINGS":
      return { ...state, settings: action.payload };
    case "SET_TAXONOMY":
      return { ...state, taxonomy: action.payload };
    default:
      return state;
  }
};

const SettingsContext = createContext<
  | {
      state: SettingsState;
      dispatch: React.Dispatch<Action>;
      actions: {
        updateCurrency: (payload: string) => void;
        updateSettings: (payload: any) => void;
        updateTaxonomy: (payload: any) => void;
      };
    }
  | undefined
>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = {
    updateCurrency: (payload: string) => {
      dispatch({ type: "SET_CURRENCY", payload });
    },
    updateSettings: (payload: any) => {
      dispatch({ type: "SET_SETTINGS", payload });
      localStorage.setItem(
        EncryptDataTypes.SETTINGS_KEY,
        encryptData(JSON.stringify(payload))
      );
    },
    updateTaxonomy: (payload: any) => {
      dispatch({ type: "SET_TAXONOMY", payload });
    }
  };

  return (
    <SettingsContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
