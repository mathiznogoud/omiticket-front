import React, {useState, useEffect, useContext} from 'react';
import {Form,Input,Icon,Button, Modal, Row, Col, message, Select as FormSelect, DatePicker} from 'antd'
import moment from 'moment'
import {findJobs} from '../../../../services/JobServices'
import {findStatuses} from '../../../../services/StatusServices'
import {findPriorities} from '../../../../services/PriorityServices'
import {findLevels} from '../../../../services/LevelServices'
import {updateTicket, findTicketById} from '../../../../services/TicketServices'
import {isEmail,isName,isPhoneNumber} from '../../../../helpers/validator'
import DepartmentContext from '../../DepartmentContext'

import '../../../../App.css'
const {Option} = FormSelect
const {TextArea} = Input

const EditTicketModal = ({ticketId, showViewTicketModal, hideViewTicketModal }) => {
    const {refreshTickets} = useContext(DepartmentContext)
    const [visible, setVisible] = useState(false)
    const [options, setOptions] = useState({
        jobs : [],
        statuses : [],
        priorities : [],
        levels : []
    })
    const [loading, setLoading] = useState(false)
    const [ticketData, setTicketData] = useState({
        name : '',
        email : '',
        phone : '',
        job : null,
        level : null,
        priority : null,
        status : null,
        interview_result_time : null,
        interview_date_time : null,
        receive_cv_time : null,
        description : ''
    })

    
    const _fetchTicket = async ticketId => {
        const {success, data, message : messageInfo} = await findTicketById(ticketId)
        if (success){
            const {candidate, job, level,status, priority, receive_cv_time, interview_date_time, interview_result_time, description} = {...data}
            const [vJob, vLevel, vStatus, vPriority] = [job,level,status,priority].map( model => {
                const {id} = {...model}
                return id
            })

            const {name,email, phone} = {...candidate}
            
            return setTicketData({
                ...ticketData,
                name,
                email, 
                phone,
                job : vJob,
                level : vLevel,
                status : vStatus,
                priority : vPriority,
                receive_cv_time,
                interview_date_time,
                interview_result_time,
                description,
            })
            
        }
        
        return message.error('Unable to fetch ticket data!')
    }

    const validateInput = () => {
        const {name, email, phone, interview_result_time, interview_date_time, receive_cv_time} = {...ticketData}
        
        let errorMessage = ''
        if (!isEmail(email)) 
            errorMessage = errorMessage + ' email,'
        if (!isName(name)) 
            errorMessage = errorMessage + ' name,'
        if (!isPhoneNumber(phone)) 
            errorMessage = errorMessage + ' phone number,'
        if (!(receive_cv_time < interview_date_time && interview_date_time < interview_result_time)) 
            errorMessage = errorMessage + ' time input,'

        if (errorMessage)
            return 'Invalid ' + errorMessage.trim().slice(0,-1)+ '!'
        return null
    }   

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
            ...options,
            jobs,
            statuses,
            priorities,
            levels
        })
    }
    
    const showModal = async () => {
        hideViewTicketModal()
        setVisible(true)
        setLoading(true)
        await _fetchTicket(ticketId)
        await _fetchOptions()
        setLoading(false)
    }

    const hideModal = () => {
        setVisible(false)
        showViewTicketModal()
    }

    const handleSubmit = async e =>{
        e.preventDefault()
        
        const error =  validateInput()
        if (error) 
            return message.error(error)
        

        setLoading(true)

        const submitData = {
            name : ticketData.name,
            email : ticketData.email,
            phone : ticketData.phone,
            m_job_id : ticketData.job,
            m_level_id : ticketData.level,
            m_priority_id : ticketData.priority,
            m_status_id : ticketData.status,
            interview_result_time : ticketData.interview_result_time,
            interview_date_time : ticketData.interview_date_time,
            receive_cv_time : ticketData.receive_cv_time,
            description : ticketData.description
        }
        const {success, data, message : messageInfo } = await updateTicket({ ticketId, data : submitData})
        setLoading(false)
        
        if (success){
            message.success('Successfully updated the ticket!')
            hideModal()
            return await refreshTickets()
        }

        return message.error("Failed updated the ticket")
    }

    const handleInput = (key) => event => {
        const {target} = event
        const value = target ? target.value : event
        setTicketData({...ticketData, [key] : value})
    }

    const handleDatePick = (key) => (date, dateString) => {
        const vDateString = moment(dateString).format('YYYY-MM-DD HH:mm:ss')
        setTicketData({...ticketData, [key] : vDateString})
    }

    console.log(ticketData)

    return (
        <div style={{ width : '100%'}}>
            <Button icon="edit" onClick={showModal} className='SharpButton GhostButton NoLeftBorderButton'>Sửa</Button>
            <Modal visible={visible}
                centered
                title={<b>SỬA TICKET&nbsp;{ !!loading && <Icon size="large" type="loading"/> }</b>}
                closable={true}
                onCancel={hideModal}
                footer={null}
                width='60vw'
            >   
                
                <Form onSubmit={handleSubmit}>
                    <Row gutter={16}>
                        <Col span={8}>
                            <label>Họ và tên:</label>
                            <Form.Item>
                                <Input id="name" onChange={handleInput('name')} value={ticketData.name}
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    allowClear = {true}
                                />  
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <label>Email:</label>
                            <Form.Item>
                                <Input id="email" onChange={handleInput('email')} value={ticketData.email}
                                    prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    allowClear = {true}
                                />  
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <label>Phone number:</label>
                            <Form.Item>
                                <Input id="phone" onChange={handleInput('phone')} value={ticketData.phone}
                                    prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    allowClear = {true}
                                />  
                            </Form.Item>
                        </Col>
                    </Row>
                    <hr style={{ opacity : '0.4', marginBottom: '3vh'}}/>
                    <Row gutter={16}>
                        <Col span={6}>
                            <label>Công việc : </label>
                            <Form.Item>
                                <FormSelect id="job" 
                                        value={ticketData.job}
                                        onChange={handleInput('job')} style = {{ width : '100%'}} >
                                    { options.jobs.map( job => {
                                        return <Option value={job.id}>{job.name}</Option>
                                    })}
                                </FormSelect>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <label>Trình độ :</label>
                            <Form.Item>
                                <FormSelect id="level" 
                                        value={ticketData.level}
                                        onChange={handleInput('level')} 
                                        style = {{ width : '100%'}} 
                                >
                                    { options.levels.map( level => {
                                        return <Option value={level.id}>{level.name}</Option>
                                    })}
                                </FormSelect>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <label>Trạng thái :</label>
                            <Form.Item>
                                <FormSelect id="status" 
                                        value={ticketData.status}
                                        onChange={handleInput('status')} 
                                        style = {{ width : '100%'}} 
                                >
                                    { options.statuses.map( status => {
                                        return <Option value={status.id}>{status.name}</Option>
                                    })}
                                </FormSelect>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <label>Độ ưu tiên :</label>
                            <Form.Item>
                                <FormSelect id="priority" 
                                        value={ticketData.priority}
                                        onChange={handleInput('priority')} 
                                        style = {{ width : '100%'}} 
                                >
                                    { options.priorities.map( priority => {
                                        return <Option value={priority.id}>{priority.name}</Option>
                                    })}
                                </FormSelect>
                            </Form.Item>
                        </Col>
                    </Row>
                    <hr style={{ opacity : '0.4', marginBottom: '3vh'}}/>
                    <Row gutter={16}>
                        <Col span={8}>
                            <label>Thời gian tiếp nhận hồ sơ : </label>
                            <Form.Item>
                                <DatePicker id="receive_cv_time" onChange = {handleDatePick('receive_cv_time')} value={ticketData.receive_cv_time ? moment(ticketData.receive_cv_time) : null}
                                        prefix={<Icon type="calendar" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        allowClear = {true}
                                        format='YYYY-MM-DD HH:mm'
                                        showTime
                                />  
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <label>Thời gian phỏng vấn : </label>
                            <Form.Item>
                                <DatePicker id="interview_date_time" onChange = {handleDatePick('interview_date_time')} value={ticketData.interview_date_time ? moment(ticketData.interview_date_time) : null}
                                        prefix={<Icon type="calendar" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        allowClear = {true}
                                        format='YYYY-MM-DD HH:mm'
                                        showTime
                                />  
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <label>Thời gian trả kết quả : </label>
                            <Form.Item>
                                <DatePicker id="interview_result_time" onChange = {handleDatePick('interview_result_time')} value={ticketData.interview_result_time ? moment(ticketData.interview_result_time) : null}
                                        prefix={<Icon type="calendar" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        allowClear = {true}
                                        format='YYYY-MM-DD HH:mm'
                                        showTime
                                />  
                            </Form.Item>
                        </Col>
                    </Row>
                    <hr style={{ opacity : '0.4', marginBottom: '3vh'}}/>
                    <Row gutter={16}>
                        <Col span={12}>
                            <label>Mô tả :</label>
                            <Form.Item>
                                <TextArea id="description" onChange = {handleInput('description')}
                                    value={ticketData.description}
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                    allowClear
                                    rows={4}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col offset={20} span={4}>
                        
                            <Button className='SharpButton' type="primary" size="default" onClick={handleSubmit}>
                                Submit
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>

    )
}

export default EditTicketModal