import React, { useContext } from 'react'
import qs from 'query-string'
import { useLocation, useHistory } from 'react-router-dom'
import { getLoginRedirect, authoriseUserCode } from '../../api'
import { AuthContext } from '../../contexts/auth'
import { motion } from 'framer-motion'
import Emoji from 'a11y-react-emoji'

let actionRunning = false

const transition = {
  duration: 1,
  ease: [0.43, 0.13, 0.23, 0.96],
}

const Login = (): JSX.Element | null => {
  const location = useLocation()
  const history = useHistory()
  const query = qs.parse(location.search)
  const { checkLoginStatus } = useContext(AuthContext)
  if (!query.code && !actionRunning) {
    actionRunning = true
    localStorage.removeItem('userStatus')
    console.log(query)
    getLoginRedirect().then((url) => window.location.replace(url))
  }
  if (query.code && !actionRunning) {
    actionRunning = true
    authoriseUserCode(query.code as string)
      .then((res) => {
        const data: LoginStatus = {
          accessToken: res.access_token,
          authCode: query.code as string,
          accessTokenRefreshedAt: new Date().toISOString(),
          refreshToken: res.refresh_token,
          loggedInAt: new Date().toISOString(),
        }
        localStorage.setItem('userStatus', JSON.stringify(data))
        checkLoginStatus()
        history.push('/')
      })
      .catch(() => history.push('/login'))
  }
  return (
    <div className="w-screen h-screen flex justify-center items-center text-lg">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{
          y: '0%',
          opacity: 1,
          transition,
        }}
        style={{ height: '50px' }}
      >
        Hi, Spotify <Emoji symbol="👋" role="wave" />
        ...
      </motion.div>
    </div>
  )
}

export default Login
