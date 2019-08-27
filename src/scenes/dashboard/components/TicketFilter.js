import React, {useState, useEffect} from 'react';
import { Table, Tag, Row, Col, Form, Select, Button} from 'antd';
import {findJobs} from '../../../services/JobServices'
import {findLevels} from '../../../services/LevelServices'
import {findStatuses} from '../../../services/StatusServices'
import {findPriorities} from '../../../services/PriorityServices'
import ExportCSVModal from './modals/ExportCSVModal'

const {Option} = Select

const TicketFilter = ({ setQueryOnSubmit, targetId }) => {
    const [query, setQuery] = useState({})
    const [options, setOptions] = useState({
        jobs : [],
        statuses : [],
        priorities : [],
        levels : []
    })
    const [timer, setTimer] = useState(null)

    useEffect(() => {
        _fetchOptions()
    },[])

    const _fetchOptions = async () => {
        const responses = await Promise.all([
            findJobs(),
            findStatuses(),
            findPriorities(),
            findLevels(),
        ]) 

        const [jobs, statuses, priorities, levels ] = responses.map( response => {
            const {message, data, success} = {...response}
            return data
        })
    
        return setOptions({
            jobs,
            statuses,
            priorities,
            levels
        })
    }
    
    const handleInput = (key) => async value => {
        if (value)
            query[key] = value
        else 
            delete query[key]

        clearTimeout(timer)
        
        setQuery({...query})
        
        setTimeout(() => {
            handleSubmit()
        }, 1000)
    }

    const handleSubmit = async () => {
        const {job, status, level, priority } = {...query}
        
        setQueryOnSubmit({
            m_job_id : job,
            m_status_id : status,
            m_level_id : level,
            m_priority_id : priority
        })
    }

    return (
        <div>
            <Row gutter={16}>
                <Col offset={5} span={3}>
                    <Select id="job" 
                            allowClear
                            defaultValue={query.job} 
                            placeholder='Job'
                            onChange={handleInput("job")} 
                            className='SharpButton'
                    >
                        {options.jobs.map(job => 
                            <Option value={job.id}>{job.name}</Option> 
                        )}
                    </Select>            
                </Col>
                <Col span={3}>
                    <Select id="level" 
                            allowClear
                            onChange={handleInput('level')} 
                            defaultValue={query.level}
                            className='SharpButton'
                            placeholder='Level'
                    >
                        {options.levels.map(level => 
                            <Option value={level.id}>{level.name}</Option> 
                        )}
                    </Select>
                </Col>
                <Col span={3}>
                    <Select id="status" 
                            allowClear
                            onChange={handleInput('status')} 
                            defaultValue={query.status}
                            className='SharpButton'
                            placeholder='Status'
                    >
                        {options.statuses.map(status => 
                            <Option value={status.id}>{status.name}</Option>
                        )}
                    </Select>
                </Col>
                <Col span={3}>
                    <Select id="priority" 
                            allowClear
                            defaultValue={query.priority}
                            onChange={handleInput('priority')} 
                            className='SharpButton'
                            placeholder='Priority'
                    >
                        {options.priorities.map(priority => 
                            <Option value={priority.id}>{priority.name}</Option>
                        )}
                    </Select>
                </Col>
                
                <Col span={3}>
                    <ExportCSVModal query={query} departmentId={targetId} />
                </Col>
            </Row>
        </div>

    )
}

export default TicketFilter