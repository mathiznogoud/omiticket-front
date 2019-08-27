import React, { useState } from 'react'
import {deleteUser} from '../../../services/UserServices'
import { message, Button,Modal, Row, Icon,Col } from 'antd';

const DeleteUserModal = ({userId, refreshUsers}) => {
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)

    const showModal = async () => {
        setVisible(true)
    }

    const hideModal = async () => {
        setVisible(false)
    }

    const handleSubmit = async event => {
        setLoading(true)
        const {success, data, message : messageInfo} = await deleteUser(userId)
        setLoading(false)
        if (success) {
            message.success('Successfully removed the user')
            hideModal()
            return await refreshUsers()
        }

        return message.error('Unable to remove the user!')
    }

    return (
        <div>
            <Button size='small' type='danger' icon='delete' onClick={showModal} />
            <Modal 
                centered
                title={<b>XÓA NGƯỜI DÙNG&nbsp;{ !!loading && <Icon size="large" type="loading"/> }</b>}
                closable={true}
                onCancel={hideModal}
                footer={null}
                width='25vw'
                visible={visible}
            >
                <p>Bạn có chắc muốn xóa người dùng này khỏi hệ thống ? </p> 
                <Row gutter={16}>
                        <Col offset={18} span={6}>
                            <Button className='SharpButton' type="primary" size="default" onClick={handleSubmit}>
                                Confirm
                            </Button>
                        </Col>
                    </Row>
            </Modal>
        </div>
    )
}

export default DeleteUserModal