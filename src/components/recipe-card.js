import React, { useState } from "react"
import {
  makeStyles,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core"
import { red } from "@material-ui/core/colors"
import {
  Favorite,
  Share,
  ExpandMore,
  MoreVert,
  Image,
} from "@material-ui/icons"

import RecipeForm from "./recipe-form"

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up("sm")]: {
      maxWidth: 345,
    },
  },
  media: {
    height: 0,
    paddingTop: "56.25%",
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
  ingredientList: {
    textAlign: "right",
  },
  missingImage: {
    marginLeft: theme.spacing(2),
  },
}))

const ViewMoreMenu = ({ anchorEl, handleViewMoreMenuClose, recipe }) => {
  const [editRecipe, setEditRecipe] = useState(false)
  return (
    <Menu
      id="view-more-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleViewMoreMenuClose}
    >
      <MenuItem onClick={() => setEditRecipe(true)}>Edit</MenuItem>
      <Modal open={editRecipe} onClose={() => setEditRecipe(false)}>
        <RecipeForm recipe={recipe} />
      </Modal>
      <MenuItem>Delete</MenuItem>
    </Menu>
  )
}

const RecipeCard = ({ recipe }) => {
  const classes = useStyles()
  const [expanded, setExpanded] = useState()
  const [menuAnchorEl, setMenuAnchorEl] = useState(null)

  const handleExpandClick = () => setExpanded(!expanded)

  const handleViewMoreMenuOpen = event => {
    setMenuAnchorEl(event.currentTarget)
  }

  const handleViewMoreMenuClose = () => setMenuAnchorEl(null)

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings" onClick={handleViewMoreMenuOpen}>
            <MoreVert />
          </IconButton>
        }
        title={recipe.title}
        subheader={new Date().toLocaleDateString()}
      />
      <ViewMoreMenu
        anchorEl={menuAnchorEl}
        handleViewMoreMenuClose={handleViewMoreMenuClose}
        recipe={recipe}
      />
      {recipe.image ? (
        <CardMedia
          className={classes.media}
          image={recipe.image}
          title={`${recipe.title} image`}
        />
      ) : (
        <Image className={classes.missingImage} />
      )}
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {recipe.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <Favorite />
        </IconButton>
        <IconButton aria-label="share">
          <Share />
        </IconButton>
        <IconButton
          className={`${classes.expand} ${expanded ? classes.expandOpen : ""}`}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMore />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="h6" paragraph>
            Ingredients:
          </Typography>
          <List disablePadding>
            {recipe.ingredients.map(i => (
              <ListItem key={`card-${i.key}`}>
                <ListItemText primary={i.item} />
                <ListItemText
                  className={classes.ingredientList}
                  primary={`${i.amount} ${i.unit !== "number" ? i.unit : ""}`}
                />
              </ListItem>
            ))}
          </List>
          <Typography variant="h6" paragraph>
            Method:
          </Typography>
          {recipe.method.map(m => (
            <Typography key={`card${m.key}`} paragraph>
              {m.text}
            </Typography>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default RecipeCard
