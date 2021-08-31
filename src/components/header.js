import React, { useState } from "react"
import PropTypes from "prop-types"
import { Link as GatsbyLink } from "gatsby"
import {
  makeStyles,
  useTheme,
  AppBar,
  Drawer,
  Hidden,
  Link,
  Toolbar,
  Typography,
  IconButton,
} from "@material-ui/core"
import { Menu } from "@material-ui/icons"

import DrawerInner from "./drawer"

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexGrow: 1,
  },
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth => drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth => `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth => drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  title: {
    flexGrow: 1,
    color: "#ffffff",
  },
  drawerPaper: {
    width: drawerWidth => drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}))

const Header = ({ siteTitle, drawerWidth }) => {
  const theme = useTheme()
  const classes = useStyles(drawerWidth)

  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen)

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open menu"
            onClick={handleDrawerToggle}
          >
            <Menu />
          </IconButton>
          <Typography variant="h5" className={classes.title}>
            <Link component={GatsbyLink} to="/" color="inherit">
              {siteTitle}
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <nav>
        <Hidden mdUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{ paper: classes.drawerPaper }}
            ModalProps={{ keepMounted: true }}
          >
            <DrawerInner />
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            classes={{ paper: classes.drawerPaper }}
            variant="permanent"
            open
          >
            <DrawerInner />
          </Drawer>
        </Hidden>
      </nav>
    </div>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
