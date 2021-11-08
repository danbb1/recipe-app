/* eslint-disable import/prefer-default-export */
import PropTypes from "prop-types"

import React, { useState, useEffect } from "react"
import { silentAuth } from "./src/utils/auth"

const SessionCheck = ({ children }) => {
  const [loading, setLoading] = useState(true)

  const handleCheckSession = () => {
    setLoading(false)
  }

  useEffect(() => {
    try {
      silentAuth(handleCheckSession)
    } catch (error) {
      console.log("Error:", error)
    }
  }, [])

  return <>{!loading && children}</>
}

export const wrapRootElement = ({ element }) => (
  <SessionCheck>{element}</SessionCheck>
)

SessionCheck.propTypes = {
  children: PropTypes.node.isRequired,
}
