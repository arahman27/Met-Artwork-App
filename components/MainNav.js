import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState} from 'react';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/store';
import { addToHistory } from '@/lib/userData';
import { removeToken, readToken } from '@/lib/authenticate';

export default function MainNav() {
    const router = useRouter();
    const [searchField, setSearchField] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

    let token = readToken();

    function logout(){
        setIsExpanded(false);
        removeToken();
        router.push('/login')

    }

    async function submitForm(e){
        e.preventDefault();
        setIsExpanded(false);
        setSearchHistory(await addToHistory(`title=true&q=${searchField}`)) 
        router.push(`/artwork?title=true&q=${searchField}`);

    }

    return(
        <>
            <Navbar className="fixed-top" bg="dark" variant="dark" expand="lg" expanded={isExpanded}>
                <Container>
                <Navbar.Brand>Aditya Rahman</Navbar.Brand>
                <Navbar.Toggle aria-controls={"basic-navbar-nav"} onClick={() => setIsExpanded(!isExpanded)}/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link href="/" passHref legacyBehavior><Nav.Link href="/" active={router.pathname === "/"} onClick={() => setIsExpanded(false)}>Home</Nav.Link></Link>
                        {token && <Link href="/search" passHref legacyBehavior><Nav.Link href="/search" active={router.pathname === "/search"} onClick={() => setIsExpanded(false)}>Advanced Search</Nav.Link></Link>}
                    </Nav>
                    &nbsp;{token && <Form className="d-flex" onSubmit={submitForm}>
                        <Form.Control
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value)}
                        />
                        <Button variant="outline-success" type="submit">Search</Button>
                    </Form>}&nbsp;
                    {token &&<Nav className="me-auto">
                        <NavDropdown title={token.userName} id="basic-nav-dropdown">
                            <Link href="/favourites" passHref><NavDropdown.Item href="/favourites" active={router.pathname === "/favourites"} onClick={() => setIsExpanded(false)}>
                                Favourites
                            </NavDropdown.Item></Link>
                            <Link href="/history" passHref><NavDropdown.Item href="/history" active={router.pathname === "/history"} onClick={() => setIsExpanded(false)}>
                                Search History
                            </NavDropdown.Item></Link>
                            <NavDropdown.Item onClick={() => logout()}>
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>}
                    {!token &&<Nav className="me-auto">
                        <Link href="/register" passHref active={router.pathname === "/register"} onClick={() => setIsExpanded(false)}>
                            Register
                        </Link>
                        
                        <Link href="/login" passHref active={router.pathname === "/login"} onClick={() => setIsExpanded(false)}>
                            / Login
                        </Link>
                    </Nav>}
                </Navbar.Collapse>
                </Container>
            </Navbar>
            <br/>
            <br/>
        </>
    ); 
}