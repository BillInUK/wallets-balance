import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import {
  ClaimETH,
  Deployed,
  ERC20PaymentReleased,
  ERC20TokensReleased,
  Initialized,
  PayeeAdded,
  PaymentReceived,
  PaymentReleased,
  ReceiptWalletCreated,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  TokenClaimed
} from "../generated/SplitWallet/SplitWallet"

export function createClaimETHEvent(
  totalClaimed: BigInt,
  walletCount: BigInt
): ClaimETH {
  let claimEthEvent = changetype<ClaimETH>(newMockEvent())

  claimEthEvent.parameters = new Array()

  claimEthEvent.parameters.push(
    new ethereum.EventParam(
      "totalClaimed",
      ethereum.Value.fromUnsignedBigInt(totalClaimed)
    )
  )
  claimEthEvent.parameters.push(
    new ethereum.EventParam(
      "walletCount",
      ethereum.Value.fromUnsignedBigInt(walletCount)
    )
  )

  return claimEthEvent
}

export function createDeployedEvent(
  serviceType: i32,
  subServiceType: i32,
  majorVersion: i32,
  minorVersion: i32
): Deployed {
  let deployedEvent = changetype<Deployed>(newMockEvent())

  deployedEvent.parameters = new Array()

  deployedEvent.parameters.push(
    new ethereum.EventParam(
      "serviceType",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(serviceType))
    )
  )
  deployedEvent.parameters.push(
    new ethereum.EventParam(
      "subServiceType",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(subServiceType))
    )
  )
  deployedEvent.parameters.push(
    new ethereum.EventParam(
      "majorVersion",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(majorVersion))
    )
  )
  deployedEvent.parameters.push(
    new ethereum.EventParam(
      "minorVersion",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(minorVersion))
    )
  )

  return deployedEvent
}

export function createERC20PaymentReleasedEvent(
  token: Address,
  to: Address,
  amount: BigInt
): ERC20PaymentReleased {
  let erc20PaymentReleasedEvent =
    changetype<ERC20PaymentReleased>(newMockEvent())

  erc20PaymentReleasedEvent.parameters = new Array()

  erc20PaymentReleasedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  erc20PaymentReleasedEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  erc20PaymentReleasedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return erc20PaymentReleasedEvent
}

export function createERC20TokensReleasedEvent(
  account: Address,
  tokens: Array<Address>,
  amounts: Array<BigInt>
): ERC20TokensReleased {
  let erc20TokensReleasedEvent = changetype<ERC20TokensReleased>(newMockEvent())

  erc20TokensReleasedEvent.parameters = new Array()

  erc20TokensReleasedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  erc20TokensReleasedEvent.parameters.push(
    new ethereum.EventParam("tokens", ethereum.Value.fromAddressArray(tokens))
  )
  erc20TokensReleasedEvent.parameters.push(
    new ethereum.EventParam(
      "amounts",
      ethereum.Value.fromUnsignedBigIntArray(amounts)
    )
  )

  return erc20TokensReleasedEvent
}

export function createInitializedEvent(version: i32): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return initializedEvent
}

export function createPayeeAddedEvent(
  account: Address,
  withdrawAddress: Address,
  shares: BigInt
): PayeeAdded {
  let payeeAddedEvent = changetype<PayeeAdded>(newMockEvent())

  payeeAddedEvent.parameters = new Array()

  payeeAddedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  payeeAddedEvent.parameters.push(
    new ethereum.EventParam(
      "withdrawAddress",
      ethereum.Value.fromAddress(withdrawAddress)
    )
  )
  payeeAddedEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return payeeAddedEvent
}

export function createPaymentReceivedEvent(
  from: Address,
  amount: BigInt
): PaymentReceived {
  let paymentReceivedEvent = changetype<PaymentReceived>(newMockEvent())

  paymentReceivedEvent.parameters = new Array()

  paymentReceivedEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  paymentReceivedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return paymentReceivedEvent
}

export function createPaymentReleasedEvent(
  to: Address,
  amount: BigInt
): PaymentReleased {
  let paymentReleasedEvent = changetype<PaymentReleased>(newMockEvent())

  paymentReleasedEvent.parameters = new Array()

  paymentReleasedEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  paymentReleasedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return paymentReleasedEvent
}

export function createReceiptWalletCreatedEvent(
  wallet: Address
): ReceiptWalletCreated {
  let receiptWalletCreatedEvent =
    changetype<ReceiptWalletCreated>(newMockEvent())

  receiptWalletCreatedEvent.parameters = new Array()

  receiptWalletCreatedEvent.parameters.push(
    new ethereum.EventParam("wallet", ethereum.Value.fromAddress(wallet))
  )

  return receiptWalletCreatedEvent
}

export function createRoleAdminChangedEvent(
  role: Bytes,
  previousAdminRole: Bytes,
  newAdminRole: Bytes
): RoleAdminChanged {
  let roleAdminChangedEvent = changetype<RoleAdminChanged>(newMockEvent())

  roleAdminChangedEvent.parameters = new Array()

  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdminRole",
      ethereum.Value.fromFixedBytes(previousAdminRole)
    )
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newAdminRole",
      ethereum.Value.fromFixedBytes(newAdminRole)
    )
  )

  return roleAdminChangedEvent
}

export function createRoleGrantedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleGranted {
  let roleGrantedEvent = changetype<RoleGranted>(newMockEvent())

  roleGrantedEvent.parameters = new Array()

  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleGrantedEvent
}

export function createRoleRevokedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleRevoked {
  let roleRevokedEvent = changetype<RoleRevoked>(newMockEvent())

  roleRevokedEvent.parameters = new Array()

  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleRevokedEvent
}

export function createTokenClaimedEvent(
  tokens: Array<Address>,
  totalClaimed: Array<BigInt>,
  walletsProcessed: BigInt
): TokenClaimed {
  let tokenClaimedEvent = changetype<TokenClaimed>(newMockEvent())

  tokenClaimedEvent.parameters = new Array()

  tokenClaimedEvent.parameters.push(
    new ethereum.EventParam("tokens", ethereum.Value.fromAddressArray(tokens))
  )
  tokenClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "totalClaimed",
      ethereum.Value.fromUnsignedBigIntArray(totalClaimed)
    )
  )
  tokenClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "walletsProcessed",
      ethereum.Value.fromUnsignedBigInt(walletsProcessed)
    )
  )

  return tokenClaimedEvent
}
