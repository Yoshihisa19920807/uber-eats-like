import React, { Fragment, useEffect, useReducer } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Skeleton from '@material-ui/lab/Skeleton';

// components
import { LocalMallIcon, QueryBuilderIcon } from '../components/Icons/index'
import { FoodWrapper } from '../components/FoodWrapper';
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

// images
import FoodImage from '../images/food-image.jpg';
import MainLogo from '../images/logo.png';

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 32px;
`;

const BagIconWrapper = styled.div`
  padding-top: 24px;
`

const ColoredBagIcon = styled.div`
  color: ${COLORS.MAIN};
`

const MainLogoImage = styled.img`
  height: 90px;
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
  const [foodsState, dispatch] = useReducer(foodsReducer, foodsInitialState);
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
                    <Skeleton key={i} variant="rect" width={450} height={180} />
                  </ItemWrapper>
                )
              }
            </Fragment>
          :
            foodsState.foodsList.map(food =>
              <ItemWrapper key= {food.id}>
                <FoodWrapper
                  food={food}
                  onClickFoodWrapper={(food) => console.log(food)}
                  imageUrl={FoodImage}
                />
              </ItemWrapper>
            )
        }
      </FoodList>
    </Fragment>
  )
}
