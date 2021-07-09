import ton from '@/lib/ton';
import abi from '@/contracts/MultiSend.abi.json';
import freeton from 'freeton';

const multiSendImageBase64 = "te6ccgECIgEABYYAAgE0AwEBAcACAEPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAib/APSkICLAAZL0oOGK7VNYMPShDAQBCvSkIPShBQIDzkAHBgBn32omhp/+mf6YBp/+qY6Y/6Aiy3gQDpj/oCLLeBAOm//SBrhZ+3gvw1/DU//DD8M3wx/DFAIBWAsIAgEgCgkAfT4QsjL//hDzws/+EbPCwD4SvhLAsv/AW8lyCVvIlnPCx/0ACRvIlnPCx/0ACPPC38izxYhzws/BV8FzcntVIAApPhJyM+FCM6Abc9Az4HPgcmAQPsAgAB1fhJ+CjHBZLwBt+S8AfegCASAQDQHG/3+NCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT4aSHtRNAg10nCAY4w0//TP9MA0//VMdMf9ARZbwIB0x/0BFlvAgHTf/pA1ws/bwX4a/hqf/hh+Gb4Y/hiDgHujln0BXEhgED0DpPXC/+RcOL4anBtbwJwbW8CcI0IYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABHBvBfhrcAGAQPQO8r3XC//4YnD4Y3D4Zn/4YeLTAAGOEoECANcYIPkBWPhCIPhl+RDyqN7TPwEPAISOHvhDIbkgnzAg+COBA+iogggbd0Cgud6S+GPggDTyNNjTHyHBAyKCEP////28sZZbcfAB8AXgAfAB+EdukzDwBd4CASAVEQICcRMSAF+1GDxX+AR8JWRF7gAAAAAAAAAAAAAAABBni2fA58DnyZxg8V8Q54X/5Lj9gD/8M8ABobVbdtJ8ILdJeARvaLg0U32wSrRTfzAY7/wlt4ldeXA0/BO3iDg0U32wSrRTfzAY79Dav/wlt4g3iFSCQQQ1Z+BeeXA1/AA4TBB8JbeIN4hcwBQAxI4yIPhLbxFvEYAg9A7ystcLfyH4S28QbxGAIPQO8rLIz4UIzgH6AoBpz0DPgc+ByXH7AKToMPhLbxPIz4UIzo0DyA+gAAAAAAAAAAAAAAAAAc8Wz4HPgcmBAKD7APAHf/hnAgEgHRYCASAcFwEPuIXltP8ILdAYAvSOgN74RvJzcfhm0x/0BFlvAgHTH/QEWW8CAfpA0fhFIG6SMHDe+EK68uBl+ELDAPLgZiJvECJvELry4GcibxDCASCWMCJvEMFl3vLgaPgA+Esjb1D4a/hLIm9R+Gv4S3BvUvhr+Eshb1P4a/hL+COBKjCgtR9vVPhrcBoZAFiVICNvELmOGyAjbxGAIPQO8rLXC3/4SyBvEligtX9vUvhrpOgwXwPwB3/4ZwF07UTQINdJwgGOMNP/0z/TANP/1THTH/QEWW8CAdMf9ARZbwIB03/6QNcLP28F+Gv4an/4Yfhm+GP4YhsAuI5Z9AVxIYBA9A6T1wv/kXDi+GpwbW8CcG1vAnCNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARwbwX4a3ABgED0DvK91wv/+GJw+GNw+GZ/+GHiAIm4sLskfwgt0l4BG9o/BH8JbeKXnlwNXwAfCW3ieRnwoRnRoHkB9AAAAAAAAAAAAAAAAAA54tnwOfA5MCAUH2AeAO//DPACASAfHgAZuEh9KjoyXgD7z/8M8AIBICEgAL22hnXTfhBbpLwCN7R+EshwP+OQiPQ0wH6QDAxyM+HIM6AYM9Az4HPgc+SKGddNiFvJVUEJW8iAssf9AAkbyICyx/0ACPPC38izxYhzws/BV8FyXH7AN4wkvAH3n/4Z4ACe23Ai0NMD+kAw+GmpOADcIccAIJwwIdMfIcAAIJJsId7fnXHwAfhJ+CjHBZLwBt/gIcEDIoIQ/////byxlltx8AHwBeAB8AH4R26TMPAF3g==";
const _ = {
  getProvider() {
    return new freeton.providers.ExtensionProvider(window.freeton);
  }
}

export default {
  async deploy(payees, refundAddr) {
    const provider = _.getProvider();
    const signer = await provider.getSigner();
    const contractBuilder = new freeton.ContractBuilder(signer, abi.value, multiSendImageBase64);
    contractBuilder.setInitialAmount('1000000000');
    const rand = '0x' + Math.random().toString(16).substr(2);
    contractBuilder.setInitialParams({rand});
    const constructorParams = {
      addresses: payees.map(a => a.address),
      amounts: payees.map(a => a.amount),
      refundAddr,
    };
    const contract = await contractBuilder.deploy(constructorParams);
    await contract.getDeployProcessing().wait();

    return contract;
  },
  async findAddressData(server, address) {
    return await ton.findAddressData(server, address);
  },
  async findData(server, addressData) {
    const message = await ton.encodeGetMessage(server, abi, addressData.id, 'getData');
    return await ton.runTvm(server, abi, addressData.boc, message.message);
  },
  async checkNetwork(server) {
    const provider = _.getProvider();
    const network = await provider.getNetwork();
    let neededNetworkId;
    switch (server) {
      case 'main2.ton.dev':
        neededNetworkId = 1;
        break;
      case 'net1.ton.dev':
        neededNetworkId = 2;
        break;
      default:
        throw {text: 'Unknown network'};
    }
    if (network.id !== neededNetworkId) {
      throw {text: `Please, change network to '${server}'`};
    }
  },
  async send(address, amount){
    const provider = _.getProvider();
    const signer = await provider.getSigner();
    const wallet = signer.getWallet();
    const payload = (await ton.encodeMessageBody(abi, 'sendAndDestroy')).body;
    const contractMessageProcessing = await wallet.transfer(address, amount, true, payload);
    await contractMessageProcessing.wait();
  },
  async destroy(address) {
    const provider = _.getProvider();
    const signer = await provider.getSigner();
    const wallet = signer.getWallet();
    const payload = (await ton.encodeMessageBody(abi, 'destroy')).body;
    const contractMessageProcessing = await wallet.transfer(address, '500000000', true, payload);
    await contractMessageProcessing.wait();
  },
  async replenish(address) {
    const provider = _.getProvider();
    const signer = await provider.getSigner();
    const wallet = signer.getWallet();
    const payload = (await ton.encodeMessageBody(abi, 'replenish')).body;
    const contractMessageProcessing = await wallet.transfer(address, '1000000000', true, payload);
    await contractMessageProcessing.wait();
  }
}
