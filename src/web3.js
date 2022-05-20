import Web3 from "web3";
 
window.ethereum.request({ method: "eth_requestAccounts" }); //requests the user to login with there metamask account
 
const web3 = new Web3(window.ethereum);
 
export default web3;