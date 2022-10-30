use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HolonDTO {
    parent_id: Option<u8>,
    namespace_id: u8,
    local_id: u8,
    user_id: u8,
    version: SemanticVersion,
    properties: PropertyMap,
    descriptor: HolonDescriptor,
    stewards: Option<vec<AgentPubKey>>,
    ontology: Option<vec<HolonDescriptor>>,
    //  actions: ActionMap,
    // relationships: RelationshipMap
    }
pub nickname_prefix: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Uid {
    _id : u64,
}
