import React, {useState, useContext, useEffect} from 'react';
import {Icon,Button, Modal, Row, Col, message, Tabs, Timeline, Tooltip, Popover} from 'antd'
import {findHistories, getVersionDetails} from '../../../../services/TicketHistoryServices'
import moment from 'moment'

const TicketHistoryModal = ({ticketId}) => {
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [historyData, setHistoryData] = useState({
        ticketChanges : [],
        candidateChanges : []
    })

    const showModal = async () => {
        setVisible(true)
        await _fetchTicketHistories()
    }

    const hideModal = () => {
        setVisible(false)
    }

    const _fetchTicketHistories = async () => {
        setLoading(true)
        const {success, data, message : messageInfo } = await findHistories(ticketId)
        setLoading(false)
        if (success){
            const {ticket_changes , candidate_changes } = {...data}
            return setHistoryData({
                ticketChanges : ticket_changes || [],  
                candidateChanges : candidate_changes || []
            })
        }

        return message.error("Unable to fetch ticket's histories")
    }


    return (
        <div style={{ width : '100%'}}>
            <Button icon="file" onClick={showModal} className='SharpButton GhostButton'>Lịch sử</Button>
            <Modal visible={visible}
                centered
                title={<b>LỊCH SỬ TICKET&nbsp;{ !!loading && <Icon size="large" type="loading"/> }</b>}
                closable={true}
                onCancel={hideModal}
                footer={null}
                width='30vw'
                
            >   
                <Tabs defaultActiveKey="1" tabBarGutter={48}>
                    <Tabs.TabPane tab="Thông tin ticket" key="1">
                        <Timeline>
                            { historyData.ticketChanges.length > 0 ? 
                                historyData.ticketChanges.map(change => 
                                    <Tooltip placement="left" title="Details" content={<VersionDetails versionId={change.version_id}/>} trigger='click'>
                                        <Timeline.Item><b>{change.event_type}</b> - by <b>{change.user}</b> - at <b>{moment(change.event_time).format('DD/MM/YYYY HH:mm')}</b></Timeline.Item>
                                    </Tooltip>
                                   
                                )
                                : 
                                <p>Không tìm thấy lịch sử chỉnh sửa nào.</p>
                            }
                        </Timeline>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Thông tin ứng viên" key="2" style={{ minHeight : '50vh'}}>
                        <Timeline>
                            { historyData.candidateChanges.length > 0 ? 
                                historyData.candidateChanges.map(change => 
                                    <Popover placement="left" title="Details" content={<VersionDetails versionId={change.version_id}/>} trigger='click'>
                                        <Timeline.Item><b>{change.event_type}</b> - by <b>{change.user}</b> - at <b>{moment(change.event_time).format('DD/MM/YYYY HH:mm')}</b></Timeline.Item>
                                    </Popover>
                                )
                                : 
                                <p>Không tìm thấy lịch sử chỉnh sửa nào.</p>
                            }
                        </Timeline>
                    </Tabs.TabPane>
                </Tabs>
            </Modal>
        </div>

    )
}

const VersionDetails = ({ versionId }) => {
    const [loading, setLoading] = useState(true)
    const [details, setDetails ] = useState([])

    useEffect(() => {
        _fetchDetails()
    }, [versionId])

    const _fetchDetails = async () => {
        setLoading(true)
        const {success, data} = await getVersionDetails(versionId) 
        setLoading(false)
        
        if (success) {
            setDetails(data)
            return 
        }
    }


    return (
        <div>
            {
                loading ? 
                <Icon type="loading" /> : 
                details.map( detail => 
                    <p><b>*{detail.attr}</b> : {JSON.stringify(detail.prev_attr)}  ->  {JSON.stringify(detail.after_attr)}</p>
                )
            }
        </div>
    )
}

export default TicketHistoryModal