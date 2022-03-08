const main = async () => {
  // The first return is the deployer, the second is a random account
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy();
  await domainContract.deployed();
  console.log('Contract deployed to:', domainContract.address);
  console.log('Contract deployed by:', owner.address);

  // calling function to register name 'scoot'
  const txn = await domainContract.register('scoots');
  await txn.wait();
  // call get address function to return the owner of domain
  const domainOwner = await domainContract.getAddress('scoots');
  console.log('Owner of domain:', domainOwner);

  // simulate other people hitting functions by trying to set a record that doesn't belong to me
  // should give error when running script if require statements work properly
  txn = await domainContract
    .connect(randomPerson)
    .setRecord('scoots', 'my domain');
  await txn.wait();
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
