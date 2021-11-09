/* eslint-disable import/prefer-default-export */
import PropTypes from "prop-types"

import React, { useState, useEffect } from "react"
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import { getProfile, silentAuth } from "./src/utils/auth"

const cache = new InMemoryCache()

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

const ApolloWrapper = ({ children }) => {
  const [headers, setHeaders] = useState(process.env.GATSBY_FAUNA_READ_KEY)

  const user = getProfile()

  useEffect(() => {
    console.log("Checking headers", user)
    const newHeaders =
      sessionStorage.getItem("recipe_app_token") ||
      process.env.GATSBY_FAUNA_READ_KEY

    setHeaders(newHeaders)
  }, [user])

  const client = new ApolloClient({
    uri: "https://graphql.fauna.com/graphql",
    headers: {
      Authorization: `Bearer ${headers}`,
    },
    cache,
  })

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export const wrapRootElement = ({ element }) => (
  <ApolloWrapper>
    <SessionCheck>{element}</SessionCheck>
  </ApolloWrapper>
)

SessionCheck.propTypes = {
  children: PropTypes.node.isRequired,
}
