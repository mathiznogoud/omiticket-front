import React, { useState, useEffect } from 'react'
import {findDepartments} from '../../../services/DepartmentServices'
import {createUser} from '../../../services/UserServices'
import { message, Button,Modal, Form, Row, Input, Icon, Select, Col } from 'antd';
import {isEmail, isName} from '../../../helpers/validator'

const AddUserModal = ({refreshUsers}) => {
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [departments, setDepartments] = useState([])
    const [userData, setUserData] = useState({
        email : '',
        department : null,
        role : 'user',
        first_name : '',
        last_name : null
    })

    const _fetchDepartment = async () =>{
        const {success, data, message : messageInfo} = await findDepartments()
        if (success){
            const fetchedDepartments = data
            setDepartments(fetchedDepartments) 
            return               
        } 
        
        return message.error('Unable to fetch departments data!')
    }

    const validateInput = () => {
        const {first_name, last_name, email} = {...userData}
        
        let errorMessage = ''
        if (!isEmail(email)) 
            errorMessage = errorMessage + ' email,'
        if (!isName(first_name)) 
            errorMessage = errorMessage + ' first name,'
        if (!isName(last_name)) 
            errorMessage = errorMessage + ' lastt name,'
        
        if (errorMessage)
            return 'Invalid ' + errorMessage.trim().slice(0,-1)+ '!'
        return null
    }   

    const handleInput = key => event => {
        const {target} = event
        const value = target ? target.value : event
        setUserData({...userData, [key] : value})
    }

    const showModal = async () => {
        setVisible(true)
        setLoading(true)
        await _fetchDepartment()
        setLoading(false)
    }

    const hideModal = async () => {
        setVisible(false)
        clearData()
    }

    const clearData = () => {
        setUserData({
            email : '',
            department : null,
            role : 'user',
            first_name : '',
            last_name : null
        })
    }

    const handleSubmit = async event => {
        event.preventDefault()
        const error =  validateInput()
        if (error) 
            return message.error(error)
        setLoading(true)
        const {success, data, message : messageInfo} = await createUser({
            email : userData.email,
            m_department_id : userData.department,
            role : userData.role,
            first_name : userData.first_name,
            last_name : userData.last_name
        })
        setLoading(false)
        if (success) {
            message.success('Successfully updated user detail!')
            hideModal()
            clearData()
            return await refreshUsers()
        }

        clearData()
        return message.error('Unable to update user detail!')
    }

    return (
        <div>
            <Button size='large' className='SharpButton' type='danger' icon='plus' onClick={showModal}>Tạo người dùng</Button>
            <Modal 
                centered
                title={<b>TẠO NGƯỜI DÙNG&nbsp;{ !!loading && <Icon size="large" type="loading"/> }</b>}
                closable={true}
                onCancel={hideModal}
                footer={null}
                width='25vw'
                visible={visible}
            >
                <Form onSubmit={handleSubmit}>
                    <Row> 
                        <Form.Item>
                            <label>Email :</label>
                            <Input id="email" onChange={handleInput('email')} value={userData.email}
                                    allowClear
                                    style = {{ width : '100%'}}
                            />  
                        </Form.Item>
                        <Form.Item>
                            <label>Tên :</label>
                            <Input id="first_name" onChange={handleInput('first_name')} value={userData.first_name}
                                    allowClear
                                    style = {{ width : '100%'}}
                            />  
                        </Form.Item>
                        <Form.Item>
                            <label>Họ :</label>
                            <Input id="last_name" onChange={handleInput('last_name')} value={userData.last_name}
                                    allowClear
                                    style = {{ width : '100%'}}
                            />  
                        </Form.Item>
                        <Form.Item>
                            <label>Vai trò :</label>
                            <Select id="role" onChange={handleInput('role')} value={userData.role}
                                    defaultValue='user'
                                    style = {{ width : '100%'}}
                            >
                                <Select.Option value='user'>User</Select.Option>
                                <Select.Option value='moderator'>Moderator</Select.Option>
                            </Select>  
                        </Form.Item>
                        <Form.Item>
                            <label>Phòng ban :</label>
                            <Select
                                value={userData.department}
                                id="department" 
                                onChange={handleInput('department')} 
                                allowClear
                                style = {{ width : '100%'}}
                            >
                                {
                                    departments.map(dept => 
                                        <Select.Option value={dept.id}>{dept.name}</Select.Option>
                                    )
                                }
                            </Select>
                        </Form.Item>
                    </Row>
                    <Row gutter={16}>
                        <Col offset={18} span={6}>
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

export default AddUserModal