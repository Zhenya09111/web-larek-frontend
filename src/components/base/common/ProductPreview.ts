
import { CategoryKey, categoryMap, IProduct } from './../../../types/index';
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../base/events";
import { Product } from "./ProductItem";
import { Component } from '../base/Component';

export interface IPreview {
        id: string,
        image: string,
        category: string,
        title: string,
        price: number | null,
        description: string,
        checkDisabled?: boolean;
}

export class ProdcutPreview<IPreview>{
    protected productText: HTMLElement;
    protected producrtCategory: HTMLElement;
    protected productCardImage: HTMLImageElement;
    protected productTitle: HTMLElement;
    protected productPrice: HTMLElement;
    protected events: IEvents;
    protected _id: string;
    protected productButton: HTMLButtonElement;

    constructor(protected container: HTMLElement, events: IEvents) {
        this.container = container;
        this.events = events;

        this.producrtCategory = ensureElement('.card__category', this.container);
        this.productCardImage = ensureElement('.card__image', this.container) as HTMLImageElement;
        this.productTitle = ensureElement('.card__title', this.container);
        this.productPrice = ensureElement('.card__price', this.container);
        this.productText = ensureElement('.card__text', this.container);
        this.productButton = ensureElement('.card__button', this.container) as HTMLButtonElement;

         this.productButton.addEventListener('click', () => {
                    this.events.emit('product add basket', { current: this });
                })
    }
        get id() {
            return this._id
        }

        set id(id: string){
            this._id = id
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
        
        set checkDisabled(par: boolean){
            if(par === true){
                this.productButton.disabled = true
            }else{
                this.productButton.disabled = false
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

        set description (value: string) {
            this.productText.textContent = value;
        }

        render(data?: Partial<IPreview>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
    }
    

