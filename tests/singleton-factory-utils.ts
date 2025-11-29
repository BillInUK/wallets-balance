import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes } from "@graphprotocol/graph-ts"
import { Deployed } from "../generated/SingletonFactory/SingletonFactory"

export function createDeployedEvent(
  createdContract: Address,
  salt: Bytes
): Deployed {
  let deployedEvent = changetype<Deployed>(newMockEvent())

  deployedEvent.parameters = new Array()

  deployedEvent.parameters.push(
    new ethereum.EventParam(
      "createdContract",
      ethereum.Value.fromAddress(createdContract)
    )
  )
  deployedEvent.parameters.push(
    new ethereum.EventParam("salt", ethereum.Value.fromFixedBytes(salt))
  )

  return deployedEvent
}
