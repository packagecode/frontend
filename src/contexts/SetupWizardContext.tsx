import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { SetupWizardSteps } from '../enums/SetupWizardSteps';
import { SetupWizardStatus } from '../enums/SetupWizardStatus';

interface SetupWizardState {
  currentStatus: string;
  currentStep: string;
}

const initialState: SetupWizardState = {
  currentStatus: localStorage.getItem('currentStatus') || SetupWizardStatus.Incompleted,
  currentStep: localStorage.getItem('currentStep') || SetupWizardSteps.TerritoryStructure.toString()
};

type Action =
  | { type: 'SET_STEP'; payload: string }
  | { type: 'WIZARD_STATUS'; payload: { status: SetupWizardStatus; step: SetupWizardSteps } }
  | { type: 'NEXT_STEP' }
  | { type: 'ERROR_STEP' }
  | { type: 'PREVIOUS_STEP' };

const SetupWizardReducer = (state: SetupWizardState, action: Action): SetupWizardState => {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'WIZARD_STATUS':
      localStorage.setItem('currentStatus', action.payload.status);
      localStorage.setItem('currentStep', action.payload.step.toString());
      return { ...state, currentStatus: action.payload.status, currentStep: action.payload.step.toString() };
    case 'NEXT_STEP': {
      let currentStepIntValue = Number(state.currentStep);
      if (currentStepIntValue < Object.keys(SetupWizardSteps).length / 2 - 1) {
        currentStepIntValue++;
        localStorage.setItem('currentStep', currentStepIntValue.toString());
        return { ...state, currentStep: currentStepIntValue.toString() };
      } else {
        localStorage.setItem('currentStatus', SetupWizardStatus.Completed);
        localStorage.setItem('currentStep', SetupWizardSteps.Welcome.toString());
        window.location.reload();
        return { currentStatus: SetupWizardStatus.Completed, currentStep: SetupWizardSteps.Welcome.toString() };
      }
    }
    case 'ERROR_STEP':
      localStorage.setItem('currentStatus', SetupWizardStatus.Incompleted);
      localStorage.setItem('currentStep', SetupWizardSteps.Welcome.toString());
      return { currentStatus: SetupWizardStatus.Incompleted, currentStep: SetupWizardSteps.Welcome.toString() };
    case 'PREVIOUS_STEP': {
      let currentStepIntValue = Number(state.currentStep);
      if (currentStepIntValue <= Object.keys(SetupWizardSteps).length / 2 - 1) {
        currentStepIntValue--;
        localStorage.setItem('currentStep', currentStepIntValue.toString());
        return { ...state, currentStep: currentStepIntValue.toString() };
      }
      return state;
    }
    default:
      return state;
  }
};

const SetupWizardContext = createContext<{
  state: SetupWizardState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export const useSetupWizard = () => useContext(SetupWizardContext);

export const SetupWizardProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(SetupWizardReducer, initialState);

  useEffect(() => {
    localStorage.setItem('currentStatus', state.currentStatus);
    localStorage.setItem('currentStep', state.currentStep);
  }, [state]);

  return (
    <SetupWizardContext.Provider value={{ state, dispatch }}>
      {children}
    </SetupWizardContext.Provider>
  );
};
