import { IProduct } from './../../../types/index';
import { ensureElement } from "../../../utils/utils";
import { Component } from "./Component";
import { IEvents } from "./events";

interface IModalData {
    content: HTMLElement
}

export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);


        this._closeButton.addEventListener("click", this.close.bind(this));
        this.container.addEventListener("mousedown", (evt) => {
            if (evt.target === evt.currentTarget) {
                this.close();
            }
        });
        this.handleEscUp = this.handleEscUp.bind(this);
    }

    handleEscUp(evt: KeyboardEvent) {
        if (evt.key === "Escape") {
            this.close();
        }
    };

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
        document.addEventListener("keyup", this.handleEscUp);
    }

    close() {
        this.container.classList.remove('modal_active');
        this.content = null;
        this.events.emit('modal:close');
        document.removeEventListener("keyup", this.handleEscUp);
    }

    render(data: IModalData): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}
