use std::collections::BTreeMap;
use hdk::prelude::*;

use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HolonDTO {
    pub parent_id: Option<ActionHash>,
    pub namespace_id: String,
    pub properties: BTreeMap<String,String>,
    pub descriptor: EntryHash,
    pub stewards: Option<Vec<AgentPubKey>>,
    pub ontology: Option<Vec<EntryHash>>,
}
