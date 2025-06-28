import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { CategoryKey, categoryMap, IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";

export class Product extends Component<IProduct> {
    protected events: IEvents;
    protected productCardImage: HTMLImageElement;
    protected producrtCategory: HTMLElement;
    protected productTitle: HTMLElement;
    protected productPrice: HTMLElement;
    protected id: string;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container)
        this.events = events;

        this.producrtCategory = ensureElement('.card__category', this.container);
        this.productCardImage = ensureElement('.card__image', this.container) as HTMLImageElement;
        this.productTitle = ensureElement('.card__title', this.container);
        this.productPrice = ensureElement('.card__price', this.container);

        this.container.addEventListener('click', () =>
            this.events.emit('product:select', { current: this })
        );
    }

    get _id() {
        return this.id
    }

    set _id(id:string){
        this.id = id;
    }
    
    set image(image: string) {
        this.productCardImage.src = image;
    }

    set category(value: string) {
        this.producrtCategory.textContent = value;

        for (const key in categoryMap) {
            this.producrtCategory.classList.toggle(
                categoryMap[key as CategoryKey],
                key === value
            );
        }
    }

    set title(title: string) {
        this.productTitle.textContent = title;
    }

    set price(price: number | null) {
        if (typeof price === `number`) {
            this.productPrice.textContent = `${price} синапсов`;
        } else if (price === null) {
            this.productPrice.textContent = `Бесценно`
        }
    }
}




