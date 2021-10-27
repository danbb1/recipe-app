import React, { useState } from "react"
import PropTypes from "prop-types"
import { useQuery, useMutation } from "@apollo/client"
import { Button, Container, Grid, Fab, Modal } from "@material-ui/core"
import { Add } from "@material-ui/icons"

import Layout from "../components/layout"
import Seo from "../components/seo"
import RecipeCard from "../components/recipe-card"
import RecipeForm from "../components/recipe-form"

import { login, isAuthenticated, getProfile } from "../utils/auth"

import { ADD_RECIPE, GET_RECIPES, GET_USER_FAVORITES } from "../apollo/queries"

const RecipeFormModal = ({ viewAddRecipeForm, setViewAddRecipeForm, user }) => {
  const [addNewRecipe] = useMutation(ADD_RECIPE, {
    refetchQueries: [GET_RECIPES],
  })

  const handleSubmit = async recipe => {
    const newRecipe = {
      ...recipe,
      user: {
        // eslint-disable-next-line no-underscore-dangle
        connect: user.fauna_id,
      },
    }
    try {
      await addNewRecipe({ variables: { data: newRecipe } })
      setViewAddRecipeForm(false)
    } catch (er) {
      console.log(er.message)
    }
  }

  return (
    <Modal open={viewAddRecipeForm} onClose={() => setViewAddRecipeForm(false)}>
      <RecipeForm handleSubmit={handleSubmit} />
    </Modal>
  )
}

const Recipes = () => {
  const [viewAddRecipeForm, setViewAddRecipeForm] = useState(false)

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
  } = useQuery(GET_USER_FAVORITES, { variables: { authId: user.sub } })

  const recipes =
    !recipeLoading && !recipeError ? recipeData.allRecipes.data : null

  const userFavorites =
    !userLoading && !userError ? userData.getUserByAuthId.favorites : null

  return (
    <Layout>
      <Seo title="Recipes" />
      <h1>These are your recipes</h1>
      {!isAuthenticated() ? (
        <div>
          You must login to post recipes:
          <Button
            variant="contained"
            onClick={e => {
              login()
              e.preventDefault()
            }}
          >
            Login
          </Button>
        </div>
      ) : (
        <Fab
          color="secondary"
          aria-label="add"
          onClick={() => setViewAddRecipeForm(!viewAddRecipeForm)}
        >
          <Add />
        </Fab>
      )}
      <RecipeFormModal
        viewAddRecipeForm={viewAddRecipeForm}
        setViewAddRecipeForm={setViewAddRecipeForm}
        user={user}
      />
      <Grid
        container
        spacing={2}
        justifyContent="space-around"
        alignItems="flex-start"
      >
        {recipeLoading && <p>loading...</p>}
        {recipeError && <p> Error: {recipeError.message}</p>}
        {recipes && recipes.length === 0 && <p>No recipes . . .</p>}
        {recipes &&
          recipes.map(recipe => (
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
          ))}
      </Grid>
    </Layout>
  )
}

export default Recipes

RecipeFormModal.propTypes = {
  viewAddRecipeForm: PropTypes.bool.isRequired,
  setViewAddRecipeForm: PropTypes.func.isRequired,
  user: PropTypes.shape({
    fauna_id: PropTypes.string,
  }).isRequired,
}
