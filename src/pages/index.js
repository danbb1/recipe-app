import React, { useState, useEffect } from "react"
import { useQuery } from "@apollo/client"
import { Container, Grid, Typography } from "@material-ui/core"
import { NavigateBefore, NavigateNext } from "@material-ui/icons"
import Carousel from "react-material-ui-carousel"

import { GET_RECIPES, GET_USER_DETAILS } from "../apollo/queries"
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
    alignItems="stretch"
  >
    {recipes.map(recipe => (
      // eslint-disable-next-line no-underscore-dangle
      <Grid key={recipe._id} item xs={12} sm={6} lg={4}>
        <RecipeCard
          recipe={recipe}
          user={user}
          userFavorites={userFavorites && userFavorites}
        />
      </Grid>
    ))}
  </Grid>
)

const CarouselComponent = ({ recipes, user, userFavorites }) => {
  const { windowSize } = useWindowSize()
  const [numberOfCards, setNumberOfCards] = useState()
  const [numberOfViews, setNumberOfViews] = useState()
  const [views, setViews] = useState()

  useEffect(() => {
    if (!windowSize || !recipes) return

    if (windowSize.windowWidth < 768) setNumberOfCards(1)
    if (windowSize.windowWidth >= 768 && windowSize.windowWidth < 1280)
      setNumberOfCards(2)
    if (windowSize.windowWidth >= 1280) setNumberOfCards(3)

    setNumberOfViews(Math.ceil(recipes.length / numberOfCards))
  }, [windowSize, recipes])

  useEffect(() => {
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
      fullHeightHover={false}
      NextIcon={<NavigateNext />}
      PrevIcon={<NavigateBefore />}
      autoPlay={false}
    >
      {numberOfViews &&
        views.map(view => (
          <CarouselView
            // key={`view-${view[0]._id}`}
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
  const [recipes, setRecipes] = useState([])
  const [userFavorites, setUserFavorites] = useState([])

  const user = isAuthenticated() ? getProfile() : null

  const {
    loading: recipeLoading,
    error: recipeError,
    data: recipeData,
  } = useQuery(GET_RECIPES)

  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(GET_USER_DETAILS, {
    variables: { authId: user ? user.sub : null },
  })

  useEffect(() => {
    if (recipeLoading) return

    if (recipeData) {
      const newRecipes =
        !recipeLoading && !recipeError ? recipeData.allRecipes.data : null

      setRecipes(newRecipes)
    }
  }, [recipeLoading, recipeData])

  useEffect(() => {
    if (userLoading) return

    if (userData) {
      const { favorites: newUserFavorites } =
        !userLoading && !userError ? userData.getUserByAuthId : null

      setUserFavorites(newUserFavorites)
    }
  }, [userLoading, userData])

  return (
    <Layout>
      <Seo title="Home" />
      <Typography gutterBottom variant="h2">{`Hello ${
        user?.nickname ? user.nickname : "friend"
      }`}</Typography>
      <Typography gutterBottom variant="h4">
        Recently Added Recipes
      </Typography>
      {recipeLoading && <p>loading...</p>}
      {recipeError && <p> Error: {recipeError.message}</p>}
      {recipes && recipes.length === 0 ? (
        <p>No recipes . . .</p>
      ) : (
        <CarouselComponent
          recipes={recipes?.filter(
            recipe => new Date() - new Date(recipe.date) <= 2592000000
          )}
          user={user}
          userFavorites={userFavorites}
        />
      )}
      {user && (
        <>
          <Typography gutterBottom variant="h4">
            Your Favourite Recipes
          </Typography>

          {userLoading && <p>loading...</p>}
          {userError && <p> Error: {recipeError.message}</p>}
          {userFavorites && userFavorites.length === 0 ? (
            <p>Favorite some recipes!</p>
          ) : (
            <CarouselComponent
              loading={userLoading && recipeLoading}
              recipes={recipes?.filter(recipe =>
                // eslint-disable-next-line no-underscore-dangle
                userFavorites.includes(recipe._id)
              )}
              user={user}
              userFavorites={userFavorites}
            />
          )}
        </>
      )}
    </Layout>
  )
}

export default IndexPage
