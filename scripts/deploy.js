const main = async () => {
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy('ninja');
  await domainContract.deployed();

  console.log('Contract deployed to:', domainContract.address);

  let txn = await domainContract.register('scooter', {
    value: hre.ethers.utils.parseEther('0.1')
  });
  await txn.wait();
  console.log('Minted domain tooter.scooter');

  txn = await domainContract.setRecord(
    'scooter',
    'Names Scooter, ScooterMcgavin'
  );
  await txn.wait();
  console.log('Set record for tooter.scooter');

  const address = await domainContract.getAddress('tooter');
  console.log('Owner of domain tooter:', address);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log('Contract balance:', hre.ethers.utils.formatEther(balance));
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
