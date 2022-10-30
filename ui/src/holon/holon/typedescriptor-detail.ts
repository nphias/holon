import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { InstalledCell, AppWebsocket, Record, ActionHash, InstalledAppInfo } from '@holochain/client';
import { contextProvided } from '@lit-labs/context';
import { decode } from '@msgpack/msgpack';
import { appInfoContext, appWebsocketContext } from '../../contexts';
import { Typedescriptor } from './typedescriptor';
import '@material/mwc-circular-progress';

@customElement('typedescriptor-detail')
export class TypedescriptorDetail extends LitElement {
  @property()
  actionHash!: ActionHash;

  @state()
  _typedescriptor: Typedescriptor | undefined;

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
      fn_name: 'get_typedescriptor',
      payload: this.actionHash,
      provenance: cellData.cell_id[1]
    });
    if (record) {
      this._typedescriptor = decode((record.entry as any).Present.entry) as Typedescriptor;
    }
  }

  render() {
    if (!this._typedescriptor) {
      return html`<div style="display: flex; flex: 1; align-items: center; justify-content: center">
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;
    }
    return html`
      <div style="display: flex; flex-direction: column">
        <span style="font-size: 18px">Typedescriptor</span>
		  <div style="display: flex; flex-direction: column">
		    <span><strong></strong></span>
		    <span style="white-space: pre-line">${this._typedescriptor.header }</span>
		  </div>
		  <div style="display: flex; flex-direction: row">
		    <span><strong></strong></span>
		    <span style="white-space: pre-line">${this._typedescriptor.properties }</span>
		  </div>
      </div>
    `;
  }
}
