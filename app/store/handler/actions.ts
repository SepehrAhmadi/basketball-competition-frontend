import type { useHandlerState } from "./state";

type StateType = ReturnType<typeof useHandlerState>;

export function useHandlerActions(state: StateType) {
  const setSuccess = (message: string) => {
    state.checkAlert.value = 1;
    state.successMessage.value = message;
    state.errorMessage.value = null;
    state.warningMessage.value = null;
    state.infoMessage.value = null;
  };

  const setError = (message: string) => {
    state.checkAlert.value = 2;
    state.errorMessage.value = message;
    state.successMessage.value = null;
    state.warningMessage.value = null;
    state.infoMessage.value = null;
  };

  const setWarning = (message: string) => {
    state.checkAlert.value = 3;
    state.warningMessage.value = message;
    state.successMessage.value = null;
    state.errorMessage.value = null;
    state.infoMessage.value = null;
  };

  const setInfo = (message: string) => {
    state.checkAlert.value = 4;
    state.infoMessage.value = message;
    state.successMessage.value = null;
    state.errorMessage.value = null;
    state.warningMessage.value = null;
  };

  const clearMessages = () => {
    state.checkAlert.value = 0;
    state.successMessage.value = null;
    state.errorMessage.value = null;
    state.warningMessage.value = null;
    state.infoMessage.value = null;
  };

  const setUnauthorized = () => {
    state.unauthorized.value = true;
  };

  const setForbidden = () => {
    state.forbidden.value = true;
  };

  const setRedirect = (path: string) => {
    state.redirectTo.value = path;
  };

  const clearFlags = () => {
    state.unauthorized.value = false;
    state.forbidden.value = false;
  };

  return {
    setSuccess,
    setError,
    clearMessages,
    setUnauthorized,
    setForbidden,
    setRedirect,
    clearFlags,
    setWarning,
    setInfo,
  };
}
