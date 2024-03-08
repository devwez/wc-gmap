import { LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('wc-advmarker')
export class WcAdvMarker extends LitElement {

    @property({ type: Number })
    lat = 0;

    @property({ type: Number })
    lng = 0;

    @property({ type: Boolean })
    pinCustom = false;

    @property({ type: String })
    pinBackground = '#3b3b3b';

    @property({ type: String })
    pinBorderColor = '#3b3b3b';

    @property({ type: String })
    pinGlyph = 'B';

    @property({ type: String })
    pinGlyphColor = '#3b3b3b';

    @property({ type: Number })
    pinScale = 1;

    infoNode: object | null = null;
    infoHtml: string = '';

    pinHtml: any = null;

    connectedCallback() {
        super.connectedCallback();
        this.infoNode = this.querySelector('wc-infowindow');
        this.infoHtml = (this.infoNode instanceof HTMLElement) ? this.infoNode.innerHTML : '';
        this.pinHtml = this.querySelector('wc-pinhtml');
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'wc-advmarker': WcAdvMarker
    }
}