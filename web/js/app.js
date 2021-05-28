const abi = [
  {
    constant: true,
    inputs: [
      { name: '', type: 'uint256' },
      { name: '', type: 'uint256' },
    ],
    name: 'numberToPlayers',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'numberOfBets',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSlots',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'kill',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: 'betNumber', type: 'uint256' }],
    name: 'bet',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '', type: 'address' }],
    name: 'playerToNumber',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'betValue',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'lastWinnerNumber',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '', type: 'uint256' }],
    name: 'players',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalBet',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: '_betValue', type: 'uint256' },
      { name: '_totalSlots', type: 'uint256' },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
];

const address = '0xe1891bcD5f24ABB5F9D0A2183D59B8784BDd3ECf'; // TODO address here

const Web3Modal = window.Web3Modal.default;
const el = id => document.querySelector(id);

let web3Modal;
let web3;
let provider;
let selectedAccount;
let contract;

async function login() {
  try {
    provider = await web3Modal.connect();
    web3 = new Web3(provider);
  } catch (e) {
    console.log('Could not get a wallet connection', e);
    return;
  }
  await fetchAccountData();
  await initContract();
}

async function fetchAccountData() {
  const chainId = await web3.eth.getChainId();
  const accounts = await web3.eth.getAccounts();
  console.log('Got accounts', accounts);
  selectedAccount = accounts[0];

  el('#selected-account').textContent = selectedAccount;
  el('#btn-connect').style.display = 'none';
  setInterval(updateState, 1000);
}

async function initContract() {
  console.log('init contract');
  contract = new web3.eth.Contract(abi, address);
}

async function updateState() {
  const balance = await web3.eth.getBalance(selectedAccount);
  $('#selected-account').text(selectedAccount + ' (' + web3.utils.fromWei(balance) + ' ETH)');

  let numberOfBets = await contract.methods.numberOfBets().call();
  numberOfBets = parseInt(numberOfBets);
  $('#number-of-bets').text(numberOfBets.toString());

  const lastWinnerNumber = await contract.methods.lastWinnerNumber().call(); // TODO
  $('#last-winner-number').text(lastWinnerNumber.toString());

  const totalBet = await contract.methods.totalBet().call(); // TODO
  $('#total-bet').text(web3.utils.fromWei(totalBet) + ' ETH');

  let totalSlots = await contract.methods.totalSlots().call(); // TODO
  $('#total-slots').text(totalSlots.toString());

  totalSlots = parseInt(totalSlots);

  if (numberOfBets > 0) {
    for (var i = 0; i < numberOfBets; i++) {
      let playerElement = '#player' + (i + 1);
      const player = await contract.methods.player(i).call(); // TODO
      $(playerElement).text(player);
    }
  }
}

async function handleBet(event) {
  console.log('bet on ', $(event.target).text());
  event.preventDefault();

  var betNumber = parseInt($(event.target).text());
  contract.methods.bet(betNumber).send({
    from: selectedAccount,
    value: '1000000000000000000'
    /* TODO*/
  });
}

window.addEventListener('load', async () => {
  web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions: {},
    disableInjectedProvider: false,
  });
  login();
  el('#btn-connect').addEventListener('click', login);
  $(document).on('click', '.bet-number', handleBet);
});
