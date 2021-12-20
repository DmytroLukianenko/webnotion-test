import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { Alert, Button, Card, Container, Table } from "react-bootstrap"
import Loader from "react-loader-spinner"
import { useHistory } from "react-router"
import { URL } from "../App"
import { Context } from "../context"
import { converteFormat } from "./Grid"


const Info = () => {
    const { currentEmployeeId, allPositions, contractTypes } = useContext(Context)
    const [currentEmployee, setCurrentEmployee] = useState({})
    const [loader, setLoader] = useState(false)
    const [error, setError] = useState('')
    const history = useHistory()
    const getEmployye = async () => {
        setLoader(true)
        try {
            const employee = await axios.get(URL + `/employees/${currentEmployeeId}`)
            setCurrentEmployee(employee.data)

        } catch (error) {
            setError(true)
        }
        setLoader(false)
    }

    const getPosition = () => {
        return allPositions.find(p => p.id === (currentEmployee.positionId))?.name
    }

    useEffect(() => {
        getEmployye()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    console.log(error)

    return (<>
        <Container className='p-4'>
            {!error ?
                <Card >
                    <Card.Body>
                        <Card.Title>{currentEmployee.surname} {currentEmployee.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{getPosition()}</Card.Subtitle>
                        <Card.Title>All Contracts </Card.Title>
                        <Table striped bordered hover>

                            <thead>
                                <tr>
                                    <th>Contract Type</th>
                                    <th>Start date</th>
                                    <th>End date</th>
                                </tr>
                            </thead>
                            <tbody className="">
                                {!loader ? currentEmployee?.contracts?.sort((a, b) => new Date(a.from) < new Date(b.from) ? 1 : -1).map(e =>
                                    <tr key={e.id}>
                                        <td>{contractTypes.find(c => c.id === e.typeId).name}</td>
                                        <td>{e.from ? converteFormat(e.from) : '...'}</td>
                                        <td>{e.to ? converteFormat(e.to) : '...'}</td>
                                    </tr>
                                ) :
                                    <tr><td colSpan={4} className='text-center'><Loader type="BallTriangle" color="#0d6efd" /></td></tr>
                                }
                            </tbody >

                        </Table>
                    </Card.Body>
                </Card>
                :
                <Alert variant="danger" >
                    <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                    <p>It looks like you entered the address manually and the system did not receive an employee ID for more detailed information</p>
                </Alert>
            }
            <Button className='mt-3' onClick={() => history.goBack()}>Back</Button>
        </Container>
    </>)
}

export default Info