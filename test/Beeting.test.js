const Betting = artifacts.require('Betting');

contract('Betting', accounts => {
  it('totalslot should be equal 3', async () => {
    const instance = await Betting.deployed();
    const totalSlots = (await instance.totalSlots()).toString();
    assert(totalSlots, '3');
  });

  it('owner is me', async () => {
    const instance = await Betting.deployed();
    const owner = await instance.owner();
    assert(owner, accounts[0]);
  });
});
