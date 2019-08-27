import React, {useContext,useState, useEffect} from 'react';
import moment from 'moment'
import { Table, Tag, Row, Col, Button } from 'antd';
import TicketFilter from './TicketFilter'
import AppContext from '../../../AppContext'
import {findTickets, findTicketsByDepartment} from '../../../services/TicketServices'
import ViewTicketModal from './modals/ViewTicketModal'
import AddTicketModal from './modals/AddTicketModal'
import DepartmentContext from '../DepartmentContext'
import AddJobModal from './modals/AddJobModal'

const {Column} = Table

const DepartmentDetail = ({targetId}) => {
    const { user } = useContext(AppContext)
    const [query, setQuery] = useState({})
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        refreshTickets()
    },[targetId, query])

    const _fetchTickets = async () => {
        if (!targetId) 
            return
        const {data} = {...user}
        const {role, department_id } = {...data}

        if (role.includes('admin') || role.includes('hr')){
            const response = await findTicketsByDepartment(targetId, query)
            const {success, data : fetchedTickets, message} = {...response}
            setTickets([...fetchedTickets])
        }
        else {
            if (department_id.toString() === targetId.toString()){
                const response = await findTickets(query)
                const {success, data : fetchedTickets, message} = {...response}
                return setTickets([...fetchedTickets])
            }
            else {
                setTickets([]) 
            }
                
        }
    } 

    const refreshTickets = async () =>{
        setLoading(true)
        await _fetchTickets()
        setLoading(false)
    }

    const canAddTicket = () => {
        const {role} = {...user.data}
        if (role.includes('admin') || role.includes('hr'))
            return true
        return false
    }

    const renderActions = ticketId => {
        return (
            <Row>
                <Col span={8}>
                    <ViewTicketModal ticketId={ticketId}/>
                </Col>
            </Row>
        )
    }

    const renderPriorityTag = (tagName) => {
        if (tagName === 'Low')
            return <Tag color='#b3b3b3'>{tagName}</Tag>
        if (tagName === 'Normal')
            return <Tag color='#595959'>{tagName}</Tag>
        if (tagName === 'High')
            return <Tag color='#ffb31a'>{tagName}</Tag>
        if (tagName === 'Urgent')
            return <Tag color='#e67300'>{tagName}</Tag>
        if (tagName === 'Immediate') 
            return <Tag color='#ff471a'>{tagName}</Tag>
        return null
    }

    return (
        <DepartmentContext.Provider value = {{ refreshTickets }} >
            <div style={{ marginTop : '20px'}}>
                <div>
                    { 
                        canAddTicket() ? 
                        <Row gutter={0}>
                            <Col offset={17} span={3}>
                                <AddJobModal />
                            </Col>   
                            <Col span={3}>
                                <AddTicketModal />
                            </Col>
                        </Row>
                        : null
                    }
                </div>
                <div style={{ margin : '30px'}}>
                    <Row>
                        <TicketFilter setQueryOnSubmit={setQuery} targetId={targetId}/>
                    </Row>
                    <Row>
                        <Col span={4}><h3><b>Total : {tickets.length} tickets</b></h3></Col>
                    </Row>
                    <div>
                        <Table dataSource = {tickets} 
                            expandRowByClick={true} 
                            loading={loading} 
                            pagination={false}
                            bordered
                            style={{ backgroundColor : 'white'}}
                        >
                            <Column title="STT" key="index" render = {(text, record, index) => (<span>{ index + 1 }</span>) } />
                            <Column title="Tên" key="name" render = {(text, record) => <p>{record.candidate.name}</p>} />
                            <Column title="Công việc" key="job" render = {(text, record) => <p>{record.job.name}</p>} />
                            <Column title="Trình độ" key="level" render = {(text, record) => <p>{record.level.name}</p>} />
                            <Column title="Trạng thái" key="status" render = {(text, record) => <Tag color="#87d068">{record.status.name}</Tag>} />
                            <Column title="Ưu tiên" key="priority" render = {(text, record) => renderPriorityTag(record.priority.name)} />
                            <Column title="Thời gian tiếp nhận" key="receive_cv_time" render= {(text,record) => <p>{moment(record.receive_cv_time).format('DD/MM/YYYY HH:mm')}</p>}/>  
                            <Column title="Thời gian phỏng vấn" key="interview_date_time" render= {(text,record) => <p>{moment(record.interview_date_time).format('DD/MM/YYYY HH:mm')}</p>}/> 
                            <Column title="Thời gian trả kết quả" key="interview_result_time" render= {(text,record) => <p>{moment(record.interview_result_time).format('DD/MM/YYYY HH:mm')}</p>}/>  
                            <Column title="Mô tả" key="description" render={(text,record) => <p>{record.description}</p> } />
                            <Column title="Thao tác" render={(text,record) => renderActions(record.id)} />
                        </Table>
                    </div>
                </div>
            </div>
        </DepartmentContext.Provider>
    )
}

export default DepartmentDetail