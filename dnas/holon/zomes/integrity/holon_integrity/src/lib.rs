pub mod typedescriptor;
pub use typedescriptor::*;
pub mod holon;
pub use holon::*;
pub mod semantic_version;
pub use semantic_version::*;
use hdi::prelude::*;

#[hdk_extern]
pub fn validate(_op: Op) -> ExternResult<ValidateCallbackResult> {
    Ok(ValidateCallbackResult::Valid)
}
#[hdk_entry_defs]
#[unit_enum(UnitEntryTypes)]
pub enum EntryTypes {
    Holon(Holon),
    TypeDescriptor(TypeDescriptor),
    SemanticVersion(SemanticVersion)
}
#[hdk_link_types]
pub enum LinkTypes {
    AllHolons,
}
