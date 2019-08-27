import React, { useState, useEffect, useContext } from 'react'
import {changePassword} from '../../services/UserServices'
import { message, Button,Modal, Form, Row, Input, Icon, Col } from 'antd';
import AppContext from '../../AppContext'
import {clearCookie} from '../../helpers/cookies'

const ChangePasswordModal = () => {
    const { user, setUser } = useContext(AppContext)

    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [passwordData, setPasswordData] = useState({
        password : '',
        confirmation_password : ''
    })

    const handleInput = key => event => {
        const {target} = event
        const value = target ? target.value : event
        setPasswordData({...passwordData, [key] : value})
    }

    const showModal = async () => {
        setVisible(true)
    }

    const hideModal = async () => {
        setVisible(false)
    }

    const handleSubmit = async event => {
        setLoading(true)
        const {success, data, message : messageInfo} = await changePassword(passwordData)
        setLoading(false)
        if (success) {
            message.success('Successfully changed the password. You will be redirect to login page in 5 seconds.')
            hideModal()
            setTimeout(() => {
                setUser({
                    data : null,
                    token : null
                })
                clearCookie()
                window.location.href = '/'
            },5000)
            return
        }

        return message.error('Unable to change user password!')
    }

    return (
        <>
            <div className='SharpButton' onClick={showModal} style={{ textAlign : 'center'}}>Đổi mật khẩu</div>
            <Modal 
                centered
                title={<b>ĐỔI MẬT KHẨU&nbsp;{ !!loading && <Icon size="large" type="loading"/> }</b>}
                closable={true}
                onCancel={hideModal}
                footer={null}
                width='20vw'
                visible={visible}
            >
                <Form onSubmit={handleSubmit}>
                    <Row> 
                        <Form.Item>
                            <label>Mật khẩu mới :</label>
                            <Input.Password id="password" onChange={handleInput('password')} value={passwordData.password}
                                    style = {{ width : '100%'}}
                            />  
                        </Form.Item>
                        <Form.Item>
                            <label>Xác nhận mật khẩu mới :</label>
                            <Input.Password id="confirmation_password" onChange={handleInput('confirmation_password')} value={passwordData.confirmation_password}
                                    style = {{ width : '100%'}}
                            />  
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
        </>
    )
}

export default ChangePasswordModal