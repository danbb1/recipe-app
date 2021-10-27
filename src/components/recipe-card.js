/* eslint-disable no-underscore-dangle */
import React, { useState } from "react"
import PropTypes from "prop-types"
import { useMutation } from "@apollo/client"
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
  Tooltip,
} from "@material-ui/core"
import { red } from "@material-ui/core/colors"
import {
  Favorite,
  Share,
  ExpandMore,
  MoreVert,
  Image,
} from "@material-ui/icons"
import { nanoid } from "nanoid"

import RecipeForm from "./recipe-form"

import {
  GET_RECIPES,
  UPDATE_RECIPE,
  DELETE_RECIPE,
  UPDATE_USER,
  GET_USER_FAVORITES,
} from "../apollo/queries"
import { isAuthenticated } from "../utils/auth"

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

const ViewMoreMenu = ({
  anchorEl,
  handleViewMoreMenuClose,
  recipe,
  user,
  setEditRecipe,
}) => {
  const [deleteRecipe] = useMutation(DELETE_RECIPE, {
    refetchQueries: [GET_RECIPES],
  })

  return (
    <Menu
      id="view-more-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleViewMoreMenuClose}
    >
      <Tooltip
        title="Only recipe authors can edit recipes"
        disableHoverListener={user.sub === recipe.user.authId}
        disableTouchListener={user.sub === recipe.user.authId}
        disableFocusListener={user.sub === recipe.user.authId}
      >
        <span>
          <MenuItem
            disabled={user.sub !== recipe.user.authId}
            onClick={() => setEditRecipe(true)}
          >
            Edit
          </MenuItem>
        </span>
      </Tooltip>
      <Tooltip
        title="Only recipe authors can delete recipes"
        disableHoverListener={user.sub === recipe.user.authId}
        disableTouchListener={user.sub === recipe.user.authId}
        disableFocusListener={user.sub === recipe.user.authId}
      >
        <span>
          <MenuItem
            disabled={user.sub !== recipe.user.authId}
            // eslint-disable-next-line no-underscore-dangle
            onClick={() => deleteRecipe({ variables: { id: recipe._id } })}
          >
            Delete
          </MenuItem>
        </span>
      </Tooltip>
    </Menu>
  )
}

const RecipeCard = ({ recipe, user, userFavorites }) => {
  const classes = useStyles()
  const [expanded, setExpanded] = useState()
  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const [editRecipe, setEditRecipe] = useState(false)
  const today = new Date()
  const formattedToday = `${today.getFullYear()}-${
    today.getMonth() + 1 < 10
      ? `0${today.getMonth() + 1}`
      : today.getMonth() + 1
  }-${today.getDate() < 10 ? `0${today.getDate()}` : today.getDate()}`

  const recipeGraphQlShape = recipe
    ? {
        title: recipe.title || "",
        image: recipe.image || "",
        description: recipe.description || "",
        date: recipe.date || formattedToday,
        ingredients: recipe.ingredients.map(i => ({
          item: i.item || "",
          amount: i.amount || 0,
          unit: i.unit || "g",
          key: i.key || nanoid(),
        })),
        method: recipe.method.map(m => ({
          text: m.text || "",
          key: m.key || nanoid(),
        })),
      }
    : null

  const handleExpandClick = () => setExpanded(!expanded)

  const handleViewMoreMenuOpen = event => {
    setMenuAnchorEl(event.currentTarget)
  }

  const handleViewMoreMenuClose = () => setMenuAnchorEl(null)

  const [updateRecipe] = useMutation(UPDATE_RECIPE, {
    refetchQueries: [GET_RECIPES],
  })

  const [updateUser] = useMutation(UPDATE_USER, {
    refetchQueries: [GET_USER_FAVORITES],
  })

  const handleSubmit = async newRecipe => {
    try {
      // eslint-disable-next-line no-underscore-dangle
      await updateRecipe({ variables: { id: recipe._id, data: newRecipe } })
      setEditRecipe(false)
    } catch (er) {
      console.log(er.message)
    }
  }

  const handleFavorite = () => {
    // eslint-disable-next-line no-underscore-dangle
    const newUserFavourites = userFavorites.includes(recipe._id)
      ? userFavorites.filter(f => f !== recipe._id)
      : [...userFavorites, recipe._id]
    updateUser({
      variables: {
        id: user.fauna_id,
        data: {
          authId: user.sub,
          favorites: newUserFavourites,
        },
      },
    })
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          recipe.user.avatar.length > 1 ? (
            <Avatar alt="Recipe avatar" src={recipe.user.avatar} />
          ) : (
            <Avatar aria-label="user" className={classes.avatar}>
              {recipe.user.avatar}
            </Avatar>
          )
        }
        action={
          <IconButton aria-label="settings" onClick={handleViewMoreMenuOpen}>
            <MoreVert />
          </IconButton>
        }
        title={recipe.title}
        subheader={new Date(recipe.date).toLocaleDateString()}
      />
      <ViewMoreMenu
        anchorEl={menuAnchorEl}
        handleViewMoreMenuClose={handleViewMoreMenuClose}
        recipe={recipe}
        user={user}
        setEditRecipe={setEditRecipe}
      />
      <Modal open={editRecipe} onClose={() => setEditRecipe(false)}>
        <RecipeForm recipe={recipeGraphQlShape} handleSubmit={handleSubmit} />
      </Modal>
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
        <IconButton
          disabled={!isAuthenticated()}
          aria-label="add to favorites"
          onClick={handleFavorite}
        >
          <Favorite
            color={
              userFavorites && userFavorites.includes(recipe._id)
                ? "error"
                : "inherit"
            }
          />
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

ViewMoreMenu.propTypes = {
  anchorEl: PropTypes.node,
  handleViewMoreMenuClose: PropTypes.func.isRequired,
  recipe: PropTypes.shape({
    _id: PropTypes.string,
    user: PropTypes.shape({
      authId: PropTypes.string,
    }),
  }).isRequired,
  user: PropTypes.shape({
    sub: PropTypes.string,
  }).isRequired,
  setEditRecipe: PropTypes.func.isRequired,
}

ViewMoreMenu.defaultProps = {
  anchorEl: null,
}

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    date: PropTypes.string,
    ingredients: PropTypes.arrayOf(
      PropTypes.shape({
        item: PropTypes.string,
        amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        unit: PropTypes.string,
        key: PropTypes.string,
      })
    ),
    method: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        key: PropTypes.string,
      })
    ),
    user: PropTypes.shape({
      avatar: PropTypes.string,
    }),
  }),
  user: PropTypes.shape({
    fauna_id: PropTypes.string,
    sub: PropTypes.string,
  }),
  userFavorites: PropTypes.arrayOf(PropTypes.string),
}

RecipeCard.defaultProps = {
  recipe: undefined,
  user: {},
  userFavorites: [],
}
