import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'

class ShoppingLists extends Component {

  constructor(props){
    super(props);
    this.state = {
      lists: [],
      selectedColor: 'brown',
      list_name: '',
      modal: true,
      loader: false
    }
    this.handleListName = this.handleListName.bind(this);
  }

  componentDidMount() {
    this.loadLists();
  }

  // load lists from backend
  loadLists() {
    this.setState({ loader:true })
    fetch('http://localhost/api/getShoppingLists')
      .then(response => response.json())
      .then(lists => this.setState({ lists, loader:false }))
      .catch(error => console.error('Error:', error))
  }

  createShoppingList(){
    var data = "list_name="+this.state.list_name+"&list_color="+this.state.selectedColor;
    fetch('http://localhost/api/createShoppingList', {
      method: 'POST',
      credentials: 'same-origin',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data
    })
    .then(response => response.json())
    .catch(error => console.error('Error:', error))
    .then(response => {
      if(response.success){
        this.setState({ list_name: '' })
        this.loadLists()
      }else{
        alert(response.error)
      }
    });
  }

  handleListName(event) {
    this.setState({list_name: event.target.value});
  }

  deleteList(listid){
    fetch('http://localhost/api/deleteShoppingList/' + listid)
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => { this.loadLists() });
  }

  render() {
    const bgs = ['brown', 'steelblue', 'orange', 'yellowgreen', 'violet', 'turquoise', 'tomato', 'seagreen', 'cornflowerblue']
    const lists = this.state.lists.map(list => {
      return (
        <div key={list.list.list_id} className="row" style={{marginBottom:0}}>
          <div className="col s12 m6">
            <div className="card darken-1" style={{ backgroundColor: list.list.list_color }}>
              <div className="card-content white-text" style={{ paddingTop:10, paddingRight:10, paddingBottom: 0, paddingLeft:10 }}>
                <span className="card-title"><Link to={`/list/${list.list.list_id}`} className="white-text">{list.list.list_name}</Link></span>
              </div>
              <div className="card-action" style={{ paddingTop:0, paddingRight:10, paddingBottom: 10, paddingLeft:10 }}>
                <div className="left white-text">
                  <b>{list.paid}/{list.all} tétel</b> - {list.list.list_updated}<br/><span style={{fontSize:12, color:'#ededed'}}>Létrehozva: {list.list.list_created}</span>
                </div>
                <div className="right"><span style={{marginRight:10}} onClick={() => { if (window.confirm('Biztosan törlöd a ' + list.list.list_name + ' listát?')) this.deleteList(list.list.list_id) } }><i className="small material-icons white-text">delete</i></span></div>
                <div style={{clear:'both'}}></div>
              </div>
            </div>
          </div>
        </div>
      )
    })
    const renderBgs = bgs.map(color => {
      var borderColor = (this.state.selectedColor === color) ? "black" : null;
      return <span className="dot" key={color} id={color} style={{backgroundColor:[color], borderColor: borderColor, borderWidth: 2, borderStyle: 'solid' }} onClick={() => this.setState({ selectedColor: color })}></span>
    })
    return (
      <div>
        <Loader show={this.state.loader} />
        <h5 className="center-align">Bevásárlólisták</h5>
        {lists}
        <a href="#newListModal" className="floatBtn modal-trigger" ref="newListModal">
          <i className="small material-icons white-text floatBtnVal">add</i>
        </a>
        
        <div id="newListModal" className="modal">
          <div className="modal-content" style={{padding:10}}>
          <h5 className="center-align">Új lista</h5>

          <div className="row" style={{marginBottom:1}}>
            <div className="input-field">
              <input id="newListInput" type="text" onChange={this.handleListName} value={this.state.list_name}/>
              <label htmlFor="newListInput">Lista neve</label>
            </div>
          </div>

      <div className="row center-align" style={{marginBottom:1}}>
        {renderBgs}
      </div>
      
    </div>
    <div className="modal-footer" style={{textAlign:'center'}}>
      <a className="waves-effect waves-light btn-small" href="#!" onClick={ () => this.createShoppingList() }><i className="material-icons left">add</i>LÉTREHOZÁS</a>
    </div>
  </div>



      </div>
    )
  }
}
export default ShoppingLists;