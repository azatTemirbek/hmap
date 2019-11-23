import React from 'react';
import ReactDOM from 'react-dom';
import { StoreProvider, createStore  } from 'easy-peasy';
import * as serviceWorker from './serviceWorker';
import App from './App';
import storeModel from './models';

import './index.css';

const store = createStore(storeModel);

ReactDOM.render(
    <StoreProvider store={store}>
        <App />
    </StoreProvider>,
    document.getElementById('root'));

// unregister() to register()
serviceWorker.unregister();
