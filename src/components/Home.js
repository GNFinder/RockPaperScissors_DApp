import logo from '../logo.svg';
import { Container, Row, Col, Image } from 'react-bootstrap';

const Home = () => {
    return (
        <Container>
            <Row>
                <Col className='text-center'>
                    <h1>
                        Welcome
                    </h1>
                </Col>
            </Row> 
            <Row>
                <Col className='text-center'>
                    <Image src={logo} className="App-logo" alt="logo" fluid />
                </Col>
            </Row> 
            <Row>
                <Col className='text-center'>
                    <h2>
                        OSFD Intern DAO ...
                    </h2>
                </Col>
            </Row> 
            <Row>
                <Col className='text-center'>
                    <h3>
                        <Col className='text-center'>
                        <a 
                        href='/rps-ethereum-v2' 
                        target='RPSETH_v2'>
                            Rock Paper Scissors Game
                        </a>
                        </Col>
                    </h3>
                </Col>
            </Row> 
            <Row>
                <Col className='text-center'>
                    <a 
                    href='https://github.com/GNFinder'
                    target='_blank' rel="noreferrer">
                        View the GitHub
                    </a>
                </Col>
            </Row> 
            <Row>
                <Col className='text-center'>
                    <a 
                    href='https://twitter.com/JamalForbes_'
                    target='_blank' rel="noreferrer">
                        View the Twitter
                    </a>
                </Col>
            </Row> 
            <Row>
                <Col className='text-center'>
                    <a 
                    href='https://www.notion.so/Rock-Paper-Scissors-The-Cool-Way-7330e28b8dc64fc0b5bc967911b5d93b'
                    target='_blank' rel="noreferrer">
                        View the Blog
                    </a>
                </Col>
            </Row> 
        </Container>
    )
}

export default Home
