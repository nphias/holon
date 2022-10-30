use std::collections::BTreeMap;
use hdi::prelude::*;
use crate::SemanticVersion;

#[hdk_entry_helper]
#[derive(Clone)]
pub struct TypeHeader { // the shared attributes common to all Type Descriptors
    type_name: String,
    description: String,
    version: SemanticVersion,
    previous: Option<EntryHash>, // the previous version of this descriptor (assumes linear versioning), Link? Vec<Option> for all versions?
    created_at: Timestamp,
}

#[hdk_entry_helper]
#[derive(Clone)]
pub struct TypeDescriptor {
    pub header: TypeHeader,
    pub properties: BTreeMap<String,String>,
}
