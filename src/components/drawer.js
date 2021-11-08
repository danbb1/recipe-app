import React from "react"
import {
  makeStyles,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core"
import { Home } from "@material-ui/icons"
import { Link } from "gatsby"
import { isAuthenticated } from "../utils/auth"

const useStyles = makeStyles(theme => ({
  toolbar: theme.mixins.toolbar,
}))

const DrawerInner = () => {
  const classes = useStyles()

  return (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        {[
          { label: "Your Recipes", link: "recipes" },
          { label: "Explore", link: "explore" },
        ].map(link => (
          <ListItem
            button
            key={`${link.label}-key`}
            component={Link}
            to={`/${link.link.toLowerCase().trim().split(/\s+/).join("-")}/`}
          >
            <ListItemText inset primary={link.label} />
          </ListItem>
        ))}
        {isAuthenticated() && (
          <ListItem button component={Link} to="/account/">
            <ListItemText inset primary="Account" />
          </ListItem>
        )}
      </List>
    </div>
  )
}

export default DrawerInner
