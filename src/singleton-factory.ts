import { Deployed as SingletonDeployedEvent } from "../generated/SingletonFactory/SingletonFactory"
import { SplitWallet } from "../generated/SplitWallet/SplitWallet"
import { SplitWallet as SplitWalletContract } from "../generated/SingletonFactory/SplitWallet"
import { SplitWalletInstance } from "../generated/schema"
import { SplitWallet as SplitWalletTemplate } from "../generated/templates";
import { Address } from "@graphprotocol/graph-ts"

export function handleSingletonDeployed(event: SingletonDeployedEvent): void {
  const newContractAddress = event.params.createdContract // 新部署的合约地址
  const deployedBy = event.address.toHex() // SingletonFactory地址

  //验证新部署的合约是否为SplitWalletLogic（通过调用其特征函数判断）
  const splitWalletContract = SplitWalletContract.bind(newContractAddress)
  //验证合约的函数是否存在
  const tryVersion = splitWalletContract.try_receiptWalletLogic() 
  if (tryVersion.reverted) {
    // 非SplitWalletLogic合约，跳过
    return
  }
  
  // 动态创建该SplitWallet合约的监听（基于模板）
  SplitWalletTemplate.create(newContractAddress)

  // 创建SplitWalletInstance实体（暂存基础信息，后续会被其自身Deployed事件补充）
  const instance = new SplitWalletInstance(newContractAddress.toHex())
  instance.deployedAt = event.block.timestamp
  instance.deployedBy = deployedBy
  // 版本信息先默认，等待SplitWallet自身Deployed事件更新
  instance.serviceType = 0
  instance.subServiceType = 0
  instance.majorVersion = 0
  instance.minorVersion = 0
  instance.save()
}