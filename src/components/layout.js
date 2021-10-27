import * as React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import { CssBaseline, makeStyles } from "@material-ui/core/"
import "@fontsource/roboto"

import Header from "./header"
import { getProfile, isAuthenticated } from "../utils/auth"

const useStyles = makeStyles(theme => ({
  root: {
    padding: "2rem",
    [theme.breakpoints.up("md")]: {
      marginLeft: drawerWidth => drawerWidth,
    },
  },
}))

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  const drawerWidth = 240
  const classes = useStyles(drawerWidth)

  return (
    <>
      <CssBaseline />
      <Header
        siteTitle={data.site.siteMetadata?.title || `Title`}
        drawerWidth={drawerWidth}
        user={getProfile()}
        isAuthenticated={isAuthenticated()}
      />
      <div className={classes.root}>
        <main>{children}</main>
        <footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.com">Gatsby</a>
        </footer>
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
