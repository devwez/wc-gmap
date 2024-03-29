import { LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('wc-pinhtml')
export class WcPinHtml extends LitElement {

    @property({type: String})
    id: string = '';

    @property({type: String})
    class: string = 'pin-tag';

    @property({type: Boolean})
    step: boolean = false;

    @property({type: String})
    htmlContent: string = '';

    connectedCallback() {
        super.connectedCallback();
        this.htmlContent = (!this.step) ? this.innerHTML : '';
    }
}

declare global {
    interface  HTMLElementTagNameMap {
        'wc-pinhtml': WcPinHtml
    }
}