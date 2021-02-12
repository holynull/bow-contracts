const StableCoin = artifacts.require("StableCoin");
const AssetManagementCenter = artifacts.require("AssetManagementCenter");

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
        let totalSupply = web3.utils.toWei('100000000', 'ether');
        await deployer.deploy(StableCoin, "DAI for Bow AMC test", "amcDAI", totalSupply);
        await deployer.deploy(AssetManagementCenter);
    } else {

    }

    // deployer.deploy(factory).then(() => {
    // });
    // deployer.deploy(exchange).then(() => {
    // });
};
