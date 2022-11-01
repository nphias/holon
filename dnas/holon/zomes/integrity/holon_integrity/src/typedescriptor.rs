use std::collections::BTreeMap;
use hdi::prelude::*;
use crate::SemanticVersion;

#[hdk_entry_helper]
#[derive(Clone)]
pub struct TypeDescriptor { // the shared attributes common to all Type Descriptors
    author: Option<String>,
    version: SemanticVersion,
    previous: Option<EntryHash>, // the previous version of this descriptor (assumes linear versioning), Link? Vec<Option> for all versions?
    created_at: Timestamp, // needed?  in actionheader
    type_data: EntryHash
}

#[hdk_entry_helper]
#[derive(Clone)]
pub struct Type {
    pub type_name: String,
    pub description: String,
    pub properties: BTreeMap<String,String>, //todo typing for values
}