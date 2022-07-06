import { REQUEST_STATE } from "../constants";
import { foodsActionTypes } from "./foods";

export const initialState = {
  fetchState: REQUEST_STATE.INITIAL,
  postState: REQUEST_STATE.INITIAL,
  lineFoodsList: [],
}

export const lineFoodsActionTypes = {
  POSTING: 'POSTING',
  FETCHING: 'FETCHING',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
}

export const lineFoodsReducer = (state, action) => {
  switch(action.type) {
    case lineFoodsActionTypes.FETCHING:
      return {
        ...state,
        fetchState: REQUEST_STATE.LOADING,
      }
    case lineFoodsActionTypes.FETCH_SUCCESS:
      console.log(action.payload)
      return {
        fetchState: REQUEST_STATE.OK,
        lineFoodsList: action.payload.lineFoodsSummary
      }
    case lineFoodsActionTypes.POSTING:
      return {
        ...state,
        postState: REQUEST_STATE.LOADING,
      };
    case lineFoodsActionTypes.POST_SUCCESS:
      return {
        ...state,
        postState: REQUEST_STATE.OK,
      };
    default:
      throw new Error();
  }
}
