import { expect, assert } from 'chai';
import {
    BowProxyContract,
    BowProxyInstance,
    StableCoinContract,
    StableCoinInstance,
    BowTokenForTestDEVContract,
    BowTokenForTestDEVInstance,
    BowPoolContract,
    BowPoolInstance,
} from '../build/types/truffle-types';
// Load compiled artifacts
const proxyContract: BowProxyContract = artifacts.require('BowProxy.sol');
const stableCoinContract: StableCoinContract = artifacts.require('StableCoin.sol');
const tokenContract: BowTokenForTestDEVContract = artifacts.require('BowTokenForTestDEV.sol');
const poolContract: BowPoolContract = artifacts.require('BowPool.sol');
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
import { BigNumber } from 'bignumber.js';
import { config } from './config'

contract('Bow proxy', async accounts => {


    let proxyInstance: BowProxyInstance;
    let poolInstance1: BowPoolInstance;
    let poolInstance2: BowPoolInstance;

    before('Get proxy contract instance', async () => {
        proxyInstance = await proxyContract.at(config.proxyAddress);
        let poolAddress = await proxyInstance.getPoolAddress(0);
        poolInstance1 = await poolContract.at(poolAddress);
        poolAddress = await proxyInstance.getPoolAddress(1);
        poolInstance2 = await poolContract.at(poolAddress);
    });


    describe('测试添加流动性', async () => {

        it('每个账户添加10,000流动性', async () => {
            for (let i = 0; i < accounts.length; i++) {
                let amt = web3.utils.toWei('10000', 'ether');
                await poolInstance1.add_liquidity([amt, amt, amt], 0, { from: accounts[i] });
                await poolInstance2.add_liquidity([amt, amt, amt], 0, { from: accounts[i] });
            }
        });

    });

});
