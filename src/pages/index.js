import * as React from "react"
import { Button } from "@material-ui/core"

import { login, isAuthenticated, getProfile } from "../utils/auth"

import Layout from "../components/layout"
import Seo from "../components/seo"

const IndexPage = () => {
  const user = getProfile()

  return (
    <Layout>
      <Seo title="Home" />
      <p>{`Hello ${user.name ? user.name : "friend"}`}</p>
    </Layout>
  )
}

export default IndexPage
