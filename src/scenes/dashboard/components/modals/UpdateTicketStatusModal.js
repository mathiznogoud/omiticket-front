import React, {useState, useEffect} from 'react';
import {Form,Icon,Button, Modal, Row, Col, message, Select as FormSelect, DatePicker} from 'antd'
import {findStatuses} from '../../../../services/StatusServices'
import {updateTicketStatus, findTicketById} from '../../../../services/TicketServices'
const {Option} = FormSelect

const UpdateTicketStatusModal = ({ticketId}) => {
    const [visible, setVisible] = useState(false)
    const [options, setOptions] = useState({
        statuses : []
    })
    const [loading, setLoading] = useState(false)
    const [ticketData, setTicketData] = useState({
        status : null
    })

    
    const _fetchTicket = async ticketId => {
        const {success, data, message : messageInfo} = await findTicketById(ticketId)
        if (success){
            const {status} = {...data}
            const {id : statusId} = {...status}

            return setTicketData({
                status : statusId
            })
            
        }        
        return message.error('Unable to fetch ticket data!')
    }

    const _fetchOptions = async () => {
        const {message, data, success} = await findStatuses()

        if (success)
            return setOptions({
                statuses : data
            })
    }
    
    const showModal = async () => {
        setVisible(true)
        setLoading(true)
        await _fetchTicket(ticketId)
        await _fetchOptions()
        setLoading(false)
    }

    const hideModal = () => {
        setVisible(false)
    }

    const handleSubmit = async e =>{
        e.preventDefault()
        setLoading(true)

        const submitData = {
            m_status_id : ticketData.status,
        }

        const {success, data, message : messageInfo } = await updateTicketStatus({ ticketId, data : submitData})
        setLoading(false)
        
        if (success){
            message.success('Successfully updated the ticket!')
            return hideModal()
        }

        return message.error("Failed updated the ticket")
    }

    const handleInput = (key) => event => {
        const {target} = event
        const value = target ? target.value : event
        console.log(typeof value , value)
        setTicketData({...ticketData, [key] : value})
    }


    return (
        <div style={{ width : '100%'}}>
            <Button icon="edit" onClick={showModal} className='SharpButton GhostButton'>Sửa</Button>
            <Modal visible={visible}
                centered
                title={<b>SỬA TICKET&nbsp;{ !!loading && <Icon size="large" type="loading"/> }</b>}
                closable={true}
                onCancel={hideModal}
                footer={null}
                width='30vw'
            >   
                
                <Form onSubmit={handleSubmit}>
                    <Row gutter={16}>
                        <Col span={24}>
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

export default UpdateTicketStatusModal