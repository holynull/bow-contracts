import { expect, assert } from 'chai';
// const chai = require("chai");
// const chaiAsPromised = require("chai-as-promised");

// chai.use(chaiAsPromised);

// // Then either:
// const expect = chai.expect;
// // or:
// const assert = chai.assert;

import {
    StableCoinContract,
    StableCoinInstance,
    AssetManagementCenterContract,
    AssetManagementCenterInstance
} from '../build/types/truffle-types';
// Load compiled artifacts
const stableCoinContract: StableCoinContract = artifacts.require('StableCoin.sol');
const amcContract: AssetManagementCenterContract = artifacts.require('AssetManagementCenter.sol');
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
import { BigNumber } from 'bignumber.js';

contract('Asset Management Center', async accounts => {

    let coinInstance: StableCoinInstance;
    let amcInstance: AssetManagementCenterInstance;

    let epochTime: number;
    let releaseTime: number;

    before('Get proxy contract instance', async () => {
        coinInstance = await stableCoinContract.deployed();
        amcInstance = await amcContract.deployed();
    });


    describe('测试资产锁定', () => {

        it('添加资产锁', async () => {
            await amcInstance.addAsset(coinInstance.address, 0, 1);
            let res = await amcInstance.getLock(coinInstance.address);
            // console.log(res);
            assert.equal(res[0], true, 'asset unlock.');
            assert.equal(res[1], coinInstance.address, 'asset address not match');
            console.log("Release time: " + new Date(res[2].toNumber() * 1000));
            releaseTime = res[2].toNumber();
            assert.equal(res[3], accounts[0], 'claimer wrong');
            assert.equal(res[4].toNumber(), 0, 'lock balance is wrong');
            console.log("Epoch time: " + new Date(res[5].toNumber() * 1000));
            epochTime = res[5].toNumber();
            let canAddTheSameAsset = false;
            try {
                let res1 = await amcInstance.addAsset(coinInstance.address, 0, 1);
                canAddTheSameAsset = true;
            } catch (e) {
                console.log(e);
            }
            assert.equal(canAddTheSameAsset, false, 'Can add the same asset.');
        });

        it('锁定资产', async () => {
            let amt = web3.utils.toWei('1000', 'ether');
            await coinInstance.transfer(amcInstance.address, amt);
            let res = await amcInstance.getLock(coinInstance.address);
            console.log(res);
            assert.equal(res[0], true, 'asset unlock.');
            assert.equal(res[1], coinInstance.address, 'asset address not match');
            assert.equal(res[2].toNumber(), releaseTime, 'releaseTime had changed.');
            assert.equal(res[3], accounts[0], 'claimer wrong');
            let bal = res[4].toString(10);
            console.log(bal);
            assert.equal(bal, '1000000000000000000000', 'lock balance is wrong');
            assert.equal(res[5].toNumber(), epochTime, 'epochTime had changed.');
        });

        it('索取资产', async () => {
            let amt = web3.utils.toWei('1000', 'ether');
            let cannotClaim = true;
            try {
                await amcInstance.claim('0x67B44fa9e09f38033a27988DBa6d1F42a799a517', amt);
                cannotClaim = false;
            } catch (e) {
                console.log(e);
            }
            assert.equal(cannotClaim, true, 'Fatal! no that asset lock, but claim asset!');
            try {
                await amcInstance.claim(coinInstance.address, amt);
                cannotClaim = false;
            } catch (e) {
                console.log(e);
            }
            assert.equal(cannotClaim, true, 'Fatal! unexpired, but claim asset!');
            try {
                await amcInstance.claim(coinInstance.address, amt, { from: accounts[1] });
                cannotClaim = false;
            } catch (e) {
                console.log(e);
            }
            assert.equal(cannotClaim, true, 'Fatal! not claimer, but claim asset!');
            let res = await amcInstance.getLock(coinInstance.address);
            console.log(res);
            assert.equal(res[0], true, 'asset unlock.');
            assert.equal(res[1], coinInstance.address, 'asset address not match');
            assert.equal(res[2].toNumber(), releaseTime, 'releaseTime had changed.');
            assert.equal(res[3], accounts[0], 'claimer wrong');
            let bal = res[4].toString(10);
            console.log(bal);
            assert.equal(bal, '1000000000000000000000', 'lock balance is wrong');
            assert.equal(res[5].toNumber(), epochTime, 'epochTime had changed.');
        });


        it('更改claimer以及延长锁定时间', async () => {
            let res = await amcInstance.getLock(coinInstance.address);
            // console.log(res);
            console.log("Release time: " + new Date(res[2].toNumber() * 1000));
            console.log("Epoch time: " + new Date(res[5].toNumber() * 1000));
            await amcInstance.extendReleaseTime(coinInstance.address, 1);
            res = await amcInstance.getLock(coinInstance.address);
            // console.log(res);
            console.log("Release time: " + new Date(res[2].toNumber() * 1000));
            console.log("Epoch time: " + new Date(res[5].toNumber() * 1000));
            let canExtend = false;
            try {
                await amcInstance.extendReleaseTime(coinInstance.address, 1, { from: accounts[1] });
                canExtend = true;
            } catch (e) {
                console.log(e);
            }
            assert.equal(canExtend, false, 'Fatal! not claimer, but extend period!');
            let canTransferClaimer = false;
            try {
                await amcInstance.setClaimer(coinInstance.address, accounts[1], { from: accounts[1] });
                canTransferClaimer = true;
            } catch (e) {
                console.log(e);
            }
            assert.equal(canTransferClaimer, false, 'Fatal! not owner, but can transfer claimer!');
            await amcInstance.setClaimer(coinInstance.address, accounts[1], { from: accounts[0] });
            canExtend = false;
            try {
                await amcInstance.extendReleaseTime(coinInstance.address, 1, { from: accounts[0] });
                canExtend = true;
            } catch (e) {
                console.log(e);
            }
            assert.equal(canExtend, false, 'Fatal! not claimer, but extend period![0]');
        });
    });

});
