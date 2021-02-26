import {TonClient} from "@tonclient/core";
import {libWeb, libWebSetup} from "@tonclient/lib-web";
import semver from "semver";
import freeton from "freeton";
import BigNumber from "bignumber.js";

libWebSetup({
  binaryURL: "/tonclient_1.5.3.wasm",
});
TonClient.useBinaryLibrary(libWeb);

const _ = {
  client: null,
  clientServer: null,
  provider: null,
  async getClient(server) {
    if (null === this.client || server !== this.clientServer) {
      this.clientServer = server;
      this.client = new TonClient({
        network: {
          server_address: server
        }
      });
    }
    return this.client;
  },
  getProvider() {
    if (typeof window.freeton === 'undefined') {
      throw 'Extension is not available';
    }
    if (null === this.provider) {
      this.provider = new freeton.providers.ExtensionProvider(window.freeton);
    }
    return this.provider;
  },
  async queryAddress(server, address) {
    const client = await this.getClient(server);
    const result = await client.net.query_collection({
      collection: 'accounts',
      filter: {id: {eq: address}},
      result: 'id, boc, acc_type, balance(format: DEC)',
    });
    return result.result;
  }
};

export default {
  convertFromNanoToView(amountNano) {
    return new BigNumber(amountNano).dividedBy(new BigNumber('1000000000')).toFormat();
  },
  convertToNano(amount) {
    return ((new BigNumber(amount)).multipliedBy(new BigNumber('1000000000'))).toString();
  },
  async findAddressData(server, address) {
    const result = await _.queryAddress(server, address);
    return result[0] || null;
  },
  async encodeGetMessage(server, abi, address, function_name, input = {}) {
    const client = await _.getClient(server);
    const signer = {type: 'None'};
    const call_set = {function_name, input};
    return await client.abi.encode_message({abi, address, call_set, signer});
  },
  async encodeMessageBody(abi, function_name, input = {}) {
    const client = await _.getClient();
    const signer = {type: 'None'};
    const call_set = {function_name, input};
    return await client.abi.encode_message_body({abi, call_set, signer, is_internal: true});
  },
  async runTvm(server, abi, boc, message) {
    const client = await _.getClient(server);
    // @TODO by doc if pass abi then run_tvm should decode message, but it doesn't occur.
    const resultOfRunTvm = await client.tvm.run_tvm({message, account: boc});
    const result = await client.abi.decode_message({abi, message: resultOfRunTvm.out_messages[0]});
    return result.value;
  },
  isExtensionAvailable() {
    return typeof window.freeton !== 'undefined';
  },
  async isExtensionAvailableWithMinimalVersion() {
    return new Promise(resolve => {
      if (!this.isExtensionAvailable()) {
        resolve(false);
      }
      const provider = _.getProvider();
      provider.getVersion().then(data => {
        const currentVersion = data.version || '0.0.0';
        resolve(semver.satisfies(currentVersion, '>=0.7.0'));
      }).catch(() => {
        resolve(false);
      });
    });
  },
  async getNetwork() {
    const provider = _.getProvider();
    return await provider.getNetwork();
  },
}
