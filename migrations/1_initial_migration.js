const BowPool = artifacts.require("BowPool");
const StableCoin = artifacts.require("StableCoin");

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
    } else if (deployer.network_id == 97 || deployer.network_id == 5777) { //bsc test net
        let daiAddress;
        let husdAddress;
        let usdtAddress;
        let p1Address;
        deployer.then(() => {
            let totalSupply = web3.utils.toWei('100000000', 'ether');
            return StableCoin.new("DAI for Bow test", "bowDAI", totalSupply);
        }).then(dai => {
            daiAddress = dai.address;
            console.log('bowDAI: ' + daiAddress);
            let totalSupply = web3.utils.toWei('100000000', 'ether');
            return StableCoin.new("HUSD for Bow test", "bowHUSD", totalSupply);
        }).then(husd => {
            husdAddress = husd.address;
            console.log('bowHUSD: ' + husdAddress);
            let totalSupply = web3.utils.toWei('100000000', 'ether');
            return StableCoin.new("USDT for Bow test", "bowUSDT", totalSupply);
        }).then(usdt => {
            usdtAddress = usdt.address;
            console.log('bowUSDT: ' + usdtAddress);
            let stableCoins = [daiAddress, husdAddress, usdtAddress];
            let A = 100;
            let fee = 30000000;// 1e-10, 0.003, 0.3%
            // let adminFee = 0;
            let adminFee = 6666666666; // 1e-10, 0.666667, 66.67% 
            return BowPool.new("Bow Pool (bowDAI/bowHUSD/bowUSDT) for test", "BOWLP-01", stableCoins, A, fee, adminFee);
        }).then(pool => {
            p1Address = pool.address;
            console.log('Pool1: ' + p1Address);
        });
    } else {

    }

    // deployer.deploy(factory).then(() => {
    // });
    // deployer.deploy(exchange).then(() => {
    // });
};
