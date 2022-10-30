import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { InstalledCell, AppWebsocket, Record, ActionHash, InstalledAppInfo } from '@holochain/client';
import { contextProvided } from '@lit-labs/context';
import { decode } from '@msgpack/msgpack';
import { appInfoContext, appWebsocketContext } from '../../contexts';
import { Holon } from './holon';
import '@material/mwc-circular-progress';

@customElement('holon-detail')
export class HolonDetail extends LitElement {
  @property()
  actionHash!: ActionHash;

  @state()
  _holon: Holon | undefined;

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
      fn_name: 'get_holon',
      payload: this.actionHash,
      provenance: cellData.cell_id[1]
    });
    if (record) {
      this._holon = decode((record.entry as any).Present.entry) as Holon;
    }
  }

  render() {
    if (!this._holon) {
      return html`<div style="display: flex; flex: 1; align-items: center; justify-content: center">
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;
    }
    return html`
      <div style="display: flex; flex-direction: column">
        <span style="font-size: 18px">Holon</span>
		  <div style="display: flex; flex-direction: column">
		    <span><strong></strong></span>
		    <span style="white-space: pre-line">${this._holon.created_at }</span>
		  </div>
		  <!-- TODO: implement the rendering of id -->
		  <div style="display: flex; flex-direction: column">
		    <span><strong></strong></span>
		    <span style="white-space: pre-line">${this._holon.last_modified }</span>
		  </div>
		  <div style="display: flex; flex-direction: column">
		    <span><strong></strong></span>
		    <span style="white-space: pre-line">${this._holon.namespace_id }</span>
		  </div>
		  <div style="display: flex; flex-direction: row">
		    <span><strong></strong></span>
		    <span style="white-space: pre-line">${this._holon.ontology }</span>
		  </div>
		  <!-- TODO: implement the rendering of parent_id -->
		  <!-- TODO: implement the rendering of steward -->
		  <!-- TODO: implement the rendering of user_id -->
		  <div style="display: flex; flex-direction: column">
		    <span><strong></strong></span>
		    <span style="white-space: pre-line">${this._holon.version }</span>
		  </div>
      </div>
    `;
  }
}
