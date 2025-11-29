import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { Transfer as ERC20TransferEvent } from "../generated/templates/ERC20/ERC20"; // 重命名事件类型
import { ERC20 } from "../generated/templates/ERC20/ERC20"; // 合约类
import { Transfer, ReceiptWallet, ERC20Token, ERC20Balance, TokenTotal } from "../generated/schema"; // schema实体
import { TOKEN_WHITELIST } from "./constants";

export function handleTransfer(event: ERC20TransferEvent): void {
  const tokenAddress = event.address.toHexString().toLowerCase();
  
  // ========== 1. 过滤非白名单Token ==========
  if (!TOKEN_WHITELIST.includes(tokenAddress)) {
    log.info("忽略非白名单Token：{}", [tokenAddress]);
    return; // 直接返回，不处理
  }

  const fromAddress = event.params.from;
  const toAddress = event.params.to;
  const value = event.params.value;

  // ========== 2. 检查是否涉及收款钱包（转入/转出） ==========
  const toWalletId = toAddress.toHexString().toLowerCase();
  const fromWalletId = fromAddress.toHexString().toLowerCase();
  const toWallet = ReceiptWallet.load(toWalletId);
  const fromWallet = ReceiptWallet.load(fromWalletId);

  // 既不是转入也不是转出收款钱包，直接返回
  if (!toWallet && !fromWallet) {
    log.info("Transfer不涉及收款钱包，忽略：from={}, to={}", [fromWalletId, toWalletId]);
    return;
  }

  // ========== 3. 更新收款钱包余额 ==========
  if (toWallet) {
    updateWalletBalance(toWalletId, tokenAddress, value);
    log.info("更新收款钱包{}的{}余额：+{}", [toWalletId, tokenAddress, value.toString()]);
  }

  if (fromWallet) {
    updateWalletBalance(fromWalletId, tokenAddress, value.neg());
    log.info("更新收款钱包{}的{}余额：-{}", [fromWalletId, tokenAddress, value.toString()]);
  }
}

function updateWalletBalance(walletAddress: string, tokenAddress: string, delta: BigInt): void {
  const balanceId = `${walletAddress}-${tokenAddress}`;
  let balance = ERC20Balance.load(balanceId);

  if (!balance) {
    balance = new ERC20Balance(balanceId);
    balance.wallet = walletAddress; // 关联ReceiptWallet实体
    balance.token = tokenAddress;   // 关联ERC20Token实体
    balance.balance = BigInt.fromI32(0); // 初始余额为0

    // 仅创建ERC20Token实体（不重复创建模板）
    let token = ERC20Token.load(tokenAddress);
    if (!token) {
      token = new ERC20Token(tokenAddress);
      const erc20Contract = ERC20.bind(Address.fromString(tokenAddress));
      
      const nameResult = erc20Contract.try_name();
      if (!nameResult.reverted) token.name = nameResult.value;

      const symbolResult = erc20Contract.try_symbol();
      if (!symbolResult.reverted) token.symbol = symbolResult.value;

      const decimalsResult = erc20Contract.try_decimals();
      if (!decimalsResult.reverted) token.decimals = decimalsResult.value;

      token.save();
    }
  }

  // delta为正：转入；delta为负：转出，自动处理加减
  balance.balance = balance.balance.plus(delta);
  balance.save();

  // 同步更新Token总余额
  updateTokenTotalBalance(tokenAddress, delta);
}

// 同步更新Token总余额
function updateTokenTotalBalance(tokenAddress: string, delta: BigInt): void {
  let tokenTotal = TokenTotal.load(tokenAddress);
  if (!tokenTotal) {
    tokenTotal = new TokenTotal(tokenAddress);
    tokenTotal.token = tokenAddress;
    tokenTotal.totalBalance = BigInt.fromI32(0);
  }
  tokenTotal.totalBalance = tokenTotal.totalBalance.plus(delta);
  tokenTotal.save();
}