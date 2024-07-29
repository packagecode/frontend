import {
  ADD_TO_CART,
  PRODUCT,
  SET_SUBDOMAIN,
  THEME_CHANGER
} from "./actionType.tsx";

export const ThemeChanger = (value: any) => async (dispatch: any) => {
  dispatch({
    type: THEME_CHANGER,
    payload: value
  });
};

export const AddToCart =
  (id: any) =>
  async (dispatch: (arg0: { type: string; payload: any }) => void) => {
    dispatch({
      type: ADD_TO_CART,
      payload: id
    });
  };
export const ProductReduxData =
  (id: any) =>
  async (dispatch: (arg0: { type: string; payload: any }) => void) => {
    dispatch({
      type: PRODUCT,
      payload: id
    });
  };

export const SetSubdomain =
  (value: any) =>
  async (dispatch: (arg0: { type: string; payload: any }) => void) => {
    dispatch({
      type: SET_SUBDOMAIN,
      payload: value
    });
  };
