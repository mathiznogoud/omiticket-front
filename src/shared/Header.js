import React, {useContext, useState} from 'react';
import AppContext from '../AppContext'
import { Menu, Typography, Button, Row, Col, Icon, Dropdown } from 'antd';
import {clearCookie} from '../helpers/cookies'
import {Link} from 'react-router-dom'
import {signOut} from '../services/UserServices'
import ChangePasswordModal from './modals/ChangePasswordModal'

const Header = () => {
    const { user, setUser } = useContext(AppContext)
    const { role } = {...user.data}
    const isAdmin = role && (role.includes('admin') || role.includes('hr')) ? true : false

    const handleLogout = async () => {
        const {success, message} = await signOut()
        if (success) {
            setUser({
                data : null,
                token : null
            })
            clearCookie()
            window.location.href = '/'
        }
        console.log('Failed logging out!')        
    }
    const dropdownMenu = (
        <Menu>
            
            <Menu.Item key="2">
                <ChangePasswordModal />
            </Menu.Item>
            <Menu.Item key="1">
                <div className='SharpButton' onClick={handleLogout} style={{ textAlign : 'center'}}>Logout</div>
            </Menu.Item>
        </Menu>
    )

    return (
        <div style={{ textAlign : 'center' }}>
            <Menu mode="horizontal" theme="dark" >
                <Row>
                    <Col span={4}>
                        <Link to ={'/'} style={{ textAlign : 'center' }}>
                            <Typography.Text style={{ color : 'white', fontSize: '20px'}}>
                                <b>OMITICKET</b>
                            </Typography.Text>
                        </Link>
                    </Col>
                    <Col span={2}>
                        <Link to={'/'}>    
                            <Typography.Text style={{ color : 'white', fontSize : '16px'}} >
                                DASHBOARD
                            </Typography.Text>
                        </Link>
                    </Col>
                    { isAdmin ? 
                        <>
                            <Col span={1}>
                                <Link to={'/users'}>
                                    <Typography.Text style={{ color : 'white', fontSize : '16px'}} >
                                        USER
                                    </Typography.Text>
                                </Link>

                            </Col>
                            <Col span={15}></Col>
                        </>
                        : 
                        <Col span={16}></Col>
                    }
                    <Col offset={1}span={1}>
                        <Dropdown overlay={dropdownMenu} trigger={['click']}>
                            <Icon size="large" type="menu" />
                        </Dropdown>
                    </Col>
                </Row>
                
            </Menu>
        </div>
    )
}

export default Header