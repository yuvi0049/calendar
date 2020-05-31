import React, { Component, Fragment } from 'react';
import { Provider } from 'react-redux';

import Header from './components/Header';
import CalendarDesign from './components/Calendar';

import configureStore from './store';
const store = configureStore();

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Fragment>
                    <Header />
                    <CalendarDesign />
                </Fragment>
            </Provider>
        );
    }
}

export default App;
