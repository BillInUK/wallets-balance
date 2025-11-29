import {
  ClaimETH as ClaimETHEvent,
  Deployed as DeployedEvent,
  ERC20PaymentReleased as ERC20PaymentReleasedEvent,
  ERC20TokensReleased as ERC20TokensReleasedEvent,
  Initialized as InitializedEvent,
  PayeeAdded as PayeeAddedEvent,
  PaymentReceived as PaymentReceivedEvent,
  PaymentReleased as PaymentReleasedEvent,
  ReceiptWalletCreated as ReceiptWalletCreatedEvent,
  RoleAdminChanged as RoleAdminChangedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
  TokenClaimed as TokenClaimedEvent
} from "../generated/SplitWallet/SplitWallet"
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
} from "../generated/schema"
import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import { SplitWallet, ReceiptWallet } from "../generated/schema";

export function handleClaimETH(event: ClaimETHEvent): void {
  let entity = new ClaimETH(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.totalClaimed = event.params.totalClaimed
  entity.walletCount = event.params.walletCount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDeployed(event: DeployedEvent): void {
  let entity = new Deployed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.serviceType = event.params.serviceType
  entity.subServiceType = event.params.subServiceType
  entity.majorVersion = event.params.majorVersion
  entity.minorVersion = event.params.minorVersion

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleERC20PaymentReleased(
  event: ERC20PaymentReleasedEvent
): void {
  let entity = new ERC20PaymentReleased(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.to = event.params.to
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleERC20TokensReleased(
  event: ERC20TokensReleasedEvent
): void {
  let entity = new ERC20TokensReleased(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account
  entity.tokens = changetype<Bytes[]>(event.params.tokens)
  entity.amounts = event.params.amounts

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePayeeAdded(event: PayeeAddedEvent): void {
  let entity = new PayeeAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account
  entity.withdrawAddress = event.params.withdrawAddress
  entity.shares = event.params.shares

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePaymentReceived(event: PaymentReceivedEvent): void {
  let entity = new PaymentReceived(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePaymentReleased(event: PaymentReleasedEvent): void {
  let entity = new PaymentReleased(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.to = event.params.to
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleAdminChanged(event: RoleAdminChangedEvent): void {
  let entity = new RoleAdminChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.role = event.params.role
  entity.previousAdminRole = event.params.previousAdminRole
  entity.newAdminRole = event.params.newAdminRole

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
  let entity = new RoleGranted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  let entity = new RoleRevoked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokenClaimed(event: TokenClaimedEvent): void {
  let entity = new TokenClaimed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokens = changetype<Bytes[]>(event.params.tokens)
  entity.totalClaimed = event.params.totalClaimed
  entity.walletsProcessed = event.params.walletsProcessed

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleReceiptWalletCreated(event: ReceiptWalletCreated): void {
  // 以钱包地址为ID创建实体
  const walletAddress = event.params.wallet.toHexString()
  let receiptWallet = ReceiptWallet.load(walletAddress)
  
  if (!receiptWallet) {
    receiptWallet = new ReceiptWallet(walletAddress)
    receiptWallet.createdBy = event.address // 记录创建它的SplitWallet合约地址
    receiptWallet.createdAt = event.block.timestamp // 记录创建时间
    receiptWallet.save()
  }
}