use hdi::prelude::*;
#[hdk_entry_helper]
#[derive(Clone)]
pub struct SemanticVersion {
    pub major: u8,
    pub minor: u8,
    pub patch: u8,
}
