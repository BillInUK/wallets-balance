import { BigInt, log } from "@graphprotocol/graph-ts"
import {
  Approval as ApprovalEvent,
  RoleAdminChanged as RoleAdminChangedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
  Transfer as TransferEvent,
} from "../generated/MockUSDC/MockUSDC"
import {
  Approval,
  ReceiptWallet,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  TotalBalance,
  Transfer,
} from "../generated/schema"

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

// 封装TotalBalance加载逻辑
function getOrCreateTotalBalance(): TotalBalance {
  let totalBalance = TotalBalance.load("total");
  if (!totalBalance) {
    totalBalance = new TotalBalance("total");
    totalBalance.totalUSDT = BigInt.zero();
    totalBalance.totalUSDC = BigInt.zero();
  }
  return totalBalance;
}

// USDT Transfer事件处理器
export function handleUsdcTransfer(event: TransferEvent): void {
  log.info("MockUSDC Transfer: to={}, from={}, value={}", [
    event.params.to.toHex(),
    event.params.from.toHex(),
    event.params.value.toString()
  ]);

  const totalBalance = getOrCreateTotalBalance();
  const value = event.params.value;

  // 处理转入
  const toWalletId = event.params.to.toHex();
  let receiptWallet = ReceiptWallet.load(toWalletId);
  if (receiptWallet) {
    receiptWallet.usdcBalance = receiptWallet.usdcBalance.plus(value);
    receiptWallet.save();
    log.info("Updated USDC balance for TO {}: {}", [toWalletId, receiptWallet.usdcBalance.toString()]);
    totalBalance.totalUSDC = totalBalance.totalUSDC.plus(value);
  }

  // 处理转出（防负数）
  const fromWalletId = event.params.from.toHex();
  receiptWallet = ReceiptWallet.load(fromWalletId);
  if (receiptWallet) {
    receiptWallet.usdcBalance = receiptWallet.usdcBalance.minus(value);
    receiptWallet.save();
    log.info("Updated USDC balance for FROM {}: {}", [fromWalletId, receiptWallet.usdcBalance.toString()]);
    
    const newtotalUSDC = totalBalance.totalUSDC.minus(value);
    totalBalance.totalUSDC = newtotalUSDC < BigInt.zero() ? BigInt.zero() : newtotalUSDC;
  }

  totalBalance.save();
}

