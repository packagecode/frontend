import { useSettings } from "../contexts/SettingsContext";

const useSettingsActions = () => {
  const { state, actions } = useSettings();

  const updateCurrency = (currency: string) => {
    actions.updateCurrency(currency);
  };

  const updateSettings = (settings: any) => {
    actions.updateSettings(settings);
  };

  const updateTaxonomy = (taxonomy: any) => {
    actions.updateTaxonomy(taxonomy);
  };

  const getTaxonomyStore = () => {
    return state.taxonomy;
  };

  return {
    updateCurrency,
    updateSettings,
    updateTaxonomy,
    getTaxonomyStore
  };
};

export default useSettingsActions;
