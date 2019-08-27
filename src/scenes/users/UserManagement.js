import React, { useState, useContext, useEffect } from "react";
import AppContext from '../../AppContext'
import {findUsers} from '../../services/UserServices'
import AddUserModal from './modals/AddUserModal'
import EditUserModal from './modals/EditUserModal'
import DeleteUserModal from './modals/DeleteUserModal'
import moment from 'moment'
import { message, Table, Col, Button, Row, Tag } from "antd";

const {Column} = Table

const UserManagement = () => {
    const {user, setUser} = useContext(AppContext)
    const [users, setUsers ] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        refreshUsers()
    },[])

    const _fetchUsers = async () => {
        const {success, data, message : messageInfo} = await findUsers()
        if (success) {
            console.log(data)
            setUsers(data)
            return
        }

        message.error('Unable to fetch users data!')
    }

    const refreshUsers = async () => {
        setLoading(true)
        await _fetchUsers()
        setLoading(false)
    }

    const renderActions = (record) => {
        const {data} = {...user}
        const {id} = {...data}
        if (id=== record.id)
            return null
            
        return (
            <Row>
                <Col span={6}>
                    <EditUserModal userId={record.id} refreshUsers={refreshUsers}/>
                </Col> 
                <Col span={6}>
                    <DeleteUserModal userId={record.id} refreshUsers={refreshUsers} />
                </Col>
            </Row>
        )
    }

    const renderRole = (role) => {
        if (role === 'admin')
            return <Tag color='#ff4d4d'>ADMIN</Tag>
        if (role === 'hr')
            return <Tag color='#e69900'>HR</Tag>
        if (role === 'user')
            return <Tag color='#999999'>USER</Tag>
        if (role === 'moderator')
            return <Tag color='#00cc00'>MODERATOR</Tag>
        return null
    }

    return (
        <div style={{ marginTop : '20px', paddingLeft : '5vw', paddingRight : '5vw', paddingTop : '5vh', paddingBottom : '5vh'}}>
            <Row>
                <Col offset={21} span={3}>
                    <AddUserModal refreshUsers={refreshUsers}/> 
                </Col>
            </Row>
            <div style={{ marginTop : '3vh'}}>
                <Table dataSource = {users} 
                    expandRowByClick={true} 
                    loading={loading} 
                    pagination={false}
                    bordered
                    style={{ backgroundColor : 'white'}}
                >
                    <Column title="STT" key="index" render = {(text, record, index) => (<span>{ index + 1 }</span>) } />
                    <Column title="Tên" key="name" render = {(text, record) => <p>{record.first_name + ' ' + record.last_name}</p>} />
                    <Column title="Email" key="email" render = {(text, record) => <p>{record.email}</p>} />
                    <Column title="Vai trò" key="role" render = {(text, record) => renderRole(record.role) }/>
                    <Column title="Thời gian tạo" key="created_at" render = {(text, record) => <p>{moment(record.created_at).format('DD/MM/YYYY HH:mm')}</p> }/>

                    <Column title="Phòng ban" key="department" render = {(text, record) => <p>{record.department}</p>} />
                    
                    <Column title="Thao tác" key="action" render={(text, record) => renderActions(record) } />
                </Table>
            </div>
            
        </div>
        
    )
}

export default UserManagement