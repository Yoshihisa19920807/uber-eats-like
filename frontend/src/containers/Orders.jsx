import React, { Fragment, useReducer, useEffect } from 'react';
import styled from 'styled-components';
// apis
import { fetchLineFoods } from '../apis/line_foods';
import { postOrder } from '../apis/orders';
// reducers
import { lineFoodsActionTypes, initialState, lineFoodsReducer } from '../reducers/lineFoods';
// components
import { OrderDetailItem } from '../components/OrderDetailItem';
import CircularProgress from '@mui/material/CircularProgress';
import { HeaderWrapper, MainLogoImage } from '../components/shared_style';
import { OrderButton } from '../components/Buttons/OrderButton';

// constants
import { REQUEST_STATE } from '../constants';

// images
import MainLogo from '../images/logo.png';

const OrderListWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const OrderItemWrapper = styled.div`
  margin-bottom: 50px;
  width: 400px;
`;

export const Orders = () => {
  const [state, dispatch] = useReducer(lineFoodsReducer, initialState);
  const postLineFoods = () => {
    dispatch({ type: lineFoodsActionTypes.POSTING });
    postOrder({
      line_food_ids: state.lineFoodsSummary.line_food_ids,
    })
    .then(() => {
      dispatch({ type: lineFoodsActionTypes.POST_SUCCESS});
      window.location.reload();
    })
  }
  const orderButtonLabel = () => {
    switch (state.postState) {
      case REQUEST_STATE.LOADING:
        return '注文中...';
      case REQUEST_STATE.OK:
        return '注文が完了しました！';
      default:
        return '注文を確定する';
    }
  };
  useEffect(() => {
    dispatch({ type: lineFoodsActionTypes.FETCHING });
    fetchLineFoods()
    // １行なら{}がなくても動く
    .then((data) => {
      dispatch({
        type: lineFoodsActionTypes.FETCH_SUCCESS,
        payload: {
          lineFoodsSummary: data
        }
      })
    })
    .catch((e) => console.error(e));
  }, []);
  return (
    <Fragment>
      <HeaderWrapper>
        <MainLogoImage src={MainLogo} alt= 'main logo'/>
      </HeaderWrapper>
      <OrderListWrapper>
        <div>
          <OrderItemWrapper>
            {
              state.fetchState === REQUEST_STATE.LOADING ?
                <CircularProgress />
              :
                // これで条件式になる
                state.lineFoodsSummary &&
                  <OrderDetailItem
                    restaurantId={state.lineFoodsSummary.restaurant.id}
                    restaurantName={state.lineFoodsSummary.restaurant.name}
                    restaurantFee={state.lineFoodsSummary.restaurant.fee}
                    timeRequired={state.lineFoodsSummary.restaurant.delivery_time}
                    foodCount={state.lineFoodsSummary.count}
                    price={state.lineFoodsSummary.amount}
                  />
            }
          </OrderItemWrapper>
          <div>
            {
              state.fetchState === REQUEST_STATE.OK && state.lineFoodsSummary &&
                <OrderButton
                  onClick={() => postLineFoods()}
                  disabled={state.postState === REQUEST_STATE.LOADING || state.postState === REQUEST_STATE.OK}
                >
                  {orderButtonLabel()}
                </OrderButton>
            }
            {
              state.fetchState === REQUEST_STATE.OK && !(state.lineFoodsSummary) &&
                <p>
                  注文予定の商品はありません。
                </p>
            }
          </div>
       </div>
      </OrderListWrapper>
    </Fragment>
  )
}