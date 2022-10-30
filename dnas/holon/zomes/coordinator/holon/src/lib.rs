pub mod all_holons;
pub mod typedescriptor;
pub mod holon;
pub mod holon_dto;
use hdk::prelude::*;

#[hdk_extern]
pub fn init(_: ()) -> ExternResult<InitCallbackResult> {
    Ok(InitCallbackResult::Pass)
}
