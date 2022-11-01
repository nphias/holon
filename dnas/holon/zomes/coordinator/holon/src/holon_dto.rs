use std::collections::BTreeMap;
use hdk::prelude::*;

use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HolonDTO {
    pub local_id: String, //Base64 hash of device data or node space
    pub workspace: bool,
    pub parent_id: Option<String>,
    pub namespace_id: String,  //Base64 holan derived id
    pub properties: BTreeMap<String,String>,
    pub descriptor: EntryHash,
    //pub stewards: Option<Vec<AgentPubKey>>, //should be links type steward vs type creator
    pub ontology: Option<Vec<EntryHash>>,
}
