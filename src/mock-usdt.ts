import { log } from "@graphprotocol/graph-ts";
import {
  Approval as ApprovalEvent,
  RoleAdminChanged as RoleAdminChangedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
  Transfer as TransferEvent,
} from "../generated/MockUSDT/MockUSDT"
import {
  Approval,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  Transfer,
} from "../generated/schema"
import { ReceiptWallet } from "../generated/schema";

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleAdminChanged(event: RoleAdminChangedEvent): void {
  let entity = new RoleAdminChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
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
    event.transaction.hash.concatI32(event.logIndex.toI32()),
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
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

// 新增：USDT Transfer事件处理器
export function handleUsdtTransfer(event: TransferEvent): void {
  log.info("MockUSDT Transfer: to={}, value={}", [
    event.params.to.toHex(),
    event.params.value.toString()
  ]);

  // 处理转入
  const toWalletId = event.params.to.toHex();
  let receiptWallet = ReceiptWallet.load(toWalletId);
  if (receiptWallet) {
    receiptWallet.usdtBalance = receiptWallet.usdtBalance.plus(event.params.value);
    receiptWallet.save();
    log.info("Updated USDT balance for {}: {}", [toWalletId, receiptWallet.usdtBalance.toString()]);
  }

  // 处理转出
  const fromWalletId = event.params.from.toHex();
  receiptWallet = ReceiptWallet.load(fromWalletId);
  if (receiptWallet) {
    receiptWallet.usdtBalance = receiptWallet.usdtBalance.minus(event.params.value);
    receiptWallet.save();
  }
}

