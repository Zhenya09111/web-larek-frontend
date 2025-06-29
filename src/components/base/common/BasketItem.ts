import { Basket } from './../Basket';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../base/events';
import { IProduct } from './../../../types/index';

export interface IBasketItem{
    index: number;
    title: string;
    price: number | null
    id: string
}

export class BasketItem<IBasketItem> {
    protected basketTitle: HTMLElement;
    protected basketPrice: HTMLElement;
    protected events: IEvents;
    protected basketIndex: HTMLElement;
    protected deleteItem: HTMLButtonElement;

    constructor(protected container: HTMLElement, events: IEvents) {
        this.container = container;
        this.events = events;

        this.basketTitle = ensureElement('.card__title', this.container);
        this.basketPrice = ensureElement('.card__price', this.container);
        this.basketIndex = ensureElement('.basket__item-index', this.container);
        this.deleteItem = ensureElement('.basket__item-delete', this.container) as HTMLButtonElement;

        this.deleteItem.addEventListener('click', () => {
            events.emit('delete:product', {item: this})
        })
    }

    set index(index: number){
        this.basketIndex.textContent = String(index + 1);
    }

    set title(title: string) {
        this.basketTitle.textContent = title;
    }

    set price(price: number | null) {
        if (typeof price === `number`) {
            this.basketPrice.textContent = `${price} синапсов`;
        } else if (price === null) {
            this.basketPrice.textContent = `Бесценно`
        }
    }

    render(data?: Partial<IBasketItem>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}