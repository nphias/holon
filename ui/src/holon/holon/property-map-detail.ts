import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { InstalledCell, AppWebsocket, Record, ActionHash, InstalledAppInfo } from '@holochain/client';
import { contextProvided } from '@lit-labs/context';
import { decode } from '@msgpack/msgpack';
import { appInfoContext, appWebsocketContext } from '../../contexts';
import { PropertyMap } from './property-map';
import '@material/mwc-circular-progress';

@customElement('property-map-detail')
export class PropertyMapDetail extends LitElement {
  @property()
  actionHash!: ActionHash;

  @state()
  _propertyMap: PropertyMap | undefined;

  @contextProvided({ context: appWebsocketContext })
  appWebsocket!: AppWebsocket;
  @contextProvided({ context: appInfoContext })
  appInfo!: InstalledAppInfo;

  async firstUpdated() {
    const cellData = this.appInfo.cell_data.find((c: InstalledCell) => c.role_id === 'holon')!;
    const record: Record | undefined = await this.appWebsocket.callZome({
      cap_secret: null,
      cell_id: cellData.cell_id,
      zome_name: 'holon',
      fn_name: 'get_property_map',
      payload: this.actionHash,
      provenance: cellData.cell_id[1]
    });
    if (record) {
      this._propertyMap = decode((record.entry as any).Present.entry) as PropertyMap;
    }
  }

  render() {
    if (!this._propertyMap) {
      return html`<div style="display: flex; flex: 1; align-items: center; justify-content: center">
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;
    }
    return html`
      <div style="display: flex; flex-direction: column">
        <span style="font-size: 18px">PropertyMap</span>
		  <div style="display: flex; flex-direction: row">
		    <span><strong></strong></span>
		    <span style="white-space: pre-line">${this._propertyMap.properties }</span>
		  </div>
      </div>
    `;
  }
}
