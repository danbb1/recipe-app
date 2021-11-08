import React, { useEffect, useState } from "react"
import { useQuery } from "@apollo/client"
import { Grid, TextField, MenuItem } from "@material-ui/core"

import Layout from "../components/layout"
import Seo from "../components/seo"
import RecipeCard from "../components/recipe-card"

import { getProfile } from "../utils/auth"

import { GET_RECIPES, GET_USER_DETAILS } from "../apollo/queries"

const Recipes = () => {
  const [recipes, setRecipes] = useState()
  const [userFavorites, setUserFavorites] = useState()
  const [searchBy, setSearchBy] = useState("")
  const [searchFilter, setSearchFilter] = useState("")
  const [recipesToShow, setRecipesToShow] = useState([])

  const user = getProfile()

  const {
    loading: recipeLoading,
    error: recipeError,
    data: recipeData,
  } = useQuery(GET_RECIPES)

  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(GET_USER_DETAILS, { variables: { authId: user.sub } })

  useEffect(() => {
    if (userLoading || recipeLoading) return

    if (userData) {
      console.log(userData)
      const { favorites: newUserFavorites } =
        !userLoading && !userError ? userData.getUserByAuthId : null

      setUserFavorites(newUserFavorites)
    }

    if (recipeData) {
      const newRecipes =
        !recipeLoading && !recipeError ? recipeData.allRecipes.data : null

      setRecipes(newRecipes)
    }
  }, [userLoading, recipeLoading])

  useEffect(() => {
    if (!recipes) return
    if (searchFilter && searchBy) {
      let newRecipesToShow

      if (!searchBy) setRecipesToShow(recipes)

      if (searchBy === "title")
        newRecipesToShow = recipes.filter(recipe =>
          recipe[searchBy].includes(searchFilter)
        )

      if (searchBy === "user")
        newRecipesToShow = recipes.filter(recipe =>
          recipe.user.nickname
            .toLowerCase()
            .includes(searchFilter.toLowerCase())
        )

      if (searchBy === "ingredient")
        newRecipesToShow = recipes.filter(recipe =>
          recipe.ingredients.some(ingredient =>
            ingredient.item.toLowerCase().includes(searchFilter.toLowerCase())
          )
        )

      setRecipesToShow(newRecipesToShow)
    } else {
      setRecipesToShow(recipes)
    }
  }, [searchBy, searchFilter, recipes, userData])

  const options = [
    {
      label: "Title",
      value: "title",
    },
    {
      label: "User",
      value: "user",
    },
    { label: "Ingredient", value: "ingredient" },
  ]

  return (
    <Layout>
      <Seo title="Recipes" />
      <h1>Explore Recipes</h1>
      <Grid container spacing={4} alignItems="flex-end">
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Search By"
            name="filter-input"
            id="filter-input"
            select
            value={searchBy}
            onChange={e => setSearchBy(e.target.value)}
          >
            <MenuItem value="">Show all</MenuItem>
            {options.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
          />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        justifyContent="space-around"
        alignItems="stretch"
      >
        {recipeLoading && <p>loading...</p>}
        {recipeError && <p> Error: {recipeError.message}</p>}
        {recipesToShow && recipesToShow.length === 0 ? (
          <p>No recipes . . .</p>
        ) : (
          recipesToShow.map(recipe => (
            // eslint-disable-next-line no-underscore-dangle
            <Grid key={recipe._id} item xs={12} sm={6} lg={4}>
              <RecipeCard
                recipe={recipe}
                user={user}
                userFavorites={userFavorites && userFavorites}
              />
            </Grid>
          ))
        )}
      </Grid>
    </Layout>
  )
}

export default Recipes
