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
        {["Recipes"].map(t => (
          <ListItem
            button
            key={t}
            component={Link}
            to={`/${t.toLowerCase().trim().split(/\s+/).join("-")}/`}
          >
            <ListItemText inset primary={t} />
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default DrawerInner
