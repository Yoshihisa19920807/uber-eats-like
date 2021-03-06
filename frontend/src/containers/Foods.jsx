import React, { Fragment, useEffect, useReducer, useState } from 'react';
import styled from 'styled-components';
import { useHistory, Link } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
// components
import { LocalMallIcon, QueryBuilderIcon } from '../components/Icons/index'
import { FoodWrapper } from '../components/FoodWrapper';
import { FoodOrderDialog } from '../components/FoodOrderDialog';
import { NewOrderConfirmDialog } from '../components/NewOrderConfirmDialog';
import { HeaderWrapper, MainLogoImage } from '../components/shared_style';
// apis
import { postLineFoods, replaceLineFoods } from '../apis/line_foods';
// reducers
import {
  initialState as foodsInitialState,
  foodsActionTypes,
  foodsReducer,
} from '../reducers/foods';
// apis
import { fetchFoods } from '../apis/foods';
// constants
import { REQUEST_STATE } from '../constants';
import { COLORS } from '../style_constants';
import { HTTP_STATUS_CODE } from '../constants';

// images
import FoodImage from '../images/food-image.jpg';
import MainLogo from '../images/logo.png';

const BagIconWrapper = styled.div`
  padding-top: 24px;
`

const ColoredBagIcon = styled.div`
  color: ${COLORS.MAIN};
`

const FoodList = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 50px;
`

const ItemWrapper = styled.div`
  margin: 16px;
`

export const Foods = ({
  match
}) => {
  const history = useHistory();
  const [foodsState, dispatch] = useReducer(foodsReducer, foodsInitialState);
  const initialState = {
    isOpenOrderDialog: false,
    selectedFood: null,
    selectedFoodCount: 1,
    isOpenNewOrderDialog: false,
    existingResutaurautName: '',
    newResutaurautName: '',
  }
  const [state, setState] = useState(initialState)
  const submitOrder = () => {
    console.log('登録ボタンが押された')
    postLineFoods({
      foodId: state.selectedFood.id,
      count: state.selectedFoodCount,
    }).then(() => history.push('/orders'))
      .catch((e) => {
        if (e.response.status === HTTP_STATUS_CODE.NOT_ACCEPTABLE) {
          setState({
            ...state,
            isOpenOrderDialog: false,
            isOpenNewOrderDialog: true,
            existingResutaurautName: e.response.data.existing_restaurant,
            newResutaurautName: e.response.data.new_restaurant,
          })
        } else {
          console.log(e)
          throw e;
        }
      })
  }
  const replaceOrder = () => {
    replaceLineFoods({
      foodId: state.selectedFood.id,
      count: state.selectedFoodCount,
    }).then(() => history.push('/orders'))
  };
  useEffect(() => {
    dispatch({ type: foodsActionTypes.FETCHING });
    fetchFoods(match.params.restaurantId)
      .then((data) => {
        dispatch({
          type: foodsActionTypes.FETCH_SUCCESS,
          payload: {
            foods: data.foods
          }
        });
      });
  }, [])

  return (
    <Fragment>
      <HeaderWrapper>
        <Link to="/restaurants">
          <MainLogoImage src={MainLogo} alt= 'main logo' />
        </Link>
        <BagIconWrapper>
          <Link to='/orders'>
            <ColoredBagIcon fontSize='large'>
              <LocalMallIcon/>
            </ColoredBagIcon>
          </Link>
        </BagIconWrapper>
      </HeaderWrapper>
      <FoodList>
        {
          foodsState.fetchState === REQUEST_STATE.LOADING ?
            <Fragment>
              {
                [...Array(12).keys()].map(i =>
                  <ItemWrapper key={i}>
                    <Skeleton key={i} variant="rectangular" width={450} height={180} />
                  </ItemWrapper>
                )
              }
            </Fragment>
          :
            foodsState.foodsList.map(food =>
              <ItemWrapper key= {food.id}>
                <FoodWrapper
                  food={food}
                  onClickFoodWrapper={
                    (food) => setState({
                      ...state,
                      isOpenOrderDialog: true,
                      selectedFood: food,
                    })
                  }
                  imageUrl={FoodImage}
                />
              </ItemWrapper>
            )
        }
      </FoodList>
      {
        state.isOpenOrderDialog &&
          <FoodOrderDialog
            food={state.selectedFood}
            isOpen={state.isOpenOrderDialog}
            onClose={() => setState({
              ...state,
              isOpenOrderDialog: false,
              selectedFood: null,
              selectedFoodCount: 1
            })}
            countNumber={state.selectedFoodCount}
            onClickCountUp={() => setState({
              ...state,
              selectedFoodCount: state.selectedFoodCount + 1,
            })}
            onClickCountDown={() => setState({
              ...state,
              selectedFoodCount: state.selectedFoodCount - 1,
            })}
            onClickOrder={() => submitOrder()}
          />
      }
      {
        state.isOpenNewOrderDialog &&
        <NewOrderConfirmDialog
          isOpen={state.isOpenNewOrderDialog}
          onClose={() => setState({ ...state, isOpenNewOrderDialog: false })}
          existingResutaurautName={state.existingResutaurautName}
          newResutaurautName={state.newResutaurautName}
          onClickSubmit={() => replaceOrder()}
        />
      }
    </Fragment>
  );
}
