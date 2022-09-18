const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '1000000'});
});

describe('Lottery Contract', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });

    //  function enter() public payable {
    //  require(msg.value > .01 ether);
    //  players.push(msg.sender);}

    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.011', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });

    it('allows multiple accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.011', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.011', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.011', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[3],
            value: web3.utils.toWei('0.011', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[4],
            value: web3.utils.toWei('0.011', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[5],
            value: web3.utils.toWei('0.011', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[6],
            value: web3.utils.toWei('0.011', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[7],
            value: web3.utils.toWei('0.011', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[8],
            value: web3.utils.toWei('0.011', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[9],
            value: web3.utils.toWei('0.011', 'ether')
        });

        
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(accounts[3], players[3]);
        assert.equal(accounts[4], players[4]);
        assert.equal(accounts[5], players[5]);
        assert.equal(accounts[6], players[6]);
        assert.equal(accounts[7], players[7]);
        assert.equal(accounts[8], players[8]);
        assert.equal(accounts[9], players[9]);
        
        assert.equal(10, players.length);
    });

    it('requires a minimum amount of ether to enter', async () =>{
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 0
            });
            assert(false);
        }   catch (err) {
            assert.ok(err);  
        }   
    });

    it('only manager can call pickWinner', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false);
        }   catch (err) {
            assert(err);
        }
    });
    it('it send money to the winner and resets the players array', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({ from: accounts[0] });
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;

        assert(difference > web3.utils.toWei('1.9', 'ether'));
    });
});