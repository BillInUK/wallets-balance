import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { Transfer as ERC20TransferEvent } from "../generated/templates/ERC20/ERC20"; // 重命名事件类型
import { ERC20 } from "../generated/templates/ERC20/ERC20"; // 合约类
import { ERC20 as ERC20Template } from "../generated/templates"; // 模板类型
import { Transfer, ReceiptWallet, ERC20Token, ERC20Balance } from "../generated/schema"; // schema实体

export function handleTransfer(event: ERC20TransferEvent): void {
  const tokenAddress = event.address.toHexString().toLowerCase();
  const fromAddress = event.params.from;
  const toAddress = event.params.to;
  const value = event.params.value;

  // 创建Transfer实体（schema定义的）
  const transferId = `${tokenAddress}-${event.block.number.toString()}-${event.logIndex.toString()}`;
  let transferEntity = Transfer.load(transferId);
  if (!transferEntity) {
    transferEntity = new Transfer(transferId);
    transferEntity.from = fromAddress;
    transferEntity.to = toAddress;
    transferEntity.value = value;
    transferEntity.token = tokenAddress; // 关联ERC20Token实体的id
    transferEntity.blockNumber = event.block.number;
    transferEntity.blockTimestamp = event.block.timestamp;
    transferEntity.transactionHash = event.transaction.hash;
    transferEntity.save();
  }

  // 处理转入钱包的余额
  const toWalletId = toAddress.toHexString().toLowerCase();
  const toWallet = ReceiptWallet.load(toWalletId);
  if (toWallet) {
    updateWalletBalance(toWalletId, tokenAddress, value);
  }

  // 处理转出钱包的余额
  const fromWalletId = fromAddress.toHexString().toLowerCase();
  const fromWallet = ReceiptWallet.load(fromWalletId);
  if (fromWallet) {
    updateWalletBalance(fromWalletId, tokenAddress, value.neg());
  }
}

function updateWalletBalance(walletAddress: string, tokenAddress: string, delta: BigInt): void {
  const balanceId = `${walletAddress}-${tokenAddress}`;
  let balance = ERC20Balance.load(balanceId);

  if (!balance) {
    balance = new ERC20Balance(balanceId);
    balance.wallet = walletAddress; // 关联ReceiptWallet实体的id
    balance.token = tokenAddress;   // 关联ERC20Token实体的id
    balance.balance = BigInt.fromI32(0);

    // 创建ERC20Token实体（如果不存在）
    let token = ERC20Token.load(tokenAddress);
    if (!token) {
      token = new ERC20Token(tokenAddress);
      const erc20Contract = ERC20.bind(Address.fromString(tokenAddress));
      
      const nameResult = erc20Contract.try_name();
      if (!nameResult.reverted) {
        token.name = nameResult.value;
      }

      const symbolResult = erc20Contract.try_symbol();
      if (!symbolResult.reverted) {
        token.symbol = symbolResult.value;
      }

      const decimalsResult = erc20Contract.try_decimals();
      if (!decimalsResult.reverted) {
        token.decimals = decimalsResult.value;
      }

      token.save();
      // 创建ERC20模板数据源
      ERC20Template.create(Address.fromString(tokenAddress));
    }
  }

  // 更新余额
  balance.balance = balance.balance.plus(delta);
  balance.save();
}