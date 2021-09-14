/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */

// You can delete this file if you're not using it
import React, { useState, useEffect } from "react"
import { silentAuth } from "./src/utils/auth"

const SessionCheck = ({ children }) => {
  const [loading, setLoading] = useState(true)

  const handleCheckSession = () => {
    setLoading(false)
  }

  useEffect(() => {
    silentAuth(handleCheckSession)
  }, [])

  return <>{!loading && children}</>
}

export const wrapRootElement = ({ element }) => (
  <SessionCheck>{element}</SessionCheck>
)
