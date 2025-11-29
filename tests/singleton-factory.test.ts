import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, Bytes } from "@graphprotocol/graph-ts"
import { Deployed } from "../generated/schema"
import { Deployed as DeployedEvent } from "../generated/SingletonFactory/SingletonFactory"
import { handleDeployed } from "../src/singleton-factory"
import { createDeployedEvent } from "./singleton-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let createdContract = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let salt = Bytes.fromI32(1234567890)
    let newDeployedEvent = createDeployedEvent(createdContract, salt)
    handleDeployed(newDeployedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("Deployed created and stored", () => {
    assert.entityCount("Deployed", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "Deployed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "createdContract",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "Deployed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "salt",
      "1234567890"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
