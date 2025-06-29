import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { Modal } from "../base/Modal";

export interface IOrder{
    payment: string | null;
    address: string;
    email: string;
    phone: string;
    items: string[] | string; 
    total: number | string;
}

export interface IAddressForm {
    // checkButton: boolean;
    inputValues: Record<string, string>;
}

export class AddressForm extends Component<IAddressForm> {
    protected inputs?: NodeListOf<HTMLInputElement>;
    protected input: HTMLInputElement;
    protected formName: string;
    protected submitButton: HTMLButtonElement;
    protected events: IEvents;
    protected btns: NodeListOf<HTMLButtonElement>;
    


    constructor(protected container: HTMLElement, events: IEvents) {
        super(container)
        this.events = events;

        this.btns = this.container.querySelectorAll('.button_alt');
        this.input = this.container.querySelector('.form__input');
        this.formName = this.container.getAttribute('name');
        this.submitButton = this.container.querySelector('.order__button');


        this.btns.forEach(btn => {
            btn.addEventListener('click', (e: Event) => {
                const target = e.target as HTMLButtonElement;
                const field = target.name;
                this.buttonValue(field);
            })
        })


        this.input.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof IOrder;
            const value = target.value;
            this.onInputChange(field, value);
        });
        

        this.submitButton.addEventListener('click', () => {
            events.emit('сontact:open')
        })
    }

    set inputValues(data: Record<string, string>) {
        this.input.value = data[this.input.name]
    }

    protected buttonValue(field: string) {
        this.events.emit(`payment.${String(field)}:change`, {
            field
        })
    }

    protected onInputChange(field: keyof IOrder, value: string) {
        this.events.emit(`${this.formName}.${String(field)}:change`, {
            field,
            value
        });
    }

    checkButton (valid: boolean) {
        if (valid === true) {
            this.submitButton.disabled = false
        } else {
            this.submitButton.disabled = true

        }
    }

    choicePayment(value: string | null){
    if(value === null){ 
        this.btns.forEach(btn => {
            if (btn.classList.contains('button_alt-active')){
                btn.classList.remove('button_alt-active')
            }
        })
    }else{
        this.btns.forEach(btn => {
            if (btn.classList.contains('button_alt-active')){
                btn.classList.remove('button_alt-active')
            }
        })
        this.container.querySelector(`[name=${value}]`).classList.add('button_alt-active')
    }
}
}