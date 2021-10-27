import React, { useState, useEffect } from "react"
import { useQuery } from "@apollo/client"
import { Container, Grid, Typography } from "@material-ui/core"
import { NavigateBefore, NavigateNext } from "@material-ui/icons"
import Carousel from "react-material-ui-carousel"

import { GET_RECIPES, GET_USER_FAVORITES } from "../apollo/queries"
import { isAuthenticated, getProfile } from "../utils/auth"
import useWindowSize from "../utils/useWindowSize"

import Layout from "../components/layout"
import Seo from "../components/seo"
import RecipeCard from "../components/recipe-card"

const CarouselView = ({ recipes, user, userFavorites }) => (
  <Grid
    container
    spacing={2}
    justifyContent="space-around"
    alignItems="flex-start"
  >
    {recipes.map(recipe =>
      new Date() - new Date(recipe.date) <= 2592000000 ? (
        // eslint-disable-next-line no-underscore-dangle
        <Grid key={recipe._id} item xs={12} sm={6} lg={4}>
          <Container>
            <RecipeCard
              recipe={recipe}
              user={user}
              userFavorites={userFavorites && userFavorites}
            />
          </Container>
        </Grid>
      ) : null
    )}
  </Grid>
)

const CarouselComponent = ({ recipes, user, userFavorites }) => {
  const { windowSize } = useWindowSize()
  const [numberOfCards, setNumberOfCards] = useState()
  const [numberOfViews, setNumberOfViews] = useState()
  const [views, setViews] = useState()

  useEffect(() => {
    console.log("Window resized")
    if (!windowSize) return

    if (windowSize.windowWidth < 768) setNumberOfCards(1)
    if (windowSize.windowWidth >= 768 && windowSize.windowWidth < 1280)
      setNumberOfCards(2)
    if (windowSize.windowWidth >= 1280) setNumberOfCards(3)

    setNumberOfViews(Math.ceil(recipes.length / numberOfCards))
  }, [windowSize])

  useEffect(() => {
    console.log("changing views")
    const newViews = []

    if (numberOfCards === 1) {
      setViews(recipes.map(recipe => [recipe]))
      return
    }

    for (let i = 0; i < numberOfViews; i += numberOfCards - 1) {
      const recipesThisView = recipes.slice(i, i + numberOfCards)
      newViews.push(recipesThisView)
    }

    setViews(newViews)
  }, [numberOfViews, recipes])

  return (
    <Carousel
      NextIcon={<NavigateNext />}
      PrevIcon={<NavigateBefore />}
      autoPlay={false}
    >
      {numberOfViews &&
        views.map(view => (
          <CarouselView
            numberOfCards={numberOfCards}
            recipes={view}
            user={user}
            userFavorites={userFavorites}
          />
        ))}
    </Carousel>
  )
}

const IndexPage = () => {
  const user = isAuthenticated ? getProfile() : null

  const {
    loading: recipeLoading,
    error: recipeError,
    data: recipeData,
  } = useQuery(GET_RECIPES)

  const recipes =
    !recipeLoading && !recipeError ? recipeData.allRecipes.data : null

  const sortedRecipes = recipes
    ? [...recipes].sort((a, b) => new Date(b.date) - new Date(a.date))
    : null

  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(GET_USER_FAVORITES, { variables: { authId: user.sub } })

  const userFavorites =
    !userLoading && !userError ? userData.getUserByAuthId.favorites : null

  return (
    <Layout>
      <Seo title="Home" />
      <Typography gutterBottom variant="h2">{`Hello ${
        user.nickname ? user.nickname : "friend"
      }`}</Typography>
      <Typography gutterBottom variant="h4">
        Recently Added Recipes
      </Typography>
      {recipeLoading && <p>loading...</p>}
      {recipeError && <p> Error: {recipeError.message}</p>}
      {recipes && recipes.length === 0 && <p>No recipes . . .</p>}
      {sortedRecipes && (
        <CarouselComponent
          recipes={sortedRecipes}
          user={user}
          userFavorites={userFavorites}
        />
      )}
      <Typography gutterBottom variant="h4">
        Your Favourite Recipes
      </Typography>
      <Grid
        container
        spacing={2}
        justifyContent="space-around"
        alignItems="flex-start"
      >
        {recipeLoading && <p>loading...</p>}
        {recipeError && <p> Error: {recipeError.message}</p>}
        {recipes && recipes.length === 0 && <p>No recipes . . .</p>}
        {sortedRecipes &&
          sortedRecipes.map(recipe =>
            new Date() - new Date(recipe.date) <= 2592000000 ? (
              // eslint-disable-next-line no-underscore-dangle
              <Grid key={recipe._id} item xs={12} sm={6} lg={4}>
                <Container>
                  <RecipeCard
                    recipe={recipe}
                    user={user}
                    userFavorites={userFavorites && userFavorites}
                  />
                </Container>
              </Grid>
            ) : null
          )}
      </Grid>
    </Layout>
  )
}

export default IndexPage
