/* eslint-disable react-hooks/exhaustive-deps*/

import React, { useEffect, useState } from 'react'
import Spotify from 'spotify-web-api-js'
import { refreshAccessToken } from '../api'
import { setIntoObject } from '../util/fromObjectInLocalStorage'
import { createLogger } from '../util/loggers'

export const AuthContext = React.createContext<{
  loading: boolean
  loggedIn: boolean
  currentUser: string | null
  accessToken: string | null
  checkLoginStatus: () => void | null
  endSession: () => void | null
}>({
  currentUser: null,
  loading: false,
  loggedIn: false,
  accessToken: null,
  checkLoginStatus: () => null,
  endSession: () => null,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [loading, setloading] = useState<boolean>(true)
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)

  const logger = createLogger('[AUTH 😀]')

  /**
   * Check local storage for previous login status and load it into memory.
   */
  const checkLoginStatusFromLocalStorage = (): void => {
    const statusDataStr = localStorage.getItem('userStatus')
    if (!statusDataStr) {
      logger('login status not found in local storage.')
      setloading(false)
      setLoggedIn(false)
      setCurrentUser(null)
      return
    } else {
      const loginStatus = JSON.parse(statusDataStr) as LoginStatus
      // check if login was over 7 days ago
      if (new Date().getUTCMinutes() - new Date(loginStatus.loggedInAt).getTime() / 1e3 / 60 / 60 > 24 * 7) {
        endSession()
        return
      }
      // load previous login state
      logger('loaded previous login state from local storage.')
      setloading(false)
      setLoggedIn(true)
      setCurrentUser('loggedIn')
      setAccessToken(loginStatus.accessToken)
      setLastRefresh(new Date(loginStatus.accessTokenRefreshedAt))
      setRefreshToken(loginStatus.refreshToken)
    }
  }

  /**
   * Refresh access token by calling API.
   */
  const _refreshAccessToken = () => {
    if (refreshToken) {
      refreshAccessToken(refreshToken).then((d) => {
        if (d) {
          setAccessToken(d.access_token)
          setLastRefresh(new Date())
          setIntoObject('userStatus')('accessToken', d.access_token)
          setIntoObject('userStatus')('accessTokenRefreshedAt', new Date().toISOString())
          logger('got a fresh Spotify access token.')
        }
      })
    }
  }

  /**
   * Checks existing access token and refreshes it if necessary.
   */
  const _checkAccessToken = () => {
    if (accessToken) {
      const s = new Spotify()
      s.setAccessToken(accessToken)
      s.getMe().catch(() => _refreshAccessToken())
    }
  }

  /**
   * Automatically refresh access token when necessary.
   */
  useEffect(() => {
    if (lastRefresh && refreshToken) {
      const ref = setInterval(() => {
        logger('checking access token.')
        _checkAccessToken()
      }, 60 * 1e3)
      return () => clearInterval(ref)
    }
  }, [lastRefresh, refreshToken])

  // check login status on app load
  useEffect(() => {
    checkLoginStatusFromLocalStorage()
  }, [])

  // check access token
  useEffect(() => {
    _checkAccessToken()
  }, [accessToken])

  const endSession = () => {
    setloading(false)
    setLoggedIn(false)
    setCurrentUser(null)
    localStorage.removeItem('userStatus')
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        loggedIn,
        accessToken,
        checkLoginStatus: checkLoginStatusFromLocalStorage,
        endSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
