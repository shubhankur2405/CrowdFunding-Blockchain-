import React ,{Component} from 'react';
import lottery from '../lottery';
import web3 from '../web3';

class Lottery extends Component{

  constructor(props){
      super(props);
      this.state = {
        manager : '',
        participate_amount : '0.01',
        message : '',
        total_amount : ''
      }
    }
    async componentDidMount(){
      // get the public address of the managers
      const manager  = await lottery.methods.manager().call();
      console.log(manager);
      this.setState({manager : manager});
      const total_amount = await web3.eth.getBalance(lottery.options.address);
      this.setState({total_amount : total_amount});
    }

    onSubmit = async (event)=>{
      event.preventDefault();
      const accounts = await web3.eth.getAccounts();
      if(this.state.participate_amount < 0.01){
        return alert("Amount is less than 0.01 please enter a bigger amount");
      }
      this.setState({message : 'Please Wait .....'});
      const enter_lottery = await lottery.methods.enterLottery().send({
        from : accounts[0],
        value : web3.utils.toWei(this.state.participate_amount, 'ether')
      });
      this.setState({message: "You have been added to the lottery"});
    }

onClick = async () =>{
  this.setState({message : "PLease Wait ....."});
  const accounts = await web3.eth.getAccounts();
  const winner = await lottery.methods.pickWinner().send({
    from : accounts[0]
  });
  this.setState({message : "Payment sent to Winner"});
}

  render(){
    return(
      <div>
      <h1> Total Lottery Pool is {web3.utils.fromWei(this.state.total_amount, 'ether')}</h1>
      <form onSubmit={this.onSubmit}>
      <input value={this.state.participate_amount} onChange = {event => this.setState({participate_amount : event.target.value})} />
      <button type="submit">Participate</button>
      </form>
      <p> {this.state.message}</p>
      <hr /><br /><hr />
      <p> The manager of the the Lottery Decentralized App is {this.state.manager}</p>
      <p> The address of the Deployed Contract is 0x0B09eD41f2D62d1b08447B0B02329D2A9dD3Bb79 </p>
      <button onClick={this.onClick}> Pick Winner </button>
      </div>
    )
  }
}

export default Lottery;
