import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CounterProgram } from "../target/types/counter_program";
import { Keypair, SystemProgram } from "@solana/web3.js";
import assert from "assert";

describe("counter-program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.AnchorProvider.env();
  const program = anchor.workspace.CounterProgram as Program<CounterProgram>;

  // create counter keypair
  let counter = Keypair.generate();

  it("Create Counter account!", async () => {
    const tx = await program.methods
      .create()
      .accounts({
        counter: counter.publicKey,
        authority: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([counter])
      .rpc();
    console.log("Your transaction signature", tx);
  });

  it("Increment Counter account!", async () => {
    const tx = await program.methods
      .increment()
      .accounts({
        counter: counter.publicKey,
        authority: provider.wallet.publicKey,
      })
      .rpc();
    const counterAccount = await program.account.counter.fetch(
      counter.publicKey
    );
    assert.ok(counterAccount.count === 1);
    console.log("Your transaction signature", tx);
  });

  it("Decrement Counter account!", async () => {
    const tx = await program.methods
      .decrement()
      .accounts({
        counter: counter.publicKey,
        authority: provider.wallet.publicKey,
      })
      .rpc();
    const counterAccount = await program.account.counter.fetch(
      counter.publicKey
    );
    assert.ok(counterAccount.count === 0);
    console.log("Your transaction signature", tx);
  });
});
