use hdk::prelude::*;
use holon_integrity::*;

#[hdk_extern]
pub fn create_typedescriptor(typedescriptor: TypeDescriptor) -> ExternResult<Record> {
    let typedescriptor_hash = create_entry(
        &EntryTypes::TypeDescriptor(typedescriptor.clone()),
    )?;
    let record = get(typedescriptor_hash.clone(), GetOptions::default())?
        .ok_or(
            wasm_error!(
                WasmErrorInner::Guest(String::from("Could not find the newly created Typedescriptor"))
            ),
        )?;
    Ok(record)
}
#[hdk_extern]
pub fn get_typedescriptor(action_hash: ActionHash) -> ExternResult<Option<Record>> {
    get(action_hash, GetOptions::default())
}
#[derive(Serialize, Deserialize, Debug)]
pub struct UpdateTypedescriptorInput {
    original_action_hash: ActionHash,
    updated_typedescriptor: TypeDescriptor,
}
#[hdk_extern]
pub fn update_typedescriptor(input: UpdateTypedescriptorInput) -> ExternResult<Record> {
    let updated_typedescriptor_hash = update_entry(
        input.original_action_hash,
        &input.updated_typedescriptor,
    )?;
    let record = get(updated_typedescriptor_hash.clone(), GetOptions::default())?
        .ok_or(
            wasm_error!(
                WasmErrorInner::Guest(String::from("Could not find the newly updated Typedescriptor"))
            ),
        )?;
    Ok(record)
}
#[hdk_extern]
pub fn delete_typedescriptor(action_hash: ActionHash) -> ExternResult<ActionHash> {
    delete_entry(action_hash)
}
