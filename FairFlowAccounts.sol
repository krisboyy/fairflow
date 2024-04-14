// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Transactions {
    struct TxData{
        uint txAmt;
        address fromAddress;
        address toAddress;
        string purpose;
        uint timestamp;
    }

    TxData[] public transactions;

    function addTransaction(uint amt, address to, string memory purpose) public {
        TxData memory transaction = TxData(amt, msg.sender, to, purpose, block.timestamp);
        transactions.push(transaction);
    }

}