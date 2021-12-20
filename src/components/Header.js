import { Container, Navbar } from "react-bootstrap"

const Header = () => {
    return (
        <Navbar bg="dark" variant='dark'>
            <Container>
                <Navbar.Brand>
                    Webnotion test task with react-bootstrap
                </Navbar.Brand>
            </Container>
        </Navbar>
    )
}

export default Header