import { LitElement} from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('wc-markerclusterer')
export class WcMarkerClusterer extends LitElement {
    
    @property({type: Boolean})
    pinCustom= false;

    @property({type: String})
    pinBackground= '#3b3b3b';

    @property({type: String})
    pinBorderColor= '#3b3b3b';

    @property({type: String})
    pinGlyph= '';

    @property({type: String})
    pinGlyphColor= '#FFFFFF';

    @property({type: Number})
    pinScale= 1;

    @property({type: Number})
    gridSize= 60;
    
    @property({type: Number})
    maxDistance= 100;

    @property({type: Number})
    maxZoom= 10;

    @property({type: Number})
    viewportPadding= 10;

}

declare global {
    interface  HTMLElementTagNameMap {
        'wc-markerclusterer': WcMarkerClusterer
    }
}