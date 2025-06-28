import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IBasket {
    catalog: HTMLElement[];
    totalAmount: number;
}

export class Basket extends Component<IBasket> {
    protected basketList: HTMLElement;
    protected _catalog: HTMLElement;
    protected basketPrice: HTMLElement;
    protected deleteItem: HTMLButtonElement;
    protected registerOrderButton: HTMLButtonElement;
    protected events: IEvents;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container)

        this.basketList = ensureElement('.basket__list', this.container);
        this.basketPrice = ensureElement('.basket__price', this.container);
        this.registerOrderButton = ensureElement('.basket__button', this.container) as HTMLButtonElement;

        this.registerOrderButton.addEventListener('click', () => {
            events.emit('address:open')
        })
    }
    
    set catalog(items: HTMLElement[]) {
        this.basketList.replaceChildren(...items)
    }

    set totalAmount(value: number){
        this.basketPrice.textContent = String(value)
    }
}