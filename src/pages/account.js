import React, { useState } from "react"
import { Button, Modal, Typography, Paper, makeStyles } from "@material-ui/core"

import {
  login,
  logout,
  isAuthenticated,
  getProfile,
  resetPassword,
} from "../utils/auth"

import Layout from "../components/layout"

const useStyles = makeStyles(() => ({
  root: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    border: "2px solid #000",
    boxShadow: 24,
    textAlign: "center",
    padding: "4rem",
  },
}))

const Account = () => {
  if (!isAuthenticated()) {
    login()
    return <p>Redirecting to login...</p>
  }
  const [viewModal, setViewModal] = useState(false)

  const classes = useStyles()

  const user = getProfile()

  return (
    <Layout>
      <h1>{`Hello ${user.name ? user.name : "friend"}`}</h1>
      <Modal open={viewModal} onClose={() => setViewModal(false)}>
        <Paper className={classes.root}>
          <Typography>
            An email has been sent to reset your password.
          </Typography>
        </Paper>
      </Modal>
      <Button
        variant="contained"
        type="button"
        onClick={e => {
          resetPassword(err => {
            if (!err) setViewModal(true)
          })
          e.preventDefault()
        }}
      >
        Reset Password
      </Button>
      <Button
        variant="contained"
        type="button"
        onClick={e => {
          logout()
          e.preventDefault()
        }}
      >
        Logout
      </Button>
    </Layout>
  )
}

export default Account
