import React, { useState, useContext} from 'react';
import {Button, Row, Col,Checkbox, Tooltip} from 'antd'
import {exportAll, exportByDepartment} from '../../../../services/TicketServices'
import fileDownload from 'react-file-download'
import AppContext from '../../../../AppContext'

const ExportCSVModal = ({query, departmentId}) => {
    const {user, setUser} = useContext(AppContext)
    const {data} = {...user}
    const {role} = {...data}
    const isAdmin = (role.includes('admin') || role.includes('hr')) ? true : false 
    const [all, setAll] = useState(false)
    
    const requestForCSVReport = async () => {
        const {job, status, level, priority } = {...query}
        
        const submitQuery = {
            m_job_id : job,
            m_status_id : status,
            m_level_id : level,
            m_priority_id : priority
        }

        if (all){
            const response = await exportAll(submitQuery)
            fileDownload(response,'tickets.csv')
            return 
        }
        
        const response = await exportByDepartment(departmentId, submitQuery)
        return fileDownload(response, 'tickets.csv')
    }   

    const handleCheckBox = e => { 
        setAll(e.target.checked) 
    }

    if (isAdmin)
        return (
            <Row>
                <Col span={12}>
                    <Button className='SharpButton' type="primary" onClick={requestForCSVReport}>EXPORT</Button>
                </Col>
                <Col offset={3} span={9}>
                    <Checkbox style={{ marginTop : '5px'}} onChange={handleCheckBox}>
                        <Tooltip placement="topLeft" title='Export tickets from all departments'>
                            All
                        </Tooltip>
                    </Checkbox>
                </Col>
            </Row>
        )
    
    return (<></>)
}

export default ExportCSVModal