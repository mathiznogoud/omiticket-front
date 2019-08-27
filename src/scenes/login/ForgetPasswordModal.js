import React, { useState } from 'react'
import {sendEmailReset, resendEmailReset} from '../../services/UserServices'
import { message, Button,Modal, Form, Row, Input, Icon, Col, Alert } from 'antd';
import {Link} from 'react-router-dom'

const ForgetPasswordModal = () => {
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [emailSent, setEmailSent] = useState(false)

    const handleInput = event => {
        const {target} = {...event}
        const {value} = {...target}
        setEmail(value)
    }

    const showModal = async () => {
        setVisible(true)
    }

    const hideModal = async () => {
        setVisible(false)
    }

    const handleSubmit = async event => {
        setLoading(true)
        const {success, data, message : messageInfo} = await sendEmailReset({email})
        setLoading(false)
        if (success) {
            setEmailSent(true)
            return
        }

        return message.error('Failed sending email!')
    }

    const handleResendEmail = async e => {
        setLoading(true)
        const {success, data, message : messageInfo} = await resendEmailReset({email})
        setLoading(false)
        if (success) {
            setEmailSent(false)
            message.success('Email xác nhận reset mật khẩu đã được gửi lại')
            return 
        }

        return message.error('Failed sending email!')
    }

    return (
        <>
            <Link onClick={showModal} style={{ float : 'right'}}>Forgot password ?</Link> 
            <Modal 
                centered
                title={<b>QUÊN MẬT KHẨU&nbsp;{ !!loading && <Icon size="large" type="loading"/> }</b>}
                closable={true}
                onCancel={hideModal}
                footer={null}
                width='20vw'
                visible={visible}
            >
                {
                    !!emailSent &&
                <Alert 
                    message="Email xác nhận reset mật khẩu đã được gửi!"
                    description={<p>Nếu bạn vẫn chưa nhận được email. Click <Link onClick={handleResendEmail}>vào đây</Link> để gửi lại.</p>}
                    type="success"
                    showIcon
                    />
                }
                <Form onSubmit={handleSubmit}>
                    <Row> 
                        <Form.Item>
                            <label>Email nhận:</label>
                            <Input id="email" onChange={handleInput} value={email}
                                    style = {{ width : '100%'}}
                            />  
                        </Form.Item>
                    </Row>
                    <Row gutter={16}>
                        <Col offset={18} span={6}>
                            <Button className='SharpButton' type="primary" size="default" onClick={handleSubmit}>
                                Send
                            </Button>
                        </Col>
                    </Row>
                </Form>
            
            </Modal>
        </>
    )
}

export default ForgetPasswordModal