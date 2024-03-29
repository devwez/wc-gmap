import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('wc-gmap')
export class WcGmap extends LitElement {

    @property({ type: Number })
    lat = 45.5925512;

    @property({ type: Number })
    lng = 12.5566951;

    @property({ type: Number })
    zoom = 4;

    @property({ type: String })
    apikey = '';

    @property({ type: String })
    id: string = 'map';

    @property({ type: String })
    stylemapid = '82dd7744e7dc572b';

    @property({ type: Boolean })
    autopanfit = false;

    @property({ type: Boolean })
    panControl = false;

    @property({ type: Boolean })
    zoomControl = false;

    @property({ type: Boolean })
    mapTypeControl = false;

    @property({ type: Boolean })
    scaleControl = false;

    @property({ type: Boolean })
    streetViewControl = false;

    @property({ type: Boolean })
    overviewMapControl = false;


    @property({ type: Boolean })
    pinCustom = false;

    @property({ type: String })
    pinBackground = '#3b3b3b';

    @property({ type: String })
    pinBorderColor = '#3b3b3b';

    @property({ type: String })
    pinGlyph = 'B';

    @property({ type: String })
    pinGlyphColor = '#ffffff';

    @property({ type: Number })
    pinScale = 1;

    @property({ type: String })
    mapHeight = '100%';

    @property({ type: Number })
    markerDelay = 100;

    map: any = null;
    markerNodes: any = null;
    markers: any = null;
    infoW: any = null;
    markerClusterer: boolean = false;
    markerClustererNode: any = null;
    markerClustererOpt: object | null = null;
    mc: object | null = null;
    latlngbounds: any = null;
    pinHtml: any = null;

    PIN_CUSTOM_WC_GMAP: number = parseInt('0001', 2);
    PIN_CUSTOM_WC_ADVMARKER: number = parseInt('0010', 2);
    PIN_HTML_WC_GMAP: number = parseInt('0100', 2);
    PIN_HTML_WC_ADVMARKER: number = parseInt('1000', 2);
    PIN_TYPE: number = 0;

    styles: string = ``;


    protected async _createMarker(marker: any, pin: any): Promise<void> {
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
        const m = new AdvancedMarkerElement({
            map: this.map,
            position: {
                lat: marker.lat,
                lng: marker.lng
            },
            content: pin.element
        });
        if (marker.infoNode) {
            m.addListener('click', ({ latLng }: { latLng: any }) => {
                this.infoW.close();
                this.infoW.setContent(marker.infoHtml);
                this.infoW.open(this.map, m);
                this.map.panTo(latLng);
            });
        }
        this.markers.push(m);
    }

    protected initautopanfit(): void {
        if (this.autopanfit) {
            this.map.fitBounds(this.latlngbounds);
            this.map.panToBounds(this.latlngbounds);
        }
    }

    protected initMarkersEnd(): void {
        this.initautopanfit();
    }

    protected async initmarker(): Promise<void> {
        const { InfoWindow } = await google.maps.importLibrary("maps");
        const { PinElement } = await google.maps.importLibrary("marker");

        this.markers = [];
        this.infoW = new InfoWindow();
        var delayMarker = this.markerDelay;
        this.markerNodes.forEach((marker: any) => {
            this.PIN_TYPE = this.PIN_TYPE | ((this.pinCustom) ? this.PIN_CUSTOM_WC_GMAP : 0) | ((marker.pinCustom) ? this.PIN_CUSTOM_WC_ADVMARKER : 0) | ((this.pinHtml) ? this.PIN_HTML_WC_GMAP : 0) | ((marker.pinHtml) ? this.PIN_HTML_WC_ADVMARKER : 0);
            let pin = null;
            switch (this.PIN_TYPE) {
                case 0:
                    pin = new PinElement();
                    break;
                case 1: case 6: case 7:
                    pin = new PinElement({ background: this.pinBackground, borderColor: this.pinBorderColor, glyph: this.pinGlyph, glyphColor: this.pinGlyphColor, scale: this.pinScale });
                    break;
                case 2: case 3:
                    pin = new PinElement({ background: marker.pinBackground, borderColor: marker.pinBorderColor, glyph: marker.pinGlyph, glyphColor: marker.pinGlyphColor, scale: marker.pinScale });
                    break;
                case 4: case 5:
                    var divElement = document.createElement('div');
                    divElement.innerHTML = this.pinHtml.htmlContent;
                    divElement.className = this.pinHtml.class;
                    pin = { element: divElement };
                    break;
                case 8: case 9: case 10: case 11: case 12: case 13: case 14: case 15:
                    var divElement = document.createElement('div');
                    divElement.innerHTML = marker.pinHtml.htmlContent;
                    divElement.className = marker.pinHtml.class;

                    pin = { element: divElement };
                    break;
                default:
                    pin = new PinElement();
                    break;
            }
            pin.element.classList.add('pin-drop');
            pin.element.style.opacity = '0';
            pin.element.addEventListener('animationend', () => { pin.element.classList.remove('drop'); pin.element.style.opacity = '1'; });

            setTimeout(() => { this._createMarker(marker, pin); }, delayMarker);
            delayMarker += this.markerDelay;

            var mLatLng = new google.maps.LatLng(marker.lat, marker.lng);
            if (this.autopanfit) this.latlngbounds?.extend(mLatLng);

            this.PIN_TYPE = 0;

        });
        setTimeout(() => { this.initmarkerclusterer(); }, delayMarker);
        this.initMarkersEnd();
    }

