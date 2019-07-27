import React, { Component } from 'react'
import Loader from '../components/Loader'

class ShoppingList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            listinfo: [],
            list: [],
            item: '',
            loader: false,
            priceModal: false,
            priceItem: '',
            priceActualPrice: 0,
            priceId: 0
        }
        this.handleItem = this.handleItem.bind(this);
        this.handlePrice = this.handlePrice.bind(this);
        this.resetPriceInput = this.resetPriceInput.bind(this);
    }

    componentDidMount() {
        this.loadItems();
    }


    handleItem(event) {
        this.setState({ item: event.target.value });
    }

    // load items from backend
    loadItems() {
        this.setState({ loader: true })
        const listid = this.props.match.params.listid
        fetch('http://localhost/api/getShoppingList/' + listid)
            .then(response => response.json())
            .then(data => this.setState({ data }, () => {
                this.setState({ listinfo: this.state.data.listinfo, list: this.state.data.list, loader:false })
            }))
    }

    deleteItem(itemid){
        fetch('http://localhost/api/deleteShoppingListItem/' + itemid)
            .then(response => response.json())
            .catch(error => console.error('Error:', error))
            .then(response => { this.loadItems() });
    }

    addItem(){
        const listid = this.props.match.params.listid
        if(this.state.item.length > 0){
            var data = "item="+this.state.item;
            fetch('http://localhost/api/addShoppingListItem/' + listid  , {
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
                    this.setState({ item: '' })
                    this.loadItems()
                }else{
                    alert(response.error)
                }
            });
        }
    }

    resetPriceModal(){
        this.setState({ priceModal: false, priceItem: '', priceActualPrice: 0, priceId: 0 })
    }

    handlePrice(event){
        this.setState({ priceActualPrice: event.target.value });
    }

    resetPriceInput(event){
        if(event.target.value == 0){
            this.setState({ priceActualPrice: '' })
        }
    }

    savePrice(){
        var data = "price="+this.state.priceActualPrice;
        fetch('http://localhost/api/editShoppingListItem/' + this.state.priceId  , {
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
                this.resetPriceModal()
                this.loadItems()
            }else{
                alert(response.error)
            }
        });
    }
    

    render() {
        const items = (this.state.list === undefined) ? "No item" : this.state.list.map(item => {
            return (
                <div key={item.id}>
                    <div className="row" style={{ marginBottom: 0, marginTop: 4, borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: '#ededed', paddingTop: 0, fontSize: 15 }}>
                        <div className="col s1">
                            <i className="material-icons red-text" style={{ fontSize: 22 }} onClick={() => { if (window.confirm('Biztosan törlöd a ' + item.item + ' elemet a listából?')) this.deleteItem(item.id) } }>delete</i>
                        </div>
                        <div className="col s7" style={{ paddingTop: 1 }}>
                            <span style={ (item.price > 0) ? {color: 'gray', textDecoration: 'line-through'} : {} }>{item.item}</span>
                        </div>
                        <div className="col s4" style={{ textAlign: 'right' }}>
                            <span style={ (item.price > 0) ? {color: 'gray', textDecoration: 'line-through'} : {} } onClick={() => this.setState({ priceModal: true, priceItem: item.item, priceActualPrice: item.price, priceId: item.id })}>{item.price} Ft</span>
                        </div>
                    </div>
                </div>
            )
        })
        return (
            <div>
                <Loader show={this.state.loader} />

                <div style={ (this.state.priceModal) ? {display: 'block'} : {display: 'none'} }>
                    <div className="priceModalHolder">
                        <h2>{this.state.priceItem} ára</h2>
                        <input type="number" value={this.state.priceActualPrice} onChange={this.handlePrice} onFocus={this.resetPriceInput} style={{ maxWidth:'40%' }} className="price" />
                        <br />
                        <br />
                        <a className="waves-effect waves-light btn-small" href="#!" onClick={ () => this.savePrice() }><i className="material-icons left">save</i>MENTÉS</a>
                        &nbsp;
                        <a className="waves-effect waves-light grey darken-1 btn-small" href="#!" onClick={ () => this.resetPriceModal() }><i className="material-icons left">close</i>MÉGSEM</a>
                    </div>
                </div>

                <h5 style={{ textAlign: 'center' }}>{this.state.listinfo.list_name} <span style={{ fontSize: 14 }}>(0 Ft)</span></h5>
                {items}
                <div className="footer center-align">
                    <input type="text" placeholder="Új tétel" onChange={this.handleItem} style={{ maxWidth:'80%' }} value={ this.state.item } />
                    <span className="waves-effect waves-light btn-small" href="#!" onClick={() => this.addItem()}><i className="material-icons">add</i></span>
                </div>
            </div>
        )
    }
}
export default ShoppingList;