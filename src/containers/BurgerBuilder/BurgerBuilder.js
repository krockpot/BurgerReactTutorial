import React, {Component} from 'react';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner';
import WithErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: .5,
    cheese: .4,
    meat: 1.3,
    bacon: .7,
}

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false,
    }

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients).map(
            igKey => {
                return ingredients[igKey]
        }).reduce(
            (sum, el) => sum+el, 0
        );
        this.setState({purchasable: sum > 0})
    }

    addIngredientHandler = type => {
        const oldCount = this.state.ingredients[type];
        const updatedIngredients = {...this.state.ingredients};
        updatedIngredients[type] = oldCount+1;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition
        this.setState({ingredients: updatedIngredients, totalPrice: newPrice});
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = type => {
        const oldCount = this.state.ingredients[type];
        const updatedIngredients = {...this.state.ingredients};
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        if (updatedIngredients[type] <= 0) {
            return
        }
        updatedIngredients[type] = oldCount-1;
        const newPrice = oldPrice - priceAddition;
        this.setState({ingredients: updatedIngredients, totalPrice: newPrice});
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        this.setState({loading: true});
        // alert('You continued!');
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Jeremy',
                address: {
                    street: 'Example Street',
                    zipCode: '12345',
                    country: 'Real Country'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fast',
        }
        axios.post('/orders.json', order)
            .then( resp => {
                this.setState({loading: false, purchasing: false})
            })
            .catch(err => {
                this.setState({loading: false, purchasing: false})
            });
    }

    componentDidMount() {
        axios.get('/ingredients.json').then(response => {
            this.setState({ingredients: response.data});
        }).catch(err => this.setState({error: true}));
    }

    render() {
        const disabledInfo = {...this.state.ingredients};
        for (let item in disabledInfo) {
            disabledInfo[item] = disabledInfo[item] <= 0
        }

        let orderSummary = null;
        if (this.state.loading) {
            orderSummary = <Spinner />;
        }

        let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner/>;
        if (this.state.ingredients) {
            burger = (<React.Fragment>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    price={this.state.totalPrice}
                    purchasable={this.state.purchasable}
                    ordered={this.purchaseHandler}
                />
            </React.Fragment>);
            orderSummary = <OrderSummary
                ingredients={this.state.ingredients}
                price={this.state.totalPrice}
                purchaseCancel={this.purchaseCancelHandler}
                purchaseContinue={this.purchaseContinueHandler} />
        }
        

        return (
            <React.Fragment>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </React.Fragment>
        );
    }
}

export default WithErrorHandler(BurgerBuilder, axios);