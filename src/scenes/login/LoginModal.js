import React, {useContext, useState} from 'react';
import AppContext from '../../AppContext'
import {Form,Input,Icon,Button, Modal, Row, Col, message, Alert} from 'antd'
import {setCookie} from '../../helpers/cookies'
import {signIn} from '../../services/UserServices'
import ForgetPasswordModal from './ForgetPasswordModal'

const LoginModal = () => {
    const { user, setUser } = useContext(AppContext)
    
    const [auth, setAuths] = useState({ email : '', password : ''})
    const [error, setError] = useState(false) 
    const [loading, setLoading] = useState(false)

    const handleInput = key => event => {
        event.preventDefault()
        setAuths({ ...auth, [key] : event.target.value})
    }

    const handleSubmit = async event => {
        event.preventDefault()
        setLoading(true)
        const {email, password} = auth
        const response = await signIn({email,password})
        const { id,user,role,token,department_id} = {...response}
        setLoading(false)
        if (!id || !user || !role || !token)
            return setError(true) 
        
        setError(false)
        
        const data = {id,user,role, department_id} 
        setCookie('data',data)
        setCookie('token',token)
        setUser({ data, token })

        return true
    } 
    
    
    return (
        <div>
            <Modal visible={user.data ? false : true} 
                title={<b>LOGIN&nbsp;{!!loading && <Icon type='loading' size='large' />}</b>} 
                centered 
                closable={false}
                footer={null}
            >   
                {error ? <Alert style={{ marginBottom: '2vh'}} closable message="Email or password is invalid." type="error"></Alert> : null}
                <Form onSubmit={handleSubmit}>
                    <Form.Item>
                        <Input id="username" onChange = {handleInput('email')} value={auth.email}
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Email"
                            allowClear = {true}
                        />  
                    </Form.Item>
                    <Form.Item>
                        <Input id="password" onChange = {handleInput('password')} value={auth.password}
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="Password" 
                            allowClear = {true}
                        />
                    </Form.Item>
                    <Row style={{ marginBottom : '2vh'}}>
                        <ForgetPasswordModal />                
                    </Row>
                    <Row gutter={16}>
                        <Col offset={17} span={7}>
                            <Button className='SharpButton' type="primary" size="default" onClick={handleSubmit}>
                                Login
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>
                
        </div>
    )
}

export default LoginModal