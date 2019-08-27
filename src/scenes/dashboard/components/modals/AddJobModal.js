import React, { useState } from 'react'
import {createJob} from '../../../../services/JobServices'
import { message, Button,Modal, Form, Row, Input, Icon, Col } from 'antd';

const AddJobModal = () => {
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [jobName, setJobName] = useState('')

    const handleInput = event => {
        const {target} = {...event}
        const {value} = {...target}
        setJobName(value)
    }

    const showModal = async () => {
        setVisible(true)
    }

    const hideModal = async () => {
        setVisible(false)
    }

    const handleSubmit = async event => {
        event.preventDefault()
        setLoading(true)
        const {success, data, message : messageInfo} = await createJob({
            name : jobName,
            key_name : 'job',
            sort : 'job'
        })
        setLoading(false)
        if (success) {
            message.success('Successfully created new job.')
            return hideModal()
        }

        return message.error('Failed sending email!')
    }

    return (
        <>
            <Button icon="audit" type="primary" onClick={showModal} className='SharpButton' >TẠO JOB</Button>
            <Modal 
                centered
                title={<b>TAỌ JOB&nbsp;{ !!loading && <Icon size="large" type="loading"/> }</b>}
                closable={true}
                onCancel={hideModal}
                footer={null}
                width='20vw'
                visible={visible}
            >
                <Form onSubmit={handleSubmit}>
                    <Row> 
                        <Form.Item>
                            <label>Tên công việc:</label>
                            <Input id="jobName" onChange={handleInput} value={jobName}
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

export default AddJobModal