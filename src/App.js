import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';
import { Component } from 'react';
class App extends Component {

  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: '',
    lastWinner: '',
    lastWon: ''
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    const lastWinner = await lottery.methods.lastWinner().call();
    const lastWon = await lottery.methods.lastWon().call();
    this.setState({ manager, players, balance, lastWinner, lastWon});
  }

  onSubmit = async (event) => {
    event.preventDefault();
    if(this.state.value.trim() !== '') {
      if(!isNaN(this.state.value)) {
        const accounts = await web3.eth.getAccounts();
    
        this.setState({ message: 'Waiting on transaction success...' });
        try {
          await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei(this.state.value.trim(), 'ether')
          });
      
          let players = await lottery.methods.getPlayers().call();
          let balance = await web3.eth.getBalance(lottery.options.address);
          this.setState({ message: 'You Entered Successfully!', players, balance });
        } catch(err) {
          this.setState({ message: 'You rejected the transaction' });
        }
      } else {
        this.setState({ message:  'Error: Wrong input, please enter a number.'});
      }
    } else {
      this.setState({ message:  'Error: Wrong input, please enter a number.'});
    }
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();
    if(accounts[0] === this.state.manager) {
      let players = await lottery.methods.getPlayers().call();
      this.setState({players})
      if(this.state.players.length > 0) {
    
        this.setState({ message: 'Waiting on transaction success...' });
        
        try {
          await lottery.methods.pickWinner().send({
            from: accounts[0]
          });
          let players = await lottery.methods.getPlayers().call();
          let balance = await web3.eth.getBalance(lottery.options.address);
          let lastWinner = await lottery.methods.lastWinner().call();
          let lastWon = await lottery.methods.lastWon().call();
      
          this.setState({ message: 'A winner has been picked!', players, balance, lastWinner, lastWon });
        } catch(err) {
          this.setState({ message: 'You rejected the transaction.' });
        }
      } else {
        this.setState({ message: "Error: There are 0 players currently in the lottery" });
      }
    } else {
      this.setState({ message: 'Error: You are not the manager.' });
    }
  }

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is manager by {this.state.manager}.<br></br>
          There are currently {this.state.players.length} people entered,
          competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ethereum!
        </p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label><br />
            <input value={this.state.value} onChange={event => this.setState({ value: event.target.value })}></input>
          </div>
          <button type='submit'>Enter</button>
        </form>
        <div>
          <hr />
          <h4>Read to pick a winner?</h4>
          <button onClick={this.onClick}>Pick a winner!</button>
        </div>
        <hr />
        <h1>{this.state.message}</h1>
        {this.state.lastWon > 0 &&
          <div>
            <hr />
            <h4>Last Winner: {this.state.lastWinner} | Won {web3.utils.fromWei(this.state.lastWon, 'ether')} ethereum!</h4>
          </div>
        }

      </div>
    );
  }

}

export default App;