    protected async initmarkerclusterer(): Promise<void> {
        const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

        if (this.markerClusterer) {
            const renderer = {
                render: ({ count, position }: { count: Number, position: any }) =>
                    new AdvancedMarkerElement({
                        position,
                        content: new PinElement({
                            background: this.markerClustererNode.pinBackground,
                            borderColor: this.markerClustererNode.pinBorderColor,
                            glyph: count.toString(),
                            glyphColor: this.markerClustererNode.pinGlyphColor,
                            scale: this.markerClustererNode.pinScale
                        }).element
                    }),
            };

            const gridOption = {
                gridSize: this.markerClustererNode.gridSize,
                maxZoom: this.markerClustererNode.maxZoom,
                maxDistance: this.markerClustererNode.maxDistance,
                viewportPadding: this.markerClustererNode.viewportPadding
            };

            this.mc = new markerClusterer.MarkerClusterer({
                map: this.map,
                markers: this.markers,
                renderer,
                gridOption
            });
        }
    }

    protected async initMap(): Promise<void> {
        if (typeof google === 'undefined') {
            console.log('google api not loaded');
            setTimeout(() => this.initMap(), 100);
            return;
        }
        if (this.markerClusterer && typeof markerClusterer === 'undefined') {
            console.log('markerClusterer not loaded');
            setTimeout(() => this.initMap(), 100);
            return;
        }
        this.latlngbounds = (this.autopanfit) ? new google.maps.LatLngBounds() : null;

        const { Map } = await google.maps.importLibrary("maps");
        this.map = new Map(this.shadowRoot?.querySelector('#' + this.id), {
            center: { lat: this.lat, lng: this.lng },
            zoom: this.zoom,
            mapId: this.stylemapid,
            panControl: this.panControl,
            zoomControl: this.zoomControl,
            mapTypeControl: this.mapTypeControl,
            scaleControl: this.scaleControl,
            streetViewControl: this.streetViewControl,
            overviewMapControl: this.overviewMapControl
        });
        google.maps.event.addListenerOnce(this.map, 'tilesloaded', () => {
            setTimeout(() => this.initmarker(), 300);
        });
    }

    protected _appendScripts(): void {
        const sg = document.createElement('script');
        sg.async = true;
        sg.src = `https://maps.googleapis.com/maps/api/js?key=${this.apikey}&language=it&loading=async&callback=window.${this.id}.init_map`;
        document.head.appendChild(sg);
        const sgm = document.createElement('script');
        sgm.src = 'https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js';
        document.head.appendChild(sgm);
    }

    connectedCallback() {
        super.connectedCallback();
        (window as any)[`${this.id}`]['init_map'] = () => this.initMap();
        this._appendScripts();
        this.markerNodes = this.querySelectorAll('wc-advmarker');
        this.markerClustererNode = this.querySelector('wc-markerclusterer');
        if (this.markerClustererNode) this.markerClusterer = true;
        this.pinHtml = this.querySelector('wc-pinhtml');
        const styles = this.querySelector('style');
        this.styles = styles?.innerText || '';
    }

    _closeInfo(): void { }

    render() {
        return html`
            <style>${this.styles}</style>
            <div id="${this.id}" style="height: ${this.mapHeight};"></div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'wc-gmap': WcGmap
    }
}

declare var google: any;
declare var markerClusterer: any;