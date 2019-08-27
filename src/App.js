import React, {useState} from 'react'
import AppContext from './AppContext'
import {Switch, Route} from 'react-router-dom'
import {getCookie} from './helpers/cookies'

import 'antd/dist/antd.css';
import { Layout } from 'antd';

import Header from './shared/Header'
import LoginModal from './scenes/login/LoginModal'
import Dashboard from './scenes/dashboard/Dashboard'
import UserManagement from './scenes/users/UserManagement'
import './App.css'

function App() {
	const [user, setUser] = useState({
		data : getCookie('data'),
		token : getCookie('token')
	})

	const {data} = {...user}
	const {role} = {...data}
	const isAdmin = role && (role.includes('admin') || role.includes('hr'))? true : false

  	return (
		<div>
			<AppContext.Provider value = {{ user, setUser }}>
				<Layout>	
					<Header/>
					<LoginModal/>
					{ user.data &&
						<div>
							<Switch>
								<Route exact path={['/dashboard','/']} component={Dashboard}/>
								{ 
									!!isAdmin && 
									<Route exact path={['/users']} component={UserManagement} />
								}
							</Switch>
						</div>
					}
				</Layout>
				
			</AppContext.Provider>
		</div>
  	)
}

export default App;
