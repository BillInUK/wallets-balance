import { Transfer } from "../generated/templates/ERC20/ERC20"; // 事件也从合约类型导入
import { ReceiptWallet, ERC20Token, ERC20Balance } from "../generated/schema";
import { ERC20 } from "../generated/templates/ERC20/ERC20"; // ABI合约类
import { ERC20 as ERC20Template } from "../generated/templates"; // 模板类型
import { Address, BigInt } from "@graphprotocol/graph-ts";

export function handleTransfer(event: Transfer): void {
  const tokenAddress = event.address.toHexString();
  const fromAddress = event.params.from.toHexString();
  const toAddress = event.params.to.toHexString();
  const value = event.params.value;

  // 检查转入地址是否为收款钱包
  const toWallet = ReceiptWallet.load(toAddress);
  if (toWallet) {
    updateWalletBalance(toAddress, tokenAddress, value);
  }

  // 检查转出地址是否为收款钱包
  const fromWallet = ReceiptWallet.load(fromAddress);
  if (fromWallet) {
    updateWalletBalance(fromAddress, tokenAddress, value.neg());
  }
}

function updateWalletBalance(walletAddress: string, tokenAddress: string, delta: BigInt): void {
  const balanceId = `${walletAddress}-${tokenAddress}`;
  let balance = ERC20Balance.load(balanceId);

  if (!balance) {
    balance = new ERC20Balance(balanceId);
    balance.wallet = walletAddress;
    balance.token = tokenAddress;
    balance.balance = BigInt.fromI32(0);

    let token = ERC20Token.load(tokenAddress);
    if (!token) {
      token = new ERC20Token(tokenAddress);
      
      // 正确绑定ERC20合约（使用ABI生成的合约类）
      const erc20Contract = ERC20.bind(Address.fromString(tokenAddress));
      
      // 安全调用合约函数（try_前缀避免报错）
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

      // 使用模板类型创建动态数据源（关键！之前混用了合约类和模板）
      ERC20Template.create(Address.fromString(tokenAddress));
    }
  }

  balance.balance = balance.balance.plus(delta);
  balance.save();
}