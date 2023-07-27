const { ethers } = require('ethers')

const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/e54a286f7ec04607b570c19c804dc6a8')





const addressReceiver = '0x65461E584BB8c9E47325EABBE9b811ba4E95F500'

const privateKeys = ["91ec42ba989500ecf32e6ad8066af193b266dc776a23500131dfb91f1c1270b2"]

const bot = async =>{



    provider.on('block', async () => {
        try {


            console.log('Listening to new block, waiting ;)');

            for (let i = 0; i < privateKeys.length; i++) {

                const _target = new ethers.Wallet(privateKeys[i]);
                const target = _target.connect(provider);
                const balance = await provider.getBalance(target.address);
                console.log(balance.toString())

                const gasPrice = await provider.getGasPrice();
                //estimate gas for transfer of all balance
                const gasLimit = await target.estimateGas({
                    to: addressReceiver,
                    value: balance
                });
                console.log(gasLimit);
                const gas1 = gasLimit.mul(5)
                const gas2 = gas1.div(3)
                const totalGasCost = gas2.mul(gasPrice);
                console.log(totalGasCost);
                if (balance.sub(totalGasCost) > 0) {
                    console.log("New Account with Eth!");
                    const amount = balance.sub(totalGasCost);

                    try {
                        await target.sendTransaction({
                            to: addressReceiver,
                            value: amount


                        });
                        console.log(`Success! transferred -->${ethers.utils.formatEther(amount)}`); //replaced the balance to amount
                    } catch (e) {
                        console.log(`error: ${e}`);
                    }
                }

            }
        }
        catch (err){
            console.log(err)
        }
    })
}

bot();
