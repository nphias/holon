
import test from 'node:test';
import assert from 'node:assert';

import { runScenario, pause } from '@holochain/tryorama';
import { ActionHash, Record } from '@holochain/client';
import { decode } from '@msgpack/msgpack';


test('create holon', async t => {
  await runScenario(async scenario => {

    // Construct proper paths for your app.
    // This assumes app bundle created by the `hc app pack` command.
    const testAppPath = process.cwd() + '/' + "../workdir/holon.happ";

    // Set up the array of DNAs to be installed, which only consists of the
    // test DNA referenced by path.
    const app = { appBundleSource: { path: testAppPath } };

    // Add 2 players with the test DNA to the Scenario. The returned players
    // can be destructured.
    const [alice, bob] = await scenario.addPlayersWithHappBundles([app, app]);

    // Shortcut peer discovery through gossip and register all agents in every
    // conductor of the scenario.
    await scenario.shareAllAgents();
    
    const alice_holon_cell = alice.cells.find(c => c.role_id === 'holon');
    if (!alice_holon_cell) throw new Error("No cell for role id holon was found");

    const bob_holon_cell = bob.cells.find(c => c.role_id === 'holon');
    if (!bob_holon_cell) throw new Error("No cell for role id holon was found");
    

    const createInput = {
      //parent_id: Buffer.from(new Uint8Array([132, 33, 36, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
      namespace_id: "1234abcd",
      properties: {title:"myspace",description:"A space to play"}, 
      descriptor: Buffer.from(new Uint8Array([132, 33, 36, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
      //stewards: vec<agentid>
      //ontology: vec<descriptor>,
    };

    // Alice creates a holon
    const record: Record = await alice_holon_cell.callZome({
      zome_name: "holon",
      fn_name: "create_holon",
      payload: createInput,
    });
    assert.ok(record);
    console.log(record)
  });
});

test('create and read holon', async t => {
  await runScenario(async scenario => {

    // Construct proper paths for your app.
    // This assumes app bundle created by the `hc app pack` command.
    const testAppPath = process.cwd() + '/' + "../workdir/holon.happ";

    // Set up the array of DNAs to be installed, which only consists of the
    // test DNA referenced by path.
    const app = { appBundleSource: { path: testAppPath } };

    // Add 2 players with the test DNA to the Scenario. The returned players
    // can be destructured.
    const [alice, bob] = await scenario.addPlayersWithHappBundles([app, app]);

    // Shortcut peer discovery through gossip and register all agents in every
    // conductor of the scenario.
    await scenario.shareAllAgents();
    
    const alice_holon_cell = alice.cells.find(c => c.role_id === 'holon');
    if (!alice_holon_cell) throw new Error("No cell for role id holon was found");

    const bob_holon_cell = bob.cells.find(c => c.role_id === 'holon');
    if (!bob_holon_cell) throw new Error("No cell for role id holon was found");
    

    const createInput = {
     // parent_id: Buffer.from(new Uint8Array([132, 33, 36, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
      namespace_id: "1234abcd",
      properties: {title:"myspace",description:"A space to play"}, 
      descriptor: Buffer.from(new Uint8Array([132, 33, 36, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
      //stewards: vec<agentid>
      //ontology: vec<descriptor>,
    };

    // Alice creates a holon
    const record: Record = await alice_holon_cell.callZome({
      zome_name: "holon",
      fn_name: "create_holon",
      payload: createInput,
    });
    assert.ok(record);
    
    // Wait for the created entry to be propagated to the other node.
    await pause(300);

    // Bob gets the created holon
    const createReadOutput: Record = await bob_holon_cell.callZome({
      zome_name: "holon",
      fn_name: "get_holon",
      payload: record.signed_action.hashed.hash,
    });
    console.log(record)

    assert.deepEqual(createInput, decode((createReadOutput.entry as any).Present.entry) as any);
  });
});
/*
test('create and update holon', async t => {
  await runScenario(async scenario => {

    // Construct proper paths for your app.
    // This assumes app bundle created by the `hc app pack` command.
    const testAppPath = process.cwd() + '/' + "../workdir/holon.happ";

    // Set up the array of DNAs to be installed, which only consists of the
    // test DNA referenced by path.
    const app = { appBundleSource: { path: testAppPath } };

    // Add 2 players with the test DNA to the Scenario. The returned players
    // can be destructured.
    const [alice, bob] = await scenario.addPlayersWithHappBundles([app, app]);

    // Shortcut peer discovery through gossip and register all agents in every
    // conductor of the scenario.
    await scenario.shareAllAgents();
    
    const alice_holon_cell = alice.cells.find(c => c.role_id === 'holon');
    if (!alice_holon_cell) throw new Error("No cell for role id holon was found");

    const bob_holon_cell = bob.cells.find(c => c.role_id === 'holon');
    if (!bob_holon_cell) throw new Error("No cell for role id holon was found");
    

    const createInput = {
  created_at: 'Lorem ipsum',
  id: Buffer.from(new Uint8Array([132, 33, 36, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
  last_modified: 'Lorem ipsum',
  namespace_id: 'Lorem ipsum',
  ontology: 6,
  parent_id: Buffer.from(new Uint8Array([132, 33, 36, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
  steward: Buffer.from(new Uint8Array([132, 32, 36, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
  user_id: Buffer.from(new Uint8Array([132, 32, 36, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
  version: 'Lorem ipsum'
};

    // Alice creates a holon
    const record: Record = await alice_holon_cell.callZome({
      zome_name: "holon",
      fn_name: "create_holon",
      payload: createInput,
    });
    assert.ok(record);
 
    // Alice updates the holon
    const contentUpdate: any = {
  created_at: 'Lorem ipsum',
  id: Buffer.from(new Uint8Array([132, 33, 36, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
  last_modified: 'Lorem ipsum',
  namespace_id: 'Lorem ipsum',
  ontology: 4,
  parent_id: Buffer.from(new Uint8Array([132, 33, 36, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
  steward: Buffer.from(new Uint8Array([132, 32, 36, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
  user_id: Buffer.from(new Uint8Array([132, 32, 36, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
  version: 'Lorem ipsum'
};

    const updateInput = {
      original_action_hash: record.signed_action.hashed.hash,
      updated_holon: contentUpdate,
    };

    const updatedRecord: Record = await alice_holon_cell.callZome({
      zome_name: "holon",
      fn_name: "update_holon",
      payload: updateInput,
    });
    assert.ok(updatedRecord);


    // Wait for the updated entry to be propagated to the other node.
    await pause(300);
        
    // Bob gets the updated holon
    const readUpdatedOutput: Record = await bob_holon_cell.callZome({
      zome_name: "holon",
      fn_name: "get_holon",
      payload: updatedRecord.signed_action.hashed.hash,
    });
    assert.deepEqual(contentUpdate, decode((readUpdatedOutput.entry as any).Present.entry) as any);

  });
});
test('create and delete holon', async t => {
  await runScenario(async scenario => {

    // Construct proper paths for your app.
    // This assumes app bundle created by the `hc app pack` command.
    const testAppPath = process.cwd() + '/' + "../workdir/holon.happ";

    // Set up the array of DNAs to be installed, which only consists of the
    // test DNA referenced by path.
    const app = { appBundleSource: { path: testAppPath } };

    // Add 2 players with the test DNA to the Scenario. The returned players
    // can be destructured.
    const [alice, bob] = await scenario.addPlayersWithHappBundles([app, app]);

    // Shortcut peer discovery through gossip and register all agents in every
    // conductor of the scenario.
    await scenario.shareAllAgents();
    
    const alice_holon_cell = alice.cells.find(c => c.role_id === 'holon');
    if (!alice_holon_cell) throw new Error("No cell for role id holon was found");

    const bob_holon_cell = bob.cells.find(c => c.role_id === 'holon');
    if (!bob_holon_cell) throw new Error("No cell for role id holon was found");
    

    const createInput = {
  created_at: 'Lorem ipsum',
  id: Buffer.from(new Uint8Array([132, 33, 36, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
  last_modified: 'Lorem ipsum',
  namespace_id: 'Lorem ipsum',
  ontology: 8,
  parent_id: Buffer.from(new Uint8Array([132, 33, 36, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
  steward: Buffer.from(new Uint8Array([132, 32, 36, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
  user_id: Buffer.from(new Uint8Array([132, 32, 36, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
  version: 'Lorem ipsum'
};

    // Alice creates a holon
    const record: Record = await alice_holon_cell.callZome({
      zome_name: "holon",
      fn_name: "create_holon",
      payload: createInput,
    });
    assert.ok(record);
        
    // Alice deletes the holon
    const deleteActionHash = await alice_holon_cell.callZome({
      zome_name: "holon",
      fn_name: "delete_holon",
      payload: record.signed_action.hashed.hash,
    });
    assert.ok(deleteActionHash);


    // Wait for the entry deletion to be propagated to the other node.
    await pause(300);
        
    // Bob tries to get the deleted holon
    const readDeletedOutput = await bob_holon_cell.callZome({
      zome_name: "holon",
      fn_name: "get_holon",
      payload: record.signed_action.hashed.hash,
    });
    assert.equal(readDeletedOutput, undefined);

  });
});*/