import { LitElement} from "lit";
import { customElement } from "lit/decorators.js";

@customElement('wc-infowindow')
export class WcInfoWindow extends LitElement {}

declare global {
    interface  HTMLElementTagNameMap {
        'wc-infowindow': WcInfoWindow
    }
}