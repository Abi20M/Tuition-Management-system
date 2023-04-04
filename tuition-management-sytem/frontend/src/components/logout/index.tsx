
const logout = ( ) =>{
    localStorage.removeItem('admin');

    window.location.href = '/';
}

const Logout = () =>{
    logout();
    return <div/>
}

export default Logout;