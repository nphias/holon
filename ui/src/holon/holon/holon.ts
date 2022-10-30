import { Record, ActionHash, EntryHash, AgentPubKey } from '@holochain/client';

export interface Holon { 
  created_at: string
;

  id: EntryHash
;

  last_modified: string
;

  namespace_id: string
;

  ontology: number
;

  parent_id: EntryHash
;

  steward: AgentPubKey
;

  user_id: AgentPubKey
;

  version: string
;
}
