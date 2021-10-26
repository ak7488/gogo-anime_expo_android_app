
import React from 'react';
import Navigator from './src/Navigation';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Reducer from './src/store/reducer';

const store = createStore(Reducer);

export default function App() {
  return (
    <Provider store={store}>
      <Navigator />
    </Provider>
  );
}