use hdi::prelude::*;
use std::{collections::BTreeMap};

use crate::{SemanticVersion};

#[hdk_entry_helper]
#[derive(Clone)]
pub struct Holon {
    pub local_id: String, //Base64 hash of device data or node space
    pub creator: AgentPubKey,
    pub created_at: Timestamp, //already given in actionhash.. remove?
    pub origin: String,  //Base64 holan derived id
    pub workspace: bool,
    pub version: SemanticVersion,
    pub last_modified: Timestamp, //already given in actionhash remove?
    pub properties: BTreeMap<String,String>,
    pub descriptor: EntryHash,
    //pub stewards: Option<Vec<AgentPubKey>>,
    pub ontology: Option<Vec<EntryHash>>,
}
