import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import { Context } from '../context'

const Filter = ({ allPositions, setFilteredEmployees, allEmployees, URL, setFilter, filter }) => {
    const [value, setValue] = useState({})
    const { contractTypes, setContractTypes } = useContext(Context)
    const currentDate = new Date()

    useEffect(() => {
        getContractTypes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        getEmployeesPosition(value.position)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value.position])

    const handleInputChange = (e) => {
        const { value, name } = e.target
        setValue({ [name]: value })
    }

    const getEmployeesPosition = async () => {
        if (!value.position) {
            setFilter(false)
            return
        } else {
            const response = await axios.get(URL + `/employees?positionId=${value.position}`)
            setFilter(true)
            setFilteredEmployees(response.data)
        }
    }

    const getContractTypes = async () => {
        const response = await axios.get(URL + '/contractTypes ')
        setContractTypes(response.data)
    }

    const filterByContract = (e) => {
        handleInputChange(e)
        const { value } = e.target
        const filtered = []
        if (!value) {
            setFilter(false)
            return
        } else {
            setFilter(true)
            allEmployees.forEach(e => {
                const contr = e.contracts.find(c => c.typeId === Number(value) && currentDate > new Date(c.from) && (currentDate < new Date(c.to) || c.to === null))
                if (contr) {
                    filtered.push(e)
                }
                setFilteredEmployees(filtered)
            })
        }
    }

    const filterByActiveContract = (e) => {
        handleInputChange(e)
        const { value } = e.target
        const filtered = []
        if (value === 'all') {
            setFilter(false)
            return
        } else if (value === 'active') {
            allEmployees.forEach(e => {
                const activeEmployee = e.contracts.find(c => (currentDate < new Date(c.to) || c.to === null) && currentDate > new Date(c.from))
                if (activeEmployee) {
                    filtered.push(e)
                }
                setFilter(true)
                setFilteredEmployees(filtered)
            })
        } else if (value === 'unactive') {
            allEmployees.forEach(e => {
                const unactiveEmp = e.contracts.find(c => (currentDate < new Date(c.to) || c.to === null) && currentDate > new Date(c.from))
                if (!unactiveEmp) {
                    filtered.push(e)
                    setFilteredEmployees(filtered)
                    setFilter(true)
                }
            })
        }
    }

    const filterByName = (e) => {
        handleInputChange(e)
        setFilter(true)
        const { value } = e.target
        const result = allEmployees.filter(emp => emp.surname.toLowerCase().includes(value.toLowerCase()))
        setFilteredEmployees(result)
        setFilter(true)
    }

    return (
        <Container className="p-5">
            <Row className='mt-2'>
                <Col lg="2">
                    <Form.Label>Position</Form.Label>
                </Col>
                <Col lg="4" >
                    <Form.Select name='position' value={value.position ?? ''} onChange={e => handleInputChange(e)}>
                        <option value={''}>Choose position</option>
                        {allPositions
                            .sort((a, b) => a.orderIdx - b.orderIdx)
                            .map(pos => (
                                <option key={pos.id} value={pos.id}>
                                    {pos.name}
                                </option>
                            ))}
                    </Form.Select>
                </Col>
            </Row>
            <Row className='mt-2'>
                <Col lg="2">
                    <Form.Label>Contract Type</Form.Label>
                </Col>
                <Col lg="4">
                    <Form.Select name='contractType' value={value.contractType ?? ''} onChange={e => filterByContract(e)}>
                        <option value={''}>Choose contract type</option>
                        {contractTypes &&
                            contractTypes.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                    </Form.Select>
                </Col>
            </Row >
            <Row className='mt-2'>
                <Col lg="2">
                    <Form.Label>Active/Unactive</Form.Label>
                </Col>
                <Col lg="4">
                    <Form.Select name='status' value={value.status ?? ''} onChange={e => filterByActiveContract(e)}>
                        <option value={''}>Choose contract status</option>
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="unactive">Unactive</option>
                    </Form.Select>
                </Col>
            </Row>
            <Row>
                <Form.Group>
                    <Form.Label>Filter by Name</Form.Label>
                    <Form.Control name='nameFilter' type='text' value={value.nameFilter ?? ''} onChange={(e) => filterByName(e)}></Form.Control>
                </Form.Group>
            </Row>
            <Row className='' >
                <Col lg='2'>
                    <Button className='mt-2' onClick={() => { setFilter(false); setValue({}) }} disabled={!filter}>Cancel filter</Button>
                </Col>

            </Row>
        </Container >
    )
}
export default Filter
