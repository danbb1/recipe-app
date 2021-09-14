import React from "react"

import { login, logout, isAuthenticated, getProfile } from "../utils/auth"

import Layout from "../components/layout"

const Account = () => {
  if (!isAuthenticated()) {
    login()
    return <p>Redirecting to login...</p>
  }

  const user = getProfile()

  return (
    <Layout>
      <p>{`Hello ${user.name ? user.name : "friend"}`}</p>
      <button
        type="button"
        onClick={e => {
          logout()
          e.preventDefault()
        }}
      >
        Logout
      </button>
    </Layout>
  )
}

export default Account
