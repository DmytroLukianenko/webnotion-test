import axios from 'axios'
import React, { useContext } from 'react'
import { useEffect, useState } from 'react'
import { Container, Table } from 'react-bootstrap'
import { useHistory } from 'react-router'
import { Context } from '../context'
import Filter from './Filter'
import Loader from "react-loader-spinner";
import { URL } from '../App'

export const converteFormat = (date) => {
    return date.split('-').reverse().join('.')
}

const Grid = () => {
    const [allEmployees, setAllEmployyes] = useState([])
    const [filteredEmployees, setFilteredEmployees] = useState([])
    const [filter, setFilter] = useState(false)
    const [loader, setLoader] = useState(false)
    const { setCurrentEmployeeId, setAllPositions, allPositions } = useContext(Context)
    const data = filter ? filteredEmployees : allEmployees
    const history = useHistory()

    useEffect(() => {
        getAllEmployees();
        getAllPositions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getAllEmployees = async () => {
        setLoader(true)
        const response = await axios.get(URL + '/employees')
        setAllEmployyes(response.data)
        setLoader(false)
    }

    const getAllPositions = async () => {
        const response = await axios.get(URL + '/positions')
        setAllPositions(response.data)
    }



    const activeContract = (contracts) => {
        const currentDate = new Date()
        const limitInterval = contracts.find(c => new Date(c.from) < currentDate && c.to === null)
        const openInterval = contracts.find(c => new Date(c.from) < currentDate && currentDate < new Date(c.to))
        if (limitInterval) {
            return <p key={limitInterval.id}>{converteFormat(limitInterval.from)} - ...</p>
        } else if (openInterval) {
            return <p key={openInterval.id}>{converteFormat(openInterval.from)} - {converteFormat(openInterval.to)}</p>
        } else {
            return <p>-</p>
        }
    }

    const handleClick = (e) => {
        const { id } = e.target
        setCurrentEmployeeId(id)
        history.push('/info')
    }

    return (

        <Container>
            <Filter
                allPositions={allPositions}
                allEmployees={allEmployees}
                URL={URL}
                setFilter={setFilter}
                filter={filter}
                setFilteredEmployees={setFilteredEmployees}
            />
            <Table striped bordered hover >
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Active contract</th>
                    </tr>
                </thead>
                <tbody>
                    {!loader ? data?.sort((a, b) => a.surname.localeCompare(b.surname) || a.name.localeCompare(b.name)).map(emp =>
                        <tr key={emp.id} onClick={e => handleClick(e)}>
                            <td id={emp.id}>{emp.id}</td>
                            <td id={emp.id}>{`${emp.surname} ${emp.name}`}</td>
                            <td id={emp.id}>{allPositions.find(pos => pos.id === emp.positionId)?.name}</td>
                            <td id={emp.id}>{activeContract(emp.contracts)}</td>
                        </tr>
                    ) : <tr><td colSpan={4} className='text-center'><Loader type="BallTriangle" color="#0d6efd" /></td></tr>}
                </tbody >
            </Table >
        </Container >
    )
}

export default Grid