import { Transfer } from "../generated/templates/ERC20/ERC20"
import { ReceiptWallet, ERC20Token, ERC20Balance } from "../generated/schema"
import { ERC20 } from "../generated/templates"
import { Address, BigInt } from "@graphprotocol/graph-ts"

export function handleTransfer(event: Transfer): void {
  const tokenAddress = event.address.toHexString()
  const fromAddress = event.params.from.toHexString()
  const toAddress = event.params.to.toHexString()
  const value = event.params.value

  // 检查转入地址是否为收款钱包，若是则增加余额
  const toWallet = ReceiptWallet.load(toAddress)
  if (toWallet) {
    updateWalletBalance(toAddress, tokenAddress, value)
  }

  // 检查转出地址是否为收款钱包，若是则减少余额
  const fromWallet = ReceiptWallet.load(fromAddress)
  if (fromWallet) {
    updateWalletBalance(fromAddress, tokenAddress, value.neg()) // 负数表示减少
  }
}

// 更新钱包在某代币中的余额
function updateWalletBalance(walletAddress: string, tokenAddress: string, delta: BigInt): void {
  // 生成唯一ID（钱包地址+代币地址）
  const balanceId = `${walletAddress}-${tokenAddress}`
  let balance = ERC20Balance.load(balanceId)

  // 若余额记录不存在，则初始化
  if (!balance) {
    balance = new ERC20Balance(balanceId)
    balance.wallet = walletAddress
    balance.token = tokenAddress
    balance.balance = BigInt.fromI32(0) // 初始余额为0

    // 若代币信息不存在，则创建并初始化（名称、符号等）
    let token = ERC20Token.load(tokenAddress)
    if (!token) {
      token = new ERC20Token(tokenAddress)
      // 调用合约获取代币元数据（使用try_避免非标准代币报错）
      const erc20Contract = ERC20.bind(Address.fromString(tokenAddress))
      
      const nameResult = erc20Contract.try_name()
      if (!nameResult.reverted) token.name = nameResult.value

      const symbolResult = erc20Contract.try_symbol()
      if (!symbolResult.reverted) token.symbol = symbolResult.value

      const decimalsResult = erc20Contract.try_decimals()
      if (!decimalsResult.reverted) token.decimals = decimalsResult.value

      token.save()

      // 动态创建该代币的数据源，用于监听后续事件
      ERC20.create(Address.fromString(tokenAddress))
    }
  }

  // 更新余额（支持增减）
  balance.balance = balance.balance.plus(delta)
  balance.save()
}