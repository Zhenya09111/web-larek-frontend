import { IProduct } from "../../../types";
import { IEvents } from "../base/events";
import { IOrder } from "./AddressForm";

export type FormErrors = Partial<Record<keyof IOrder, string>>;

interface IProductData {
    products: IProduct[];
    basket: IProduct[];
}

export class ProductData {
    protected _products: IProduct[];
    protected events: IEvents;
    protected _basket: IProduct[] = [];
    order: IOrder = {
        email: '',
        phone: '',
        payment: null,
        address: '',
        items: [],
        total: ''
    };
    formErrors: FormErrors = {};

    constructor(events: IEvents) {
        this.events = events;
    }

    addItemBasket(par: IProduct): void {
        if (this.basket.some(item => item.id === par.id)) {
        } else {
            this._basket = [par, ...this._basket]
        }
    }

    get totalAmount() {
        return (this.basket.reduce((acc, curr) => acc + curr.price || 0, 0))
    }

    deleteItemBasket(itemId: string) {
        this._basket = this._basket.filter(item => item.id !== itemId)
    }

    set products(products: IProduct[]) {
        this._products = products;
    }

    getProduct(productId: string) {
        return this._products.find((item) => item.id === productId)
    }

    get _order() {
        return this.order
    }

    get basket() {
        return this._basket
    }

    get products() {
        return this._products
    }

    selected(item: string): boolean {
        const test = this.basket.some(i => i.id === item)
        return test
    }

    setOrderField(field: keyof IOrder, value: string): void {
        this.order[field] = value;
    }

    validateOrderAddress(): boolean {
        const errors: typeof this.formErrors = {};
        if (this.order.payment === null) {
            errors.payment = 'Необходимо указать способ оплаты'
        }
        if (this.order.address.length < 5) {
            errors.address = 'Необходимо указать адресс'
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    validOrderContacts(): boolean {
        const errors: typeof this.formErrors = {};
        if (this.order.email.length < 5) {
            errors.email = 'Необходимо указать email';
        }
        if (this.order.phone.length < 5) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    payment(value: string): void {
        this.order.payment = value;
    }

    setPriceOrder(): void {
        this.order.total = this.totalAmount
    }

    setItemOrder(value: IProduct[]): void {
        this.order.items = value.map(item => item.id)
    }

    indexBasket(id: string){
       return this._basket.findIndex(user => user.id === id) 
    // return 10
    }


    orderReset(): void {
            this.order = {
                email: '',
                phone: '',
                payment: null,
                address: '',
                items: [],
                total: ''
            }
        this._basket = [];
    }
}