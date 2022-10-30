use types::*;
use hc_zome_holon_integrity::*;
use hdk::{hash_path::path::TypedPath, prelude::*};

impl Schema {
    pub fn new(id: &str, timestamp: &str) -> Self {
        Holon {
            id: id.trim().to_string().clone(),
            timestamp: timestamp.trim().to_string().clone(),
            user_id: agent_info().unwrap().agent_latest_pubkey,
        }
    }
}

pub fn create_holon(holon: HolonDTO) -> ExternResult<Record> {
    //let agent_info = agent_info()?;
    
    let action_hash = create_entry(EntryTypes::Profile(profile.clone()))?;

    let path = prefix_path(profile.nickname.clone())?;

    path.ensure()?;

    let agent_address = agent_info.agent_initial_pubkey.clone();

    create_link(
        path.path_entry_hash()?,
        action_hash.clone(),
        LinkTypes::PathToProfile,
        profile.nickname.as_bytes().to_vec(),
    )?;
    create_link(
        agent_address,
        action_hash.clone(),
        LinkTypes::AgentToProfile,
        (),
    )?;

    let record = get(action_hash, GetOptions::default())?
        .ok_or(wasm_error!(WasmErrorInner::Guest("Unreachable".into())))?;

    Ok(record)
}
