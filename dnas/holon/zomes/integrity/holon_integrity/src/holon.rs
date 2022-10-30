use hdi::prelude::*;
use std::collections::BTreeMap;

use crate::{SemanticVersion};

#[hdk_entry_helper]
#[derive(Clone)]
pub struct Holon {
    pub id: Option<String>,
    pub user_id: AgentPubKey,
    pub created_at: Timestamp,
    pub namespace_id: String,  //userid_sysid_holarchyid
    pub parent_id: Option<ActionHash>,
    pub version: SemanticVersion,
    pub last_modified: Timestamp,
    pub properties: BTreeMap<String,String>,
    pub descriptor: EntryHash,
    pub stewards: Option<Vec<AgentPubKey>>,
    pub ontology: Option<Vec<EntryHash>>,
}
