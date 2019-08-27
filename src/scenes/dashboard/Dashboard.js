import React, {useContext, useState} from 'react';
import AppContext from '../../AppContext'
import { Row, Col } from 'antd';
import DepartmentList from './components/DepartmentList'
import DepartmentDetail from './components/DepartmentDetail'

const Dashboard = () => {
    const { user, setUser } = useContext(AppContext)
    const {department_id, role} = {...user.data}
    const [targetId, setTargetId] = useState(department_id.toString())

    const isAdmin = () => {
        if (role.includes('hr') || role.includes('admin'))
            return true
        return false
    }

    return (
        <div>
            { isAdmin() ? 
                <Row >
                    <Col span={4} style={{ backgroundColor : 'white'}}>
                        <DepartmentList setTargetId={setTargetId} />
                    </Col>
                    <Col span={20} >
                        <DepartmentDetail targetId={targetId} />
                    </Col>

                </Row> 
                : 
                <Row>
                    <Col span={24} >
                        <DepartmentDetail targetId={targetId} />
                    </Col>
                </Row> 
            }
        </div>
    )
}

export default Dashboard