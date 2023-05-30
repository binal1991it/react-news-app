import { Navigate, Outlet } from 'react-router-dom'

const AuthRoutes = () =>{
	const udata = localStorage.getItem('user')
    return ( udata != null ? <Outlet/> : <Navigate to="/login" /> )
}
export default AuthRoutes