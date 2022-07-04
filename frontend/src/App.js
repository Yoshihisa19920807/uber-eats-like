import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router, Route, Switch,

} from 'react-router-dom';

// components
import { Restaurants } from './containers/Restaurants.jsx';
import { Foods } from './containers/Foods.jsx';
import { Orders } from './containers/Orders.jsx'


function App() {
  return (
    <Router>
      <Switch>
        {/* 店舗一覧 */}
        <Route
          exact
          path= '/restaurants'
        >
          <Restaurants />
        </Route>
        {/* フード一覧 */}
        {/* <Route
          exact
          path= '/foods'
        >
          <Foods />
        </Route> */}
        {/* オーダー一覧 */}
        <Route
          exact
          path= '/orders'
        >
          <Orders />
        </Route>

        <Route
          exact
          path='/restaurants/:restaurantId/foods'
          render={({ match }) =>
            <Foods
              match={match}
            />
          }
        />
      </Switch>
    </Router>
  );
}

export default App;
