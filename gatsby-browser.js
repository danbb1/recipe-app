/* eslint-disable import/prefer-default-export */
import PropTypes from "prop-types"

import React, { useState, useEffect } from "react"
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from "@apollo/client"
import { silentAuth } from "./src/utils/auth"

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
  const httpLink = new HttpLink({ uri: "https://graphql.fauna.com/graphql" })

  const authLink = new ApolloLink((operation, forward) => {
    const token = sessionStorage.getItem("recipe_app_token")

    operation.setContext({
      headers: {
        Authorization: `Bearer ${token || process.env.GATSBY_FAUNA_READ_KEY}`,
      },
    })

    return forward(operation)
  })

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
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

ApolloWrapper.propTypes = {
  children: PropTypes.node.isRequired,
}
