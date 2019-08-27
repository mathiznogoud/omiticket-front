import React, {useState, useEffect, useContext} from 'react';
import {Menu, Icon, Affix} from 'antd'
import {findDepartments} from '../../../services/DepartmentServices'
import AppContext from '../../../AppContext'

const DepartmentList = ({setTargetId}) => {
    const { user, setUser } = useContext(AppContext)
    const [departments, setDepartments] = useState([])
    const [current, setCurrent] = useState(user.data.department_id.toString())
    const [error,setError] = useState(null)

    useEffect(() => {
        const _fetchDepartments = async () => {
            const {success, data, message} = await findDepartments()
            
            if (success){
                const fetchedDepartments = data
                setDepartments(fetchedDepartments)                
            } 
            
            return setError(message)
        } 
        _fetchDepartments()
    },[])

    const handleClick = e => {
        setCurrent(e.key)
        setTargetId(e.key)
    }
    

    return (
        <div>
            <Affix>
                <Menu
                    onClick={handleClick}
                    style={{ width: '100%' }}
                    selectedKeys={[current]}
                    mode="inline"
                >
                    { departments.map(department => {
                        return ( 
                            <Menu.Item key={department.id}><h4>{department.name}</h4><Icon type='right'/></Menu.Item>
                        )
                    })}
                </Menu>
            </Affix>
            
        </div>
    )
}

export default DepartmentList