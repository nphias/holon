import { LitElement, html } from 'lit';
import { state, customElement } from 'lit/decorators.js';
import { InstalledCell, ActionHash, Record, AppWebsocket, InstalledAppInfo } from '@holochain/client';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import { Typedescriptor } from './typedescriptor';
import '@material/mwc-button';
import '@material/mwc-texfield';
import '@material/mwc-slider';

@customElement('create-typedescriptor')
export class CreateTypedescriptor extends LitElement {

  @state()
  _header: string
 | undefined;

  @state()
  _properties: number
 | undefined;

  isTypedescriptorValid() {
    return this._header && this._properties;
  }

  @contextProvided({ context: appWebsocketContext })
  appWebsocket!: AppWebsocket;

  @contextProvided({ context: appInfoContext })
  appInfo!: InstalledAppInfo;

  async createTypedescriptor() {
    const cellData = this.appInfo.cell_data.find((c: InstalledCell) => c.role_id === 'holon')!;

    const typedescriptor: Typedescriptor = { 
      header: this._header!,

      properties: this._properties!,
    };

    const record: Record = await this.appWebsocket.callZome({
      cap_secret: null,
      cell_id: cellData.cell_id,
      zome_name: 'holon',
      fn_name: 'create_typedescriptor',
      payload: typedescriptor,
      provenance: cellData.cell_id[1]
    });

    this.dispatchEvent(new CustomEvent('typedescriptor-created', {
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
        <span style="font-size: 18px">Create Typedescriptor</span>

          <mwc-textfield outlined label="" @input=${(e: CustomEvent) => { this._header = (e.target as any).value; } }></mwc-textfield>
          <div style="display: flex; flex-direction: row">
            <span style="margin-right: 4px"></span>
          
            <mwc-slider @input=${(e: CustomEvent) => { this._properties = e.detail.value; } }></mwc-slider>
          </div>

        <mwc-button 
          label="Create Typedescriptor"
          .disabled=${!this.isTypedescriptorValid()}
          @click=${() => this.createTypedescriptor()}
        ></mwc-button>
    </div>`;
  }
}
