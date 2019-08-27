import React, {useContext, useState, useEffect} from 'react';
import {Form,Input,Icon,Button, Modal, Row, Col, message, Select as FormSelect, DatePicker} from 'antd'
import moment from 'moment'
import {findJobs} from '../../../../services/JobServices'
import {findStatuses} from '../../../../services/StatusServices'
import {findPriorities} from '../../../../services/PriorityServices'
import {findLevels} from '../../../../services/LevelServices'
import {findUsers} from '../../../../services/UserServices'
import {createTicket} from '../../../../services/TicketServices'
import DepartmentContext from '../../DepartmentContext'
import {isEmail,isName,isPhoneNumber} from '../../../../helpers/validator'

const {Option} = FormSelect
const {TextArea} = Input

const AddTicketModal = () => {
    const {refreshTickets} = useContext(DepartmentContext)
    const [visible, setVisible] = useState(false)
    const [options, setOptions] = useState({
        jobs : [],
        statuses : [],
        priorities : [],
        levels : [],
        emails : []
    })
    const [loading, setLoading] = useState(false)
    const [ticketData, setTicketData] = useState({
        name : '',
        email : '',
        phoneNumber : '',
        job : null,
        level : null,
        priority : null,
        status : null,
        interview_result_time : null,
        interview_date_time : null,
        receive_cv_time : null,
        cv_file : null,
        user_email : [],
        description : ''
    })

    const [pickedEmails, setPickedEmails] = useState([])
    
    const _fetchOptions = async () => {
        const responses = await Promise.all([
            findJobs(),
            findStatuses(),
            findPriorities(),
            findLevels(),
            findUsers()
        ]) 

        const [jobs, statuses, priorities, levels, userdata ] = responses.map( response => {
            const {message, data, success} = {...response}
            return data
        })
        console.log(userdata)

        const emails = !userdata ? [] : userdata.map( u => {
            return u.email
        }) 

        setOptions({
            jobs,
            statuses ,
            priorities,
            levels,
            emails
        })
    }
    
    const showModal = async () => {
        setVisible(true)
        setLoading(true)
        await _fetchOptions()
        setLoading(false)
    }

    const hideModal = () => {
        setVisible(false)
        clearData()
    }

    const handleSubmit = async e =>{
        e.preventDefault()
        const error =  validateInput()
        if (error) 
            return message.error(error)
        
        const formData = new FormData()
        formData.append('name', ticketData.name )
        formData.append('email', ticketData.email )
        formData.append('phone', ticketData.phoneNumber )
        formData.append('m_job_id', ticketData.job )
        formData.append('m_level_id', ticketData.level )
        formData.append('m_status_id', ticketData.status )
        formData.append('m_priority_id', ticketData.priority )
        formData.append('receive_cv_time', ticketData.receive_cv_time)
        formData.append('interview_date_time', ticketData.interview_date_time)
        formData.append('interview_result_time', ticketData.interview_result_time)
        formData.append('description', ticketData.description )
        formData.append('user_email', ticketData.user_email )
        formData.append('cv', ticketData.cv_file )
        formData.append('m_cvsource_id', '19' )
        setLoading(true)
        const {success, data, message : messageInfo } = await createTicket(formData)
        setLoading(false)
        if (success){
            message.success('Successfully created new tickets!')
            setVisible(false)
            clearData()
            await refreshTickets()
            return
        }

        console.log(messageInfo)
        message.error("Failed created new tickets")
    }

    const clearData = ()=>{
        setTicketData({
            name : '',
            email : '',
            phoneNumber : '',
            job : null,
            level : null,
            priority : null,
            status : null,
            interview_result_time : null,
            interview_date_time : null,
            receive_cv_time : null,
            cv_file : null,
            user_email : [],
            description : ''
        })
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

    const handleUserEmailInput = async selectOptions => {
        setTicketData({...ticketData, user_email : selectOptions})
    }

    const handleInputFile = async e => {
        setTicketData({...ticketData,cv_file : e.target.files[0]})
    }

    const validateInput = () => {
        const {name, email, phoneNumber, interview_result_time, interview_date_time, receive_cv_time} = {...ticketData}
        
        let errorMessage = ''
        if (!isEmail(email)) 
            errorMessage = errorMessage + ' email,'
        if (!isName(name)) 
            errorMessage = errorMessage + ' name,'
        if (!isPhoneNumber(phoneNumber)) 
            errorMessage = errorMessage + ' phone number,'
        if (!(receive_cv_time < interview_date_time && interview_date_time < interview_result_time)) 
            errorMessage = errorMessage + ' time input,'

        if (errorMessage)
            return 'Invalid ' + errorMessage.trim().slice(0,-1)+ '!'
        return null
    }   

    return (
        <div>
            <Button icon="plus" type="danger" onClick={showModal} className='SharpButton' >TẠO TICKET</Button>
            <Modal visible={visible}
                centered
                title={<b>TẠO TICKET&nbsp;{ !!loading && <Icon size="large" type="loading"/> }</b>}
                closable={true}
                onCancel={hideModal}
                footer={null}
                width='60vw'
                className='Sharp'
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
                                <Input id="phoneNumber" onChange={handleInput('phoneNumber')} value={ticketData.phoneNumber}
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
                                        onChange={handleInput("job")} style = {{ width : '100%'}} >
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
                            <label>Người xử lý : </label>
                            <Form.Item>
                                <FormSelect value={ticketData.user_email}
                                    onChange={handleUserEmailInput}
                                    mode='multiple' 
                                    name='user_email'
                                >
                                    {options.emails.map(opt => <Option key={opt} value={opt} >{opt}</Option>)}
                                </FormSelect>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <label>Mô tả :</label>
                            <Form.Item>
                                <TextArea id="description" onChange = {handleInput('description')}
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                    allowClear
                                    rows={4}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <label>Upload CV:</label>
                        <Form.Item>
                            <input type="file" name="cv" onChange={handleInputFile}></input>
                        </Form.Item>
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

export default AddTicketModal