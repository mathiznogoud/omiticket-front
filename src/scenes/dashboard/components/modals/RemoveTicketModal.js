import React, {useState, useContext} from 'react';
import {Form, Icon,Button, Modal, Row, Col, message} from 'antd'
import {removeTicket} from '../../../../services/TicketServices'
import DepartmentContext from '../../DepartmentContext'

const RemoveTicketModal = ({ticketId, hideViewTicketModal, showViewTicketModal}) => {
    const {refreshTickets} = useContext(DepartmentContext)
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    
    const showModal = async () => {
        hideViewTicketModal()
        setVisible(true)
    }

    const hideModal = () => {
        setVisible(false)
        showViewTicketModal()
    }

    const handleSubmit = async e =>{
        e.preventDefault()
        setLoading(true)
        const {success, data, message : messageInfo } = await removeTicket(ticketId)
        setLoading(false)
        if (success){
            message.success('Successfully removed the ticket!')
            setVisible(false)
            await refreshTickets()
            return
        }

        message.error("Failed deleting the ticket")
        setVisible(false)
        await refreshTickets()
    }


    return (
        <div style={{ width : '100%'}}>
            <Button icon="delete" onClick={showModal} className='SharpButton GhostButton NoLeftBorderButton'>Xóa</Button>
            <Modal visible={visible}
                centered
                title={<b>XÓA TICKET&nbsp;{ !!loading && <Icon size="large" type="loading"/> }</b>}
                closable={true}
                onCancel={hideModal}
                footer={null}
                width='40vw'
                className='Sharp'
            >   
                <p>Bạn có chắc chắn muốn xóa ticket này ?</p>
                <Form onSubmit={handleSubmit}>
                    <Row gutter={16}>
                        <Col offset={20} span={4}>
                        
                            <Button className='SharpButton' type="primary" size="default" onClick={handleSubmit}>
                                Xác nhận
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>

    )
}

export default RemoveTicketModal