import React from 'react'

const LoginButton = ({ onLoginUserClick, global, web3, LoginUser }) => {
  return(
    <li className="pure-menu-item">
      <a href="#" className="pure-menu-link" onClick={(event) => {
        event.preventDefault()
        const { AuthContract } = global
        AuthContract.login().then((result)=>{
          let userName = web3.toUtf8(result)
          LoginUser(userName)
        }).catch((err)=>{
          console.log('LOGIN ERR', err)
        })
      }}>Login</a>
    </li>
  )
}

export default LoginButton
