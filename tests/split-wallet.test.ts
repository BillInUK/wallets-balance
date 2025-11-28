import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import { ClaimETH } from "../generated/schema"
import { ClaimETH as ClaimETHEvent } from "../generated/SplitWallet/SplitWallet"
import { handleClaimETH } from "../src/split-wallet"
import { createClaimETHEvent } from "./split-wallet-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let totalClaimed = BigInt.fromI32(234)
    let walletCount = BigInt.fromI32(234)
    let newClaimETHEvent = createClaimETHEvent(totalClaimed, walletCount)
    handleClaimETH(newClaimETHEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("ClaimETH created and stored", () => {
    assert.entityCount("ClaimETH", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ClaimETH",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "totalClaimed",
      "234"
    )
    assert.fieldEquals(
      "ClaimETH",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "walletCount",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
