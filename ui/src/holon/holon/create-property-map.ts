import { LitElement, html } from 'lit';
import { state, customElement } from 'lit/decorators.js';
import { InstalledCell, ActionHash, Record, AppWebsocket, InstalledAppInfo } from '@holochain/client';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import { PropertyMap } from './property-map';
import '@material/mwc-button';
import '@material/mwc-slider';

@customElement('create-property-map')
export class CreatePropertyMap extends LitElement {

  @state()
  _properties: number
 | undefined;

  isPropertyMapValid() {
    return this._properties;
  }

  @contextProvided({ context: appWebsocketContext })
  appWebsocket!: AppWebsocket;

  @contextProvided({ context: appInfoContext })
  appInfo!: InstalledAppInfo;

  async createPropertyMap() {
    const cellData = this.appInfo.cell_data.find((c: InstalledCell) => c.role_id === 'holon')!;

    const propertyMap: PropertyMap = { 
      properties: this._properties!,
    };

    const record: Record = await this.appWebsocket.callZome({
      cap_secret: null,
      cell_id: cellData.cell_id,
      zome_name: 'holon',
      fn_name: 'create_property_map',
      payload: propertyMap,
      provenance: cellData.cell_id[1]
    });

    this.dispatchEvent(new CustomEvent('property-map-created', {
      composed: true,
      bubbles: true,
      detail: {
        actionHash: record.signed_action.hashed.hash
      }
    }));
  }

  render() {
    return html`
      <div style="display: flex; flex-direction: column">
        <span style="font-size: 18px">Create PropertyMap</span>

          <div style="display: flex; flex-direction: row">
            <span style="margin-right: 4px"></span>
          
            <mwc-slider @input=${(e: CustomEvent) => { this._properties = e.detail.value; } }></mwc-slider>
          </div>

        <mwc-button 
          label="Create PropertyMap"
          .disabled=${!this.isPropertyMapValid()}
          @click=${() => this.createPropertyMap()}
        ></mwc-button>
    </div>`;
  }
}
