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
    BowTokenWalletContract,
    BowTokenWalletInstance,
} from '../build/types/truffle-types';
// Load compiled artifacts
const proxyContract: BowProxyContract = artifacts.require('BowProxy.sol');
const stableCoinContract: StableCoinContract = artifacts.require('StableCoin.sol');
const tokenContract: BowTokenForTestDEVContract = artifacts.require('BowTokenForTestDEV.sol');
const poolContract: BowPoolContract = artifacts.require('BowPool.sol');
const bowTokenWalletContract: BowTokenWalletContract = artifacts.require('BowTokenWallet.sol');
import { BigNumber } from 'bignumber.js';
import { config } from './config'

contract('Bow proxy', async accounts => {


    let proxyInstance: BowProxyInstance;
    let dai: StableCoinInstance;
    let busd: StableCoinInstance;
    let usdt: StableCoinInstance;
    let btcb: StableCoinInstance;
    let renBtc: StableCoinInstance;
    let anyBtc: StableCoinInstance;
    let bst: BowTokenForTestDEVInstance;
    let p1: BowPoolInstance;
    let p2: BowPoolInstance;
    let walletShare: BowTokenWalletInstance;
    let walletSwap: BowTokenWalletInstance;
    let walletStaking: BowTokenWalletInstance;
    let denominator = new BigNumber(10).exponentiatedBy(18);


    before('Get proxy contract instance', async () => {
        proxyInstance = await proxyContract.at(config.proxyAddress);
        let p1Info = await proxyInstance.getPoolInfo(0);
        let p2Info = await proxyInstance.getPoolInfo(1);
        p1 = await poolContract.at(p1Info[0]);
        p2 = await poolContract.at(p2Info[0]);
        dai = await stableCoinContract.at(p1Info[1][0]);
        busd = await stableCoinContract.at(p1Info[1][1]);
        usdt = await stableCoinContract.at(p1Info[1][2]);
        btcb = await stableCoinContract.at(p2Info[1][0]);
        renBtc = await stableCoinContract.at(p2Info[1][1]);
        anyBtc = await stableCoinContract.at(p2Info[1][2]);
        let tokenAddress = await proxyInstance.getTokenAddress();
        bst = await tokenContract.at(tokenAddress);
        let walletAddresses = await proxyInstance.getWallets();
        walletShare = await bowTokenWalletContract.at(walletAddresses[0]);
        walletSwap = await bowTokenWalletContract.at(walletAddresses[1]);
        walletStaking = await bowTokenWalletContract.at(walletAddresses[2]);
        console.log('======================================================');
    });


    describe('获取用户状态数据', async () => {

        it('获取数据', async () => {
            for (let i = 0; i < accounts.length; i++) {
                console.log('accounts[ ' + i + ' ]');
                console.log('account address: ' + accounts[i]);
                let daiBalStr = await dai.balanceOf(accounts[i]);
                console.log("DAI balance: " + new BigNumber(daiBalStr).div(denominator).toFormat(18, BigNumber.ROUND_DOWN));
                let busdBalStr = await busd.balanceOf(accounts[i]);
                console.log("BUSD balance: " + new BigNumber(busdBalStr).div(denominator).toFormat(18, BigNumber.ROUND_DOWN));
                let usdtBalStr = await usdt.balanceOf(accounts[i]);
                console.log("USDT balance: " + new BigNumber(usdtBalStr).div(denominator).toFormat(18, BigNumber.ROUND_DOWN));
                let btcbBalStr = await btcb.balanceOf(accounts[i]);
                console.log("BTCB balance: " + new BigNumber(btcbBalStr).div(denominator).toFormat(18, BigNumber.ROUND_DOWN));
                let renBtcBalStr = await renBtc.balanceOf(accounts[i]);
                console.log("renBTC balance: " + new BigNumber(renBtcBalStr).div(denominator).toFormat(18, BigNumber.ROUND_DOWN));
                let anyBtcBalStr = await anyBtc.balanceOf(accounts[i]);
                console.log("anyBTC balance: " + new BigNumber(anyBtcBalStr).div(denominator).toFormat(18, BigNumber.ROUND_DOWN));
                let userInfo1 = await proxyInstance.getUserInfo(0, accounts[i]);
                let userInfo2 = await proxyInstance.getUserInfo(1, accounts[i]);
                let lp1Bal = await p1.balanceOf(accounts[i]);
                console.log('LP1: ' + new BigNumber(lp1Bal).div(denominator).toFormat(18, BigNumber.ROUND_DOWN));
                console.log('Staking LP1: ' + new BigNumber(userInfo1[0]).div(denominator).toFormat(18, BigNumber.ROUND_DOWN));
                let lp2Bal = await p2.balanceOf(accounts[i]);
                console.log('LP2: ' + new BigNumber(lp2Bal).div(denominator).toFormat(18, BigNumber.ROUND_DOWN));
                console.log('Staking LP2: ' + new BigNumber(userInfo2[0]).div(denominator).toFormat(18, BigNumber.ROUND_DOWN));
                let bstBalStr = await bst.balanceOf(accounts[i]);
                console.log("BST balance: " + new BigNumber(bstBalStr).div(denominator).toFormat(18, BigNumber.ROUND_DOWN));
                console.log("Volume Reward p1: " + new BigNumber(userInfo1[3]).div(denominator).toFormat(18, BigNumber.ROUND_DOWN));
                console.log("Farming Reward p1: " + new BigNumber(userInfo1[4]).div(denominator).toFormat(18, BigNumber.ROUND_DOWN));
                let pending1 = await proxyInstance.pendingReward(0, accounts[i]);
                console.log("p1 Share pending reward: " + new BigNumber(pending1).div(denominator).toFormat(18, BigNumber.ROUND_DOWN));
                console.log("Volume Reward p2: " + new BigNumber(userInfo2[3]).div(denominator).toFormat(18, BigNumber.ROUND_DOWN));
                console.log("Farming Reward p2: " + new BigNumber(userInfo2[4]).div(denominator).toFormat(18, BigNumber.ROUND_DOWN));
                let pending2 = await proxyInstance.pendingReward(1, accounts[i]);
                console.log("p2 Share pending reward: " + new BigNumber(pending2).div(denominator).toFormat(18, BigNumber.ROUND_DOWN));
                console.log('======================================================');
            }
            let bstTotalSupply = await bst.totalSupply();
            console.log('BST totalSupply: ' + new BigNumber(bstTotalSupply).div(denominator).toFormat(18, BigNumber.ROUND_DOWN));
            let bstAvailableSupply = await bst.availableSupply();
            console.log('BST availableSupply: ' + new BigNumber(bstAvailableSupply).div(denominator).toFormat(18, BigNumber.ROUND_DOWN));
            let shareBSTBalStr = await bst.balanceOf(walletShare.address);
            console.log('Share reward BST balance: ' + new BigNumber(shareBSTBalStr).div(denominator).toFormat(18, BigNumber.ROUND_DOWN));
            let swapBSTBalStr = await bst.balanceOf(walletSwap.address);
            console.log('Swap reward BST balance: ' + new BigNumber(swapBSTBalStr).div(denominator).toFormat(18, BigNumber.ROUND_DOWN));
            let stakingLPBalStr1 = await p1.balanceOf(walletStaking.address);
            console.log('Staking p1\'s LP: ' + new BigNumber(stakingLPBalStr1).div(denominator).toFormat(18, BigNumber.ROUND_DOWN));
            let stakingLPBalStr2 = await p2.balanceOf(walletStaking.address);
            console.log('Staking p2\'s LP: ' + new BigNumber(stakingLPBalStr2).div(denominator).toFormat(18, BigNumber.ROUND_DOWN));
            let bstRate = await bst.getRate();
            console.log('BST rate: ' + new BigNumber(bstRate).div(denominator).toFormat(18, BigNumber.ROUND_DOWN));
            let stage = await bst.getMiningEpoch();
            console.log('BST stage: ' + stage);
            let startSupply = await bst.startEpochSupply();
            console.log('BST startSupply: ' + new BigNumber(startSupply).div(denominator).toFormat(18, BigNumber.ROUND_DOWN));
            let startTime = await bst.startEpochTime();
            console.log('BST start time: ' + new Date(Number(startTime) * 1000));
            console.log('======================================================');
            console.log('Pool1: ' + p1.address);
            console.log('dai: ' + dai.address);
            console.log('xusd: ' + busd.address);
            console.log('usdt: ' + usdt.address);
            console.log('Pool2: ' + p2.address);
            console.log('renBtc: ' + renBtc.address);
            console.log('xbtc: ' + btcb.address);
            console.log('anyBtc: ' + anyBtc.address);
            console.log('Token address: ' + bst.address);
        }).timeout(3600 * 1000);

    });

});
