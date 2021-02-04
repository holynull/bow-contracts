const BowPool = artifacts.require("BowPool");
const StableCoin = artifacts.require("StableCoin");
const BowProxy = artifacts.require("BowProxy");
const BowTokenForTestDEV = artifacts.require("BowTokenForTestDEV");

module.exports = async function (deployer) {
    if (deployer.network.indexOf('skipMigrations') > -1) { // skip migration
        return;
    }
    if (deployer.network.indexOf('kovan_oracle') > -1) { // skip migration
        return;
    }
    if (deployer.network_id == 4) { // Rinkeby
    } else if (deployer.network_id == 1) { // main net
    } else if (deployer.network_id == 42) { // kovan
    } else if (deployer.network_id == 56) { // bsc main net
    } else if (deployer.network_id == 256 || deployer.network_id == 5777) { //heco test net
        let daiAddress;
        let busdAddress;
        let usdtAddress;
        let btcbAddress;
        let renBtcAddress;
        let anyBtcAddress;
        let p1Address;
        let p2Address;
        deployer.then(() => {
            let totalSupply = web3.utils.toWei('100000000', 'ether');
            return StableCoin.new("bowDAI for Bow test", "bowDAI", totalSupply);
        }).then(dai => {
            daiAddress = dai.address;
            let totalSupply = web3.utils.toWei('100000000', 'ether');
            return StableCoin.new("bowHUSD for Bow test", "bowHUSD", totalSupply);
        }).then(busd => {
            busdAddress = busd.address;
            let totalSupply = web3.utils.toWei('100000000', 'ether');
            return StableCoin.new("bowUSDT for Bow test", "bowUSDT", totalSupply);
        }).then(usdt => {
            usdtAddress = usdt.address;
            let stableCoins = [daiAddress, busdAddress, usdtAddress];
            let A = 100;
            let fee = 30000000;// 1e-10, 0.003, 0.3%
            // let adminFee = 0;
            let adminFee = 6666666666; // 1e-10, 0.666667, 66.67% 
            return BowPool.new("Bow Pool (bowDAI/bowHUSD/bowUSDT) for test", "BOWLP-01", stableCoins, A, fee, adminFee);
        }).then(pool => {
            let totalSupply = web3.utils.toWei('100000000', 'ether');
            p1Address = pool.address;
            return StableCoin.new("HBTC for Bow test", "HBTC", totalSupply);
        }).then(btcb => {
            let totalSupply = web3.utils.toWei('100000000', 'ether');
            btcbAddress = btcb.address;
            return StableCoin.new("renBTC for Bow test", "renBTC", totalSupply);
        }).then(renBtc => {
            let totalSupply = web3.utils.toWei('100000000', 'ether');
            renBtcAddress = renBtc.address;
            return StableCoin.new("anyBTC for Bow test", "anyBTC", totalSupply)
        }).then(anyBtc => {
            anyBtcAddress = anyBtc.address;
            let stableCoins = [btcbAddress, renBtcAddress, anyBtcAddress];
            let A = 100;
            let fee = 30000000;// 1e-10, 0.003, 0.3%
            // let adminFee = 0;
            let adminFee = 6666666666; // 1e-10, 0.666667, 66.67% 
            return BowPool.new("Bow Pool (HBTC/renBTC/anyBTC) for test", "BOWLP-02", stableCoins, A, fee, adminFee);
        }).then(pool => {
            p2Address = pool.address;
            return BowTokenForTestDEV.new("Bow DAO Token", "BOW");
        }).then(async bow => {
            console.log("Token's address: " + bow.address);
            let proxy = await BowProxy.new("Bow Pools Proxy for test", "BOWPROXY-V1", bow.address);
            // await proxy.createWallet();
            console.log("Proxy's address: " + proxy.address);
            await proxy.addPool(p1Address, [daiAddress, busdAddress, usdtAddress], 6);
            await proxy.addPool(p2Address, [btcbAddress, renBtcAddress, anyBtcAddress], 4);
            await bow.setMinter(proxy.address);
            // await bst.updateMiningParameters();
        });
    } else {

    }

    // deployer.deploy(factory).then(() => {
    // });
    // deployer.deploy(exchange).then(() => {
    // });
};
