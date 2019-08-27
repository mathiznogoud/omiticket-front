import React, {useContext, useState} from 'react';
import {Icon,Button, Modal, Row, Col, message, Card, Descriptions, Tag} from 'antd'
import EditTicketModal from './EditTicketModal'
import RemoveTicketModal from './RemoveTicketModal'
import AssignTicketModal from './AssignTicketModal'
import UpdateTicketStatusModal from './UpdateTicketStatusModal'
import TicketHistoryModal from './TicketHistoryModal'

import {findTicketById} from '../../../../services/TicketServices'
import moment from 'moment'
import AppContext from '../../../../AppContext'

const ViewTicketModal = ({ticketId}) => {
    const {user, setUser} = useContext(AppContext)

    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [ticketData, setTicketData] = useState({
        name : '',
        email : '',
        phoneNumber : '',
        job : null,
        level : null,
        priority : null,
        status : null,
        interview_result_time : null,
        interview_date_time : null,
        receive_cv_time : null,
        cv_source : null,
        cv_url : null,
        user_email : [],
        description : ''
    })
    
    const fetchTicket = async ticketId => {
        const {success, data, message : messageInfo} = await findTicketById(ticketId)
        if (success){
            const {candidate, job, level,status,priority, cvsource, cv, user,receive_cv_time, interview_date_time, interview_result_time, description} = {...data}
            const [vJob, vLevel, vStatus, vPriority, vCvSource] = [job,level,status,priority,cvsource].map( model => {
                const {name} = {...model}
                return name
            })
            
            const {name,email, phone} = {...candidate}
            const {url}  = {...cv}
            const vUser_email = user ? user.map( u => u.email) : []
            
            return setTicketData({
                ...ticketData,
                name,
                email, 
                phoneNumber : phone,
                job : vJob,
                level : vLevel,
                status : vStatus,
                priority : vPriority,
                cv_source : vCvSource,
                cv_url : url,
                user_email : vUser_email,
                receive_cv_time,
                interview_date_time,
                interview_result_time,
                description
            }) 
        }
        
        return message.error('Unable to fetch ticket data!')
    }

    const isAdmin = () => {
        const {role} = {...user.data}
        if (role.includes('hr') || role.includes('admin'))
            return true
        return false
    }
    
    const refreshTicketDetail = async () => {
        setLoading(true)
        await fetchTicket(ticketId)
        setLoading(false)
    }

    const showModal = async () => {
        setVisible(true)
        await refreshTicketDetail()
    }

    const hideModal = () => {
        setVisible(false)
    }

    return (
        <div>
            <Button type="ghost" onClick={showModal} icon="select"/>
            <Modal visible={visible}
                centered
                title={<b>CHI TIẾT TICKET&nbsp;{!!loading && <Icon type='loading' size='large' />}</b>}
                closable={true}
                onCancel={hideModal}
                footer={null}
                width='80vw'
            >   
                { isAdmin() ? 
                    <Row gutter={0} style={{ marginBottom : '2vh'}}>
                        <Col offset={16} span={2}>
                            <TicketHistoryModal ticketId={ticketId}/>
                        </Col>
                        <Col span={2}>
                            <AssignTicketModal ticketId={ticketId} refreshTicketDetail={refreshTicketDetail}/>
                        </Col>
                        <Col span={2}> 
                            <EditTicketModal ticketId={ticketId} showViewTicketModal={showModal} hideViewTicketModal={hideModal}/>
                        </Col>
                        <Col span={2}> 
                            <RemoveTicketModal ticketId={ticketId} hideViewTicketModal={hideModal} showViewTicketModal={showModal}/>
                        </Col>
                    </Row>
                    : 
                    <Row gutter={0} style={{ marginBottom : '2vh'}}>
                        <Col offset={22} span={2}>
                            <UpdateTicketStatusModal ticketId={ticketId} />
                        </Col>
                    </Row>
                }
                <Row gutter={40}>
                    <Col span={12}>
                        <Card title={<b>THÔNG TIN ỨNG VIÊN</b>} style={{ backgroundColor : '#f2f3f5'}}>
                            <Descriptions layout="vertical">
                                <Descriptions.Item className='WordBreakWrapper' label={<b>Tên ứng viên</b>}>{ticketData.name}</Descriptions.Item>
                                <Descriptions.Item className='WordBreakWrapper' label={<b>Email</b>}>{ticketData.email}</Descriptions.Item>
                                <Descriptions.Item className='WordBreakWrapper' label={<b>Số điện thoại</b>}>{ticketData.phoneNumber}</Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title={<b>CHI TIẾT ỨNG TUYỂN</b>} style={{ backgroundColor : '#f2f3f5'}}>
                            <Descriptions layout="vertical" column={4}>
                                <Descriptions.Item className='WordBreakWrapper' label={<b>Công việc</b>}>{ticketData.job}</Descriptions.Item>
                                <Descriptions.Item className='WordBreakWrapper' label={<b>Trình độ</b>}>{ticketData.level}</Descriptions.Item>
                                <Descriptions.Item className='WordBreakWrapper' label={<b>Trạng thái</b>}>{ticketData.status}</Descriptions.Item>
                                <Descriptions.Item className='WordBreakWrapper' label={<b>Độ ưu tiên</b>}>{ticketData.priority}</Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                </Row>
                <hr style={{ opacity : '0.2', marginBottom : '3vh',marginTop : '3vh'}} />
                <Row gutter={40}>
                    <Col span={12} style={{ height : '100%'}}>
                        <Card title={<b>CHI TIẾT THỜI GIAN</b>} style={{ backgroundColor : '#f2f3f5', height : '100%'}} >
                            <Descriptions layout="vertical">
                                <Descriptions.Item className='WordBreakWrapper' label={<b>Thời gian nhận CV</b>}>{ticketData.receive_cv_time ? moment(ticketData.receive_cv_time).format('YYYY-MM-DD HH:mm') : null}</Descriptions.Item>
                                <Descriptions.Item className='WordBreakWrapper' label={<b>Thời gian phỏng vấn</b>}>{ticketData.interview_date_time ? moment(ticketData.interview_date_time).format('YYYY-MM-DD HH:mm'): null}</Descriptions.Item>
                                <Descriptions.Item className='WordBreakWrapper' label={<b>Thời gian trả kết quả</b>}>{ticketData.interview_result_time ? moment(ticketData.interview_result_time).format('YYYY-MM-DD HH:mm') : null}</Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title={<b>CHI TIẾT XỬ LÝ</b>} style={{ backgroundColor : '#f2f3f5'}}>
                            <Descriptions layout="vertical" >
                                <Descriptions.Item label={<b>Người xử lý</b>}>{
                                    ticketData.user_email.map(mail => 
                                         <Tag color="#108ee9" style={{ marginBottom : '1vh'}}>{mail}</Tag>       
                                    )}
                                </Descriptions.Item>
                                <Descriptions.Item label={<b>Nguồn CV</b>}>{ticketData.cv_source}</Descriptions.Item>
                                <Descriptions.Item label={<b>Đường dẫn CV &nbsp;<a href={ticketData.cv_url}><Icon type="select" size="large" /></a></b>}></Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                </Row>
                <hr style={{ opacity : '0.2', marginBottom : '3vh', marginTop : '3vh'}} />
                <Row gutter={40}>
                    <Col span={12}>
                        <Card title={<b>MÔ TẢ</b>} style={{ backgroundColor : '#f2f3f5'}}>
                            {ticketData.description}
                        </Card>
                    </Col>
                </Row>
                
                
            </Modal>
        </div>
    )
}

export default ViewTicketModal