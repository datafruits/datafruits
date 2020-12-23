import Component from '@glimmer/component';
import { Web3 } from 'web3';

export default class EthDonateButtonComponent extends Component {
  constructor(owner, args) {
    super(owner, args);
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable();
    }
  }
}
