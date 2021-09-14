import React, { useState } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { Button, Container, Grid, Fab, Modal } from "@material-ui/core"
import { Add } from "@material-ui/icons"

import Layout from "../components/layout"
import Seo from "../components/seo"
import RecipeCard from "../components/recipe-card"
import RecipeForm from "../components/recipe-form"

import { login, isAuthenticated, getProfile } from "../utils/auth"

import { ADD_RECIPE, GET_RECIPES } from "../apollo/queries"

const RecipeFormModal = ({ viewAddRecipeForm, setViewAddRecipeForm }) => {
  const [addNewRecipe, { data, loading, error }] = useMutation(ADD_RECIPE, {
    refetchQueries: [GET_RECIPES],
  })

  const handleSubmit = async newRecipe => {
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

  const { loading, error, data } = useQuery(GET_RECIPES)

  const recipes = !loading && !error ? data.allRecipes.data : null

  console.log(recipes)

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
      />
      <Grid
        container
        spacing={2}
        justifyContent="space-around"
        alignItems="flex-start"
      >
        {loading && <p>loading...</p>}
        {error && <p> Error: {error.message}</p>}
        {recipes && recipes.length === 0 && <p>No recipes . . .</p>}
        {recipes &&
          recipes.map(r => (
            <Grid key={r._id} item xs={12} sm={6} lg={4}>
              <Container>
                <RecipeCard recipe={r} />
              </Container>
            </Grid>
          ))}
      </Grid>
    </Layout>
  )
}

export default Recipes
