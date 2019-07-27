import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom'

import ShoppingLists from './pages/ShoppingLists'
import ShoppingList from './pages/ShoppingList'
import NavBar from './components/Navbar/Navbar'

import './App.css';

class App extends Component {
  render(){
    return (
      <BrowserRouter>
        <NavBar />
        <main>
          <Route path="/" component={ShoppingLists} exact/>
          <Route path="/list/:listid" component={ShoppingList}/>
        </main>
      </BrowserRouter>
    );
  }
}

export default App;
