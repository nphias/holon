
import test from 'node:test';
import assert from 'node:assert';

import { runScenario, pause } from '@holochain/tryorama';
import { ActionHash, Record } from '@holochain/client';
import { decode } from '@msgpack/msgpack';


test('create typedescriptor', async t => {
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
      header: { type_name: "test", description: "for testing"},
      properties: {color:"355353"}
    };

    // Alice creates a typedescriptor
    const record: Record = await alice_holon_cell.callZome({
      zome_name: "holon",
      fn_name: "create_typedescriptor",
      payload: createInput,
    });
    assert.ok(record);

  });
});

test('create and read typedescriptor', async t => {
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
    

    const createInput: any = {
  header: 'Lorem ipsum',
  properties: 7
};

    // Alice creates a typedescriptor
    const record: Record = await alice_holon_cell.callZome({
      zome_name: "holon",
      fn_name: "create_typedescriptor",
      payload: createInput,
    });
    assert.ok(record);
    
    // Wait for the created entry to be propagated to the other node.
    await pause(300);

    // Bob gets the created typedescriptor
    const createReadOutput: Record = await bob_holon_cell.callZome({
      zome_name: "holon",
      fn_name: "get_typedescriptor",
      payload: record.signed_action.hashed.hash,
    });
    assert.deepEqual(createInput, decode((createReadOutput.entry as any).Present.entry) as any);
  });
});
test('create and update typedescriptor', async t => {
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
  header: 'Lorem ipsum',
  properties: 8
};

    // Alice creates a typedescriptor
    const record: Record = await alice_holon_cell.callZome({
      zome_name: "holon",
      fn_name: "create_typedescriptor",
      payload: createInput,
    });
    assert.ok(record);
 
    // Alice updates the typedescriptor
    const contentUpdate: any = {
  header: 'Lorem ipsum',
  properties: 2
};

    const updateInput = {
      original_action_hash: record.signed_action.hashed.hash,
      updated_typedescriptor: contentUpdate,
    };

    const updatedRecord: Record = await alice_holon_cell.callZome({
      zome_name: "holon",
      fn_name: "update_typedescriptor",
      payload: updateInput,
    });
    assert.ok(updatedRecord);


    // Wait for the updated entry to be propagated to the other node.
    await pause(300);
        
    // Bob gets the updated typedescriptor
    const readUpdatedOutput: Record = await bob_holon_cell.callZome({
      zome_name: "holon",
      fn_name: "get_typedescriptor",
      payload: updatedRecord.signed_action.hashed.hash,
    });
    assert.deepEqual(contentUpdate, decode((readUpdatedOutput.entry as any).Present.entry) as any);

  });
});
test('create and delete typedescriptor', async t => {
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
  header: 'Lorem ipsum',
  properties: 3
};

    // Alice creates a typedescriptor
    const record: Record = await alice_holon_cell.callZome({
      zome_name: "holon",
      fn_name: "create_typedescriptor",
      payload: createInput,
    });
    assert.ok(record);
        
    // Alice deletes the typedescriptor
    const deleteActionHash = await alice_holon_cell.callZome({
      zome_name: "holon",
      fn_name: "delete_typedescriptor",
      payload: record.signed_action.hashed.hash,
    });
    assert.ok(deleteActionHash);


    // Wait for the entry deletion to be propagated to the other node.
    await pause(300);
        
    // Bob tries to get the deleted typedescriptor
    const readDeletedOutput = await bob_holon_cell.callZome({
      zome_name: "holon",
      fn_name: "get_typedescriptor",
      payload: record.signed_action.hashed.hash,
    });
    assert.equal(readDeletedOutput, undefined);

  });
});