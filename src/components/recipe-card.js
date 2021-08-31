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
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core"
import { red } from "@material-ui/core/colors"
import { Favorite, Share, ExpandMore, MoreVert } from "@material-ui/icons"

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 345,
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
}))

const RecipeCard = ({ recipe }) => {
  const classes = useStyles()
  const [expanded, setExpanded] = useState()

  const handleExpandClick = () => setExpanded(!expanded)

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVert />
          </IconButton>
        }
        title={recipe.title}
        subheader={new Date().toLocaleDateString()}
      />
      <CardMedia
        className={classes.media}
        image="https://images.unsplash.com/photo-1516684732162-798a0062be99?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmljZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        title="rice"
      />
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
          <Typography variant="h6" paragraph>Ingredients:</Typography>
          <List disablePadding>
            {recipe.ingredients.map(i => (
              <ListItem key={`${recipe.title}-${i.item}`}>
                <ListItemText primary={i.item} />
                <ListItemText primary={`${i.amount} ${i.unit}`} />
              </ListItem>
            ))}
          </List>
          <Typography variant="h6" paragraph>Method:</Typography>
          {recipe.method.map(m => (
            <Typography paragraph>{m}</Typography>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default RecipeCard
