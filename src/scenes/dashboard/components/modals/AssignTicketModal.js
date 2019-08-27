import React, {useState, useEffect} from 'react';
import {Form,Input,Icon,Button, Modal, Row, Col, message, Select} from 'antd'
import {findTicketById, assignTicket} from '../../../../services/TicketServices'
import {findUsers} from '../../../../services/UserServices'

const {Option} = Select
const AssignTicketModal = ({ticketId, refreshTicketDetail}) => {
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [ticketData, setTicketData] = useState({
        user_email : []
    })
    const [emailOptions , setEmailOptions] = useState([])

    
    const _fetchTicket = async ticketId => {
        const {success, data, message : messageInfo} = await findTicketById(ticketId)
        if (success){
            const {user} = {...data}
            const vUser_email = user ? user.map( u => u.email) : []    

            return setTicketData({
                user_email : vUser_email
            })
            
        }
        
        return message.error('Unable to fetch ticket data!')
    }
    
    const _fetchUsers = async () => {
        const {success, data, message : messageInfo} = await findUsers()
        if (success) {
            const emails = !data ? [] : data.map( u => {
                return u.email
            }) 

            setEmailOptions(emails)
        }
    }

    const showModal = async () => {
        setVisible(true)
        setLoading(true)
        await _fetchUsers()
        await _fetchTicket(ticketId)
        setLoading(false)
    }

    const hideModal = () => {
        setVisible(false)
        refreshTicketDetail()
    }

    const handleUserEmailInput = async selectedItems => {
        console.log(selectedItems)
        setTicketData({user_email : selectedItems})
    }

    const handleSubmit = async e =>{
        e.preventDefault()
        setLoading(true)

        const {success, data, message : messageInfo } = await assignTicket({ ticketId, data : ticketData})
        setLoading(false)
        
        if (success){
            message.success('Successfully updated the ticket!')
            return hideModal()
        }

        return message.error("Failed updated the ticket")
    }

    return (
        <div style={{ width : '100%'}}>
            <Button icon="user"  onClick={showModal} className='SharpButton GhostButton NoLeftBorderButton'>Phân công</Button>
            <Modal visible={visible}
                centered
                title={<b>PHÂN CÔNG&nbsp;{ !!loading && <Icon size="large" type="loading"/> }</b>}
                closable={true}
                onCancel={hideModal}
                footer={null}
                width='30vw'
            >   
                
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <label>Người xử lý : </label>
                        <Form.Item>
                            <Select
                                placeholder='Chọn người được phân công...'
                                mode='multiple'
                                value={ticketData.user_email}
                                onChange={handleUserEmailInput}
                                style={{ width: '100%' }}
                            >
                                { emailOptions.map( option => <Option key={option} value={option}>{option}</Option>)}
                            </Select>
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

export default AssignTicketModal