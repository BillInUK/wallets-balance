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
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  TokenClaimed
} from "../generated/schema"
import { BigInt, Bytes, log } from "@graphprotocol/graph-ts"
import { ReceiptWalletCreated } from "../generated/SplitWallet/SplitWallet";
import { ReceiptWallet } from "../generated/schema";
import { ERC20 as ERC20Template } from "../generated/templates";
import { Address } from "@graphprotocol/graph-ts";
import { TOKEN_WHITELIST } from "./constants";

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

  // ========== 手动创建常用代币模板 ==========
  TOKEN_WHITELIST.forEach((tokenAddr) => {
    ERC20Template.create(Address.fromString(tokenAddr));
    log.info("为白名单Token创建模板: {}", [tokenAddr]);
  });
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
  // 2. 正确获取事件参数（强类型事件对象才有params属性）
  const walletAddress = event.params.wallet.toHexString().toLowerCase(); // 确保params存在且是Address类型
  let receiptWallet = ReceiptWallet.load(walletAddress); // ReceiptWallet的id是string类型

  if (!receiptWallet) {
    receiptWallet = new ReceiptWallet(walletAddress); // id必须是string
    receiptWallet.createdBy = event.address.toHexString(); // event.address是Address类型，转string
    receiptWallet.createdAt = event.block.timestamp; // event.block是Block类型，timestamp是BigInt
    receiptWallet.save();
    log.info("收款钱包已创建：{}", [walletAddress]);
  }
}