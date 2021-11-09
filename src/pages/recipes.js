import React, { useEffect, useState } from "react"
import axios from "axios"
import PropTypes from "prop-types"
import { useQuery, useMutation } from "@apollo/client"
import { Button, Grid, Fab, Modal } from "@material-ui/core"
import { Add } from "@material-ui/icons"

import Layout from "../components/layout"
import Seo from "../components/seo"
import RecipeCard from "../components/recipe-card"
import RecipeForm from "../components/recipe-form"

import { login, isAuthenticated, getProfile } from "../utils/auth"

import { ADD_RECIPE, GET_RECIPES, GET_USER_DETAILS } from "../apollo/queries"

const RecipeFormModal = ({ viewAddRecipeForm, setViewAddRecipeForm, user }) => {
  const [addNewRecipe] = useMutation(ADD_RECIPE, {
    refetchQueries: [GET_RECIPES, GET_USER_DETAILS],
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
  const [userFavorites, setUserFavorites] = useState()
  const [userRecipes, setUserRecipes] = useState()

  const user = getProfile()

  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(GET_USER_DETAILS, { variables: { authId: user.sub } })

  useEffect(() => {
    if (userLoading || !userData) return

    const { favorites: newUserFavorites, recipes: newUserRecipes } =
      !userLoading && !userError ? userData.getUserByAuthId : null

    setUserFavorites(newUserFavorites)
    setUserRecipes(newUserRecipes)
  }, [userLoading, userData])

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
        <>
          <Fab
            color="secondary"
            aria-label="add"
            onClick={() => setViewAddRecipeForm(!viewAddRecipeForm)}
          >
            <Add />
          </Fab>
          <RecipeFormModal
            viewAddRecipeForm={viewAddRecipeForm}
            setViewAddRecipeForm={setViewAddRecipeForm}
            user={user}
          />
          <Grid
            container
            spacing={2}
            justifyContent="space-around"
            alignItems="stretch"
          >
            {userLoading && <p>loading...</p>}
            {userError && <p> Error: {userError.message}</p>}
            {userRecipes && userRecipes.data.length === 0 && (
              <p>No recipes . . .</p>
            )}
            {userRecipes &&
              userRecipes.data.map(recipe => (
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
        </>
      )}
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
