import { LitElement, html } from 'lit';
import { state, customElement } from 'lit/decorators.js';
import { InstalledCell, ActionHash, Record, AppWebsocket, InstalledAppInfo } from '@holochain/client';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import { Holon } from './holon';
import '@material/mwc-button';
import '@material/mwc-texfield';
import '@material/mwc-texfield';
import '@material/mwc-texfield';
import '@material/mwc-slider';
import '@material/mwc-texfield';

@customElement('create-holon')
export class CreateHolon extends LitElement {

  @state()
  _createdAt: string
 | undefined;

  @state()
  _id: EntryHash
 | undefined;

  @state()
  _lastModified: string
 | undefined;

  @state()
  _namespaceId: string
 | undefined;

  @state()
  _ontology: number
 | undefined;

  @state()
  _parentId: EntryHash
 | undefined;

  @state()
  _steward: AgentPubKey
 | undefined;

  @state()
  _userId: AgentPubKey
 | undefined;

  @state()
  _version: string
 | undefined;

  isHolonValid() {
    return this._createdAt && this._id && this._lastModified && this._namespaceId && this._ontology && this._parentId && this._steward && this._userId && this._version;
  }

  @contextProvided({ context: appWebsocketContext })
  appWebsocket!: AppWebsocket;

  @contextProvided({ context: appInfoContext })
  appInfo!: InstalledAppInfo;

  async createHolon() {
    const cellData = this.appInfo.cell_data.find((c: InstalledCell) => c.role_id === 'holon')!;

    const holon: Holon = { 
      created_at: this._createdAt!,

      id: this._id!,

      last_modified: this._lastModified!,

      namespace_id: this._namespaceId!,

      ontology: this._ontology!,

      parent_id: this._parentId!,

      steward: this._steward!,

      user_id: this._userId!,

      version: this._version!,
    };

    const record: Record = await this.appWebsocket.callZome({
      cap_secret: null,
      cell_id: cellData.cell_id,
      zome_name: 'holon',
      fn_name: 'create_holon',
      payload: holon,
      provenance: cellData.cell_id[1]
    });

    this.dispatchEvent(new CustomEvent('holon-created', {
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
        <span style="font-size: 18px">Create Holon</span>

          <mwc-textfield outlined label="" @input=${(e: CustomEvent) => { this._createdAt = (e.target as any).value; } }></mwc-textfield>
          <!-- TODO: implement the creation of id -->
          <mwc-textfield outlined label="" @input=${(e: CustomEvent) => { this._lastModified = (e.target as any).value; } }></mwc-textfield>
          <mwc-textfield outlined label="" @input=${(e: CustomEvent) => { this._namespaceId = (e.target as any).value; } }></mwc-textfield>
          <div style="display: flex; flex-direction: row">
            <span style="margin-right: 4px"></span>
          
            <mwc-slider @input=${(e: CustomEvent) => { this._ontology = e.detail.value; } }></mwc-slider>
          </div>
          <!-- TODO: implement the creation of parent_id -->
          <!-- TODO: implement the creation of steward -->
          <!-- TODO: implement the creation of user_id -->
          <mwc-textfield outlined label="" @input=${(e: CustomEvent) => { this._version = (e.target as any).value; } }></mwc-textfield>

        <mwc-button 
          label="Create Holon"
          .disabled=${!this.isHolonValid()}
          @click=${() => this.createHolon()}
        ></mwc-button>
    </div>`;
  }
}
