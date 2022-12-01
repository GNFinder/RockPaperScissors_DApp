import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, FormControl, InputGroup } from 'react-bootstrap';
import { Injected } from './wallet/Connectors';
import { useWeb3React } from '@web3-react/core';
import '../abi.js';

export default function RPSETH_v2() {

    const { active, account, library, activate, deactivate } = useWeb3React();

    //instance of the Smart Contract
    const [contractInstance, setContractInstance] = useState('');

    //text-boxes
    const [etherAmount, setEtherAmount] = useState('');
    const [sender, setSender] = useState('');
    const [playerBalance, setPlayerBalance] = useState('');
    const [contractBalance, setContractBalance] = useState('');

    //player values
    const [playerOneOpponentAddress, setPlayerOneOpponentAddress] = useState('');
    const [playerTwoOpponentAddress, setPlayerTwoOpponentAddress] = useState('');
    const [playerOneSalt, setPlayerOneSalt] = useState('');
    const [playerTwoSalt, setPlayerTwoSalt] = useState('');

    //RPS values
    const [playerOneChoice, setPlayerOneChoice] = useState(null); //What player one selects
    const [playerTwoChoice, setPlayerTwoChoice] = useState(null); //What player two selects
    const [gameOutcome, setGameOutcome] = useState(null); //Win, Lose, or Draw
    const choiceArray = ['rock', 'paper', 'scissors']; //Array will map to three buttons   

    //init the Smart Contract Instance - when library is available
    useEffect(() => {
        //library gives access to web3
        if(library != null) {
            initContractInstance();
            console.log('useEffect() initialized the contract instance');
            async function initContractInstance() {        
                var ci = await new library.eth.Contract( window.rpsv2_abi , '0x4968012edcB9Cd490582684CE76718d222085bC9');
                setContractInstance(ci);
                console.log("User interacted with OSFD: Rock Paper Scissors smart contract...");
            }
        } else {
            console.log('[WAIT] Connect to OSFD network...');
        }
    }, [library]);
    
    async function connectToMetaMask() {
        try {
            await activate(Injected); //calls the activate method provided by useWeb3React()
        } catch (ex) {
            console.log(ex);
        }
    }

    async function disconnectMetaMask() {
        try {
            await deactivate(); //calls the deactivate method provided by useWeb3React()
        } catch (ex) {
            console.log(ex);
        }
    }

    //view data for testing
    async function getMsgSender() {  
        await contractInstance.methods.getMsgSender().call({ from: account }).then(function(msgsender) {
            setSender(msgsender);
        }).catch(err => console.log(err));
    }
    async function getPlayerBalance(){
        await contractInstance.methods.getPlayerBalance(account).call().then(function(playerBalance) {
            let pb = library.utils.fromWei(library.utils.toBN(playerBalance), 'ether');
            setPlayerBalance(pb);
        }).catch(err => console.log(err));
    }
    async function getContractBalance() {
        await contractInstance.methods.getContractBalance().call().then(function(contractBalance) {
            let cb = library.utils.fromWei(library.utils.toBN(contractBalance), 'ether');
            setContractBalance(cb);
        }).catch(err => console.log(err));        
    }
    //END: view data for testing


    //Ether deposits && withdrawals
    async function deposit() {
        let etherBalance = library.utils.toWei(library.utils.toBN(etherAmount), 'ether');

        await contractInstance.methods.deposit().send({ from: account, value: etherBalance}).then(function(receipt){
            console.log('receipt from deposit _> status: ' + receipt.status + ', gas: ' + receipt.gasUsed);
        }).catch(err => console.log(err));
    } 
    async function withdraw() {
        await contractInstance.methods.withdraw().send({ from: account }).then(function(receipt){
            console.log('receipt from withdraw _> status: ' + receipt.status + ', gas: ' + receipt.gasUsed);
        }).catch(err => console.log(err));
    }
    //END: Ether deposits && withdrawals


    //Rock, Paper, Scissors - Play Game
    async function startGame(choiceSelected) {
        // eslint-disable-next-line
        if(library == undefined) {
            alert('Please connect to metamask...');
        }
        else {
            let gameChoice = choiceArray.indexOf(choiceSelected) + 1;
            setPlayerOneChoice(gameChoice);

            let salt =  library.utils.sha3("" + Math.random());
            let encoded = library.eth.abi.encodeParameters(['uint256', 'bytes32'],[gameChoice, salt]);
            let hash = library.utils.sha3(encoded, {encoding: 'hex'});
            setPlayerOneSalt(salt);

            // console.log('Player one salt: ', salt);// Only for testing - remove 
            // console.log('Player one hash: ', hash);// Only for testing - remove 

            setPlayerTwoOpponentAddress(account);
            
            // eslint-disable-next-line
            if (hash !== undefined && hash !== null) {
                var bet = library.utils.toWei(library.utils.toBN('1'), 'ether');// hardcoded to 1 ether - could be changed to exact deposit amount in future
                
                // notes: Can we send this transaction to the blockchain in a later function call, i.e "revealChoice"
                await contractInstance.methods.startGame(hash, playerOneOpponentAddress, bet).send({ from: account }).then(function(receipt){
                    console.log('receipt from startGame _> status: ' + receipt.status + ', gas: ' + receipt.gasUsed);
                }).catch(err => console.log(err)); 
            }             
        }
    }
    async function participateGame(choiceSelected) {
        // eslint-disable-next-line
        if(library == undefined) {
            alert('Please connect to metamask...');
        }
        else {
            let gameChoice = choiceArray.indexOf(choiceSelected) + 1;
            setPlayerTwoChoice(gameChoice);

            let salt =  library.utils.sha3("" + Math.random());
            let encoded = library.eth.abi.encodeParameters(['uint256', 'bytes32'],[gameChoice, salt]);
            let hash = library.utils.sha3(encoded, {encoding: 'hex'});
            setPlayerTwoSalt(salt);

            // console.log('Player two salt: ', salt);// Only for testing - remove 
            // console.log('Player two hash: ', hash);// Only for testing - remove 

            await contractInstance.methods.participateGame(hash, playerTwoOpponentAddress).send({ from: account }).then(function(receipt){
                console.log('receipt from participateGame _> status: ' + receipt.status + ', gas: ' + receipt.gasUsed);
            }).catch(err => console.log(err)); 
        }
    }
    //END: Rock, Paper, Scissors - Play Game

    async function revealGamePlayerOne() {
        await contractInstance.methods.revealChoice(playerOneChoice, playerOneSalt, playerTwoOpponentAddress).send({ from: account }).then(function(receipt){
            console.log('receipt from revealGamePlayerOne _> status: ' + receipt.status + ', gas: ' + receipt.gasUsed);
        }).catch(err => console.log(err)); 
    }
    async function revealGamePlayerTwo() {
        await contractInstance.methods.revealChoice(playerTwoChoice, playerTwoSalt, playerTwoOpponentAddress).send({ from: account }).then(function(receipt){
            console.log('receipt from revealGamePlayerTwo _> status: ' + receipt.status + ', gas: ' + receipt.gasUsed);
        }).catch(err => console.log(err)); 
    }
    async function endGame() {
        await contractInstance.methods.endGame(playerTwoOpponentAddress).send({ from: account }).then(function(receipt){
            console.log('receipt from endGame _> status: ' + receipt.status + ', gas: ' + receipt.gasUsed);
            let rpsOutCome = receipt.events.GetGameOutcome.returnValues[0];
            console.log('Player ' + rpsOutCome, 'Won!'); // read the event (uint) fired by the contract
            switch (rpsOutCome) {
                case '0':
                  setGameOutcome('IT IS A DRAW!🤝')
                  break
                case '1':
                  setGameOutcome('PLAYER ONE WINS!', console.log('🤑Player One can withdraw the Jackpot!!'))
                  break
                case '2':
                  setGameOutcome('PLAYER TWO WINS!', console.log('🤑Player Two can withdraw the Jackpot!!'))
                  break
                case '3':
                    setGameOutcome('🚨...there was a problem with this game')
                    break
                default: 
                    setGameOutcome('🙌...Play again!'); // 
                    break    
            }
            setPlayerOneChoice(playerOneChoice);
            setPlayerTwoChoice(playerTwoChoice);
        }).catch(err => console.log(err)); 
    }
    async function viewGame() {
        let gameData = await contractInstance.methods.games(playerTwoOpponentAddress).call();
        console.log('Result from View Game: ', gameData);
    }

    return (
        <Container>
            <Row className='mt-5'>
                <Col className='text-center'>
                    <h1>Rock Paper Scissors - (securely)</h1>
                    <h3>Start by connecting your wallet</h3>
                    <h4>Deposit & Play - then Player Two may enter!</h4>
                    <h5>End Game and Winner Takes All💰</h5>
                </Col>    
            </Row> 
            <Row className='mt-5'>
                <Col md={{ span: 4, offset: 2 }}>
                    <InputGroup>
                        <Button variant='primary' onClick={ connectToMetaMask }>Connect to MetaMask</Button>
                        <Button variant='outline-primary' onClick={ disconnectMetaMask }>Disconnect</Button>
                    </InputGroup>
                </Col>
                <Col md={{ span: 3, offset: 1 }}>
                    <InputGroup>
                        <FormControl
                            placeholder='Amount in Ether'
                            type='number' value={ etherAmount } 
                            onChange={ (event) => 
                                setEtherAmount(event.target.value) }/>
                        <Button variant='primary' onClick={ deposit }>Deposit</Button>
                    </InputGroup>
                </Col>  
            </Row>                  
            <Row className='mt-3 mb-5'>
                <Col className='text-center'>
                    {active ? <span>Connected Account: <b>{ account }</b></span> : <span>Not Connected</span>} 
                </Col>    
            </Row>  
            <hr />    
            <Row className='mt-3'>  
                <Col className='text-center'>
                    <h5>Test Contract Interaction</h5>
                </Col>
            </Row>
            <Row className='mt-3 mb-5'>                    
                <Col md={{ span: 3, offset: 2 }}>
                    <InputGroup>
                        <FormControl
                            placeholder='...Msg.Sender'
                            type='text' value={ sender } 
                            onChange={ (event) => 
                                setSender(event.target.value) }/>
                        <Button variant='dark' onClick={ getMsgSender }>Msg.Sender</Button>
                    </InputGroup>
                    
                    <InputGroup className='mt-1'>
                        <FormControl
                            placeholder='...player balance'
                            type='text' value={ playerBalance } 
                            onChange={ (event) => 
                                setPlayerBalance(event.target.value) }/>
                        <Button variant='dark' onClick={ getPlayerBalance }>Player Balance</Button>
                    </InputGroup>
                    
                    <InputGroup className='mt-1'>
                        <FormControl
                            placeholder='...contract balance'
                            type='text' value={ contractBalance } 
                            onChange={ (event) => 
                                setContractBalance(event.target.value) }/>
                        <Button variant='dark' onClick={ getContractBalance }>Contract Balance</Button>
                    </InputGroup>
                </Col>  
                <Col>
                    <Row className='mt-5'>
                        <Col className='text-center'>
                            <Button variant='warning'
                                onClick={ withdraw }>
                                    withdraw
                            </Button>
                        </Col>    
                    </Row> 
                </Col>
            </Row> 
            <hr />                    
            <Row className='mt-5'>
                <Col className='text-center'>
                    <h1>
                        Rock Paper Scissors
                    </h1>
                </Col>
            </Row>

            <Row className='mt-1'>
                <Col className='text-center'>
                    <Row className='mt-2'>
                    <Col className='text-center'>
                        <h4>
                            PLAYER ONE
                        </h4>
                        <br />
                        <h6>Opponent</h6>
                        <FormControl
                            placeholder='Opponent Address'
                            type='text' value={ playerOneOpponentAddress } 
                            onChange={ (event) => 
                                setPlayerOneOpponentAddress(event.target.value) }/>
                    </Col>
                    </Row>
                    <Row className='mt-2'>
                        <Col className='text-center'>
                            {
                            choiceArray.map((choice, i) =>
                            <Button style={{marginRight: '15px'}} key={i} onClick={() => startGame(choice)}>
                                { choice }
                            </Button>
                            )}
                        </Col>
                    </Row>   
                </Col>
                
                <Col className='text-center'>
                    <Row className='mt-2'>
                    <Col className='text-center'>
                        <h4>
                            PLAYER TWO
                        </h4>
                        <br />
                        <h6>Opponent</h6>
                        <FormControl
                            placeholder='Opponent Address'
                            type='text' value={ playerTwoOpponentAddress } 
                            onChange={ (event) => 
                                setPlayerTwoOpponentAddress(event.target.value) }/>
                    </Col>
                    </Row>
                    <Row className='mt-2'>
                        <Col className='text-center'>
                            {
                            choiceArray.map((choice, i) =>
                            <Button style={{marginRight: '15px'}} key={i} onClick={() => participateGame(choice)}>
                                { choice }
                            </Button>
                            )}
                        </Col>
                    </Row>   
                </Col>
            </Row>

            <Row className='mt-5 mb-5'>
                <Col className='text-center'>
                    <h1><b>
                        { gameOutcome }
                    </b></h1>
                </Col>
            </Row>
            <Row className='mt-2 mb-5'>
                <Col md={{ span: 4, offset: 2 }} className='text-center'>
                    <h4>Player One Played: <b>{ playerOneChoice }</b></h4>
                    <br />
                    <Button variant='dark' onClick={ revealGamePlayerOne }>Player One Reveal</Button>
                </Col>
                <Col md={4} className='text-center'>
                    <h4>Player Two Played: <b>{ playerTwoChoice }</b></h4>
                    <br />
                    <Button variant='dark' onClick={ revealGamePlayerTwo }>Player Two Reveal</Button>
                </Col>
            </Row> 
            <Row className='mt-2 mb-5'>
                <Col md={{ span: 1, offset: 5 }} className='text-center'>
                    <Button variant='dark' onClick={ endGame }>End Game</Button>
                </Col>
                <Col md={1} className='text-center'>
                    <Button variant='dark' onClick={ viewGame }>View Game</Button>
                </Col>
            </Row> 

        </Container>
    )
}
