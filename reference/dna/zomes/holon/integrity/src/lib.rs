use hdi::prelude::*;
use std::collections::BTreeMap;
// use hdi::prelude::hash_blake2b;
// use hdk::prelude::holo_hash::*;
use hdi::prelude::Timestamp;

mod types;
//mod holon;
pub use types::Holon;


#[hdk_entry_defs]
#[unit_enum(UnitEntryTypes)]
pub enum EntryTypes {
#[entry_def()]
  Holon(Holon),

}

#[hdk_extern]
pub fn validate(_op: Op) -> ExternResult<ValidateCallbackResult> {
  Ok(ValidateCallbackResult::Valid)
}
