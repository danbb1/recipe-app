import React, { useState } from "react"
import { gql, useMutation } from "@apollo/client"
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
import { nanoid } from "nanoid"

import RecipeForm from "./recipe-form"

import { GET_RECIPES, UPDATE_RECIPE, DELETE_RECIPE } from "../apollo/queries"

const ADD_RECIPE = gql`
  mutation ($data: RecipeInput!) {
    createRecipe(data: $data) {
      title
    }
  }
`

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

const ViewMoreMenu = ({ anchorEl, handleViewMoreMenuClose, recipe, setEditRecipe }) => {
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
      <MenuItem onClick={() => setEditRecipe(true)}>Edit</MenuItem>
      <MenuItem onClick={() => deleteRecipe({ variables: { id: recipe._id } })}>
        Delete
      </MenuItem>
    </Menu>
  )
}

const RecipeCard = ({ recipe }) => {
  const classes = useStyles()
  const [expanded, setExpanded] = useState()
  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const [editRecipe, setEditRecipe] = useState(false)

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

  const [updateRecipe, { data, loading, error }] = useMutation(UPDATE_RECIPE, {
    refetchQueries: [GET_RECIPES],
  })

  const handleSubmit = async newRecipe => {
    try {
      await updateRecipe({ variables: { id: recipe._id, data: newRecipe } })
      setEditRecipe(false)
    } catch (er) {
      console.log(er.message)
    }
  }

  const handleFavorite = () => {
    const newRecipe = {
      ...recipeGraphQlShape,
      favorite: !recipe.favorite
    }
    updateRecipe({ variables: { id: recipe._id, data: newRecipe } })
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="user" className={classes.avatar}>
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
        <IconButton aria-label="add to favorites" onClick={handleFavorite}>
          <Favorite color={recipe.favorite ? "error" : ""} />
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
