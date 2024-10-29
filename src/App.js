import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import Web3 from 'web3';

// Contract address and ABI
const CONTRACT_ADDRESS = "0x55637c93b3d2e6373fb5b1e4140505c27bf709f8";
const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "decreaseNumber",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "increaseNumber",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "newMessage",
        "type": "string"
      }
    ],
    "name": "setMessage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_startingPoint",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_startingMessage",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "getNumber",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "message",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

function App() {
  const [number, setNumber] = useState("none");
  const [currentMessage, setCurrentMessage] = useState("none");
  const [newMessage, setNewMessage] = useState("");
  
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

  // Fetch number from contract
  const fetchNumber = async () => {
    const result = await contract.methods.getNumber().call();
    setNumber(result.toString());
  };

  // Fetch message from contract
  const fetchMessage = async () => {
    const message = await contract.methods.message().call();
    setCurrentMessage(message);
  };

  // Increase or decrease number
  const updateNumber = async (methodName) => {
    const accounts = await web3.eth.requestAccounts();
    await contract.methods[methodName]().send({ from: accounts[0] });
    fetchNumber();
  };

  // Update message on contract
  const updateMessage = async () => {
    const accounts = await web3.eth.requestAccounts();
    await contract.methods.setMessage(newMessage).send({ from: accounts[0] });
    fetchMessage();
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={fetchNumber}>Get Number</button>
        <button onClick={() => updateNumber("increaseNumber")}>Increase Number</button>
        <button onClick={() => updateNumber("decreaseNumber")}>Decrease Number</button>
        <p>Number: {number}</p>
        
        <button onClick={fetchMessage}>Get Message</button>
        <p>Message: {currentMessage}</p>
        
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter new message"
        />
        <button onClick={updateMessage}>Update Message</button>
      </header>
    </div>
  );
}

export default App;
