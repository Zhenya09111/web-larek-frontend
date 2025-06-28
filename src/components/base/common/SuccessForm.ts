import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface ISuccess {
    description: string | number; 
}

export class SuccessFrom extends Component<ISuccess>{
    protected successDescription: HTMLElement;
    protected btnSucccesClose: HTMLButtonElement;
    protected events: IEvents;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container)
        this.events = events

        this.btnSucccesClose = this.container.querySelector('.order-success__close');
        this.successDescription =  this.container.querySelector('.order-success__description');

        this.btnSucccesClose.addEventListener('click', () => {
            events.emit('close:Success')
        })
    }

    set description(parm: string) {
        this.successDescription.textContent = `Списано ${parm} синапсов`
    }
}