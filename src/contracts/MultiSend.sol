pragma solidity >= 0.6.0;

library Errors {
    uint8 constant IS_NOT_OWNER = 101;
    uint8 constant CONSTRUCTOR_NO_PUBKEY = 102;
    uint8 constant ADDRESSES_QT_DOES_NOT_MATCH_AMOUNT = 103;
    uint8 constant WRONG_QUANTITY = 104;
    uint8 constant WRONG_AMOUNT = 105;
    uint8 constant DESTROYING_LOCKED = 106;
    uint8 constant LACK_OF_GAS = 107;
}

contract MultiSend {
    uint static public rand;
    Data data;

    struct Data {
        address[] addresses;
        uint128[] amounts;
        uint128 total;
        address refundAddr;
        uint64 destroyLockTs;
    }

    constructor(address[] addresses, uint128[] amounts, address refundAddr) public {
        require(msg.pubkey() == tvm.pubkey(), Errors.IS_NOT_OWNER);
        require(tvm.pubkey() != 0, Errors.CONSTRUCTOR_NO_PUBKEY);
        require(addresses.length == amounts.length, Errors.ADDRESSES_QT_DOES_NOT_MATCH_AMOUNT);
        require((addresses.length > 1) && (addresses.length < 101), Errors.WRONG_QUANTITY);

        tvm.accept();

        data.addresses = addresses;
        data.amounts = amounts;
        data.total = 0;
        data.refundAddr = refundAddr;
        data.destroyLockTs = now + 10800;
        for (uint i = 0; i < amounts.length; i++) {
            data.total += amounts[i];
        }
    }

    function getData() public view returns (Data) {
        return data;
    }

    function sendAndDestroy() public {
        require(msg.value == data.total, Errors.WRONG_AMOUNT);
        require((address(this).balance - msg.value) / data.addresses.length > 7_000_000, Errors.LACK_OF_GAS);

        tvm.accept();

        for (uint i = 0; i < data.addresses.length; i++) {
            payable(data.addresses[i]).transfer(data.amounts[i], false, 1);
        }

        selfdestruct(data.refundAddr);
    }

    function destroy() public {
        require(now > data.destroyLockTs, Errors.DESTROYING_LOCKED);

        tvm.accept();

        selfdestruct(data.refundAddr);
    }

    function replenish() public pure {}

    receive() external pure {
        if (msg.sender != address(this)) {
            _returnChange();
        }
    }

    fallback() external pure {
        if (msg.sender != address(this)) {
            _returnChange();
        }
    }

    function _returnChange() private pure {
        msg.sender.transfer(0, false, 64);
    }
}
