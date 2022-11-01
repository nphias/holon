use std::hash;

use hdk::prelude::*;
use holon_integrity::*;
use crate::holon_dto::HolonDTO;


#[hdk_extern]
pub fn create_holon(holon_dto: HolonDTO) -> ExternResult<Record> {

    let newholon:Holon = Holon {
        //id: String::from(holon_dto.local_id.clone()+&holon_dto.namespace_id), //hash of local_id + namespace
        local_id: holon_dto.local_id,
        creator: agent_info().unwrap().agent_latest_pubkey,
        origin: holon_dto.namespace_id,
        workspace: holon_dto.workspace, 
        version: SemanticVersion {major:0, minor:0, patch:0},
        created_at: sys_time()?,
        last_modified: sys_time()?,
        properties: holon_dto.properties,
        descriptor: holon_dto.descriptor,
       // stewards: holon_dto.stewards,
        ontology: holon_dto.ontology
    };
    //action hash of initial creation used as id in UI
   // new Holon
    let holon_hash = create_entry(&EntryTypes::Holon(newholon.clone()))?;
    //create anchor with creation hash
    //create_link(path.path_entry_hash()?, holon_hash.clone(), LinkTypes::AllHolons, ())?;
    
    let record = get(holon_hash.clone(), GetOptions::default())?
        .ok_or(
            wasm_error!(
                WasmErrorInner::Guest(String::from("Could not find the newly created Holon"))
            ),
        )?;
    //let path = Path::from("all_holons");
    create_link(agent_info().unwrap().agent_latest_pubkey, holon_hash.clone(), LinkTypes::AgentToHolon, ())?;

   // create_link(path.path_entry_hash()?, holon_hash.clone(), LinkTypes::AllHolons, ())?;
    Ok(record)
}


#[hdk_extern]
pub fn get_holon(action_hash: ActionHash) -> ExternResult<Option<Record>> {
    get(action_hash, GetOptions::default())
}
#[derive(Serialize, Deserialize, Debug)]
pub struct UpdateHolonInput {
    original_action_hash: ActionHash,
    updated_holon: Holon,
}
#[hdk_extern]
pub fn update_holon(input: UpdateHolonInput) -> ExternResult<Record> {
    let updated_holon_hash = update_entry(
        input.original_action_hash,
        &input.updated_holon,
    )?;
    let record = get(updated_holon_hash.clone(), GetOptions::default())?
        .ok_or(
            wasm_error!(
                WasmErrorInner::Guest(String::from("Could not find the newly updated Holon"))
            ),
        )?;
    Ok(record)
}
#[hdk_extern]
pub fn delete_holon(action_hash: ActionHash) -> ExternResult<ActionHash> {
    delete_entry(action_hash)
}
