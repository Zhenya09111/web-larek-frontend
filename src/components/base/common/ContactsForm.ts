import { IEvents } from "../base/events";
import { IAddressForm, IOrder } from "./AddressForm";

export class ContactsForm {
    protected events: IEvents;
    protected inputs?: NodeListOf<HTMLInputElement>;
    protected formName: string;
    protected submitButton: HTMLButtonElement;
    protected input: HTMLInputElement;

    constructor(protected container: HTMLElement, events: IEvents) {
        this.events = events;
        this.container = container;

        this.inputs = this.container.querySelectorAll('.form__input');
        this.formName = this.container.getAttribute('name');
        this.submitButton = this.container.querySelector('.button');


        this.submitButton.addEventListener('click', () => {
            this.events.emit('order')
        })
        this.inputs.forEach(input => {
            input.addEventListener('input', (e: Event) => {
                const target = e.target as HTMLInputElement;
                const field = target.name as keyof IOrder;
                const value = target.value;
                this.onInputChange(field, value);
            })
        })
    }


    protected onInputChange(field: keyof IOrder, value: string) {
        this.events.emit(`${this.formName}.${String(field)}:change`, {
            field,
            value
        });
    }

    checkButton(valid: boolean) {
        if (valid === true) {
            this.submitButton.disabled = false
        } else {
            this.submitButton.disabled = true

        }
    }


    set inputValues(data: Record<string, string>) {
        this.inputs.forEach((element) => {
            element.value = data[element.name];
        });
    }

    render(data?: Partial<IAddressForm>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}