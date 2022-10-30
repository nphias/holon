//! ## hc_zome_holon

use hdk::prelude::*;

mod types;
mod holon;

use types::HolonDTO;
use hc_zome_holon_integrity::*;

/// Creates the profile for the agent executing this call.
#[hdk_extern]
pub fn create_holon(holon_dto: HolonDTO) -> ExternResult<Record> {
    handlers::create_holon(holon_dto)
}

