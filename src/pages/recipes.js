import React, { useState } from "react"
import { gql, useQuery } from "@apollo/client"
import { Container, Grid, Fab, Modal } from "@material-ui/core"
import { Add } from "@material-ui/icons"
import { nanoid } from "nanoid"
import axios from "axios"

import Layout from "../components/layout"
import Seo from "../components/seo"
import RecipeCard from "../components/recipe-card"
import RecipeForm from "../components/recipe-form"

const GET_RECIPES = gql`
  query {
    allRecipes {
      data {
        id
        title
        description
        image
        date
        ingredients {
          key
          item
          amount
          unit
        }
        method {
          key
          text
        }
      }
    }
  }
`

const Recipes = () => {
  const [addRecipe, setAddRecipe] = useState(false)

  const { loading, error, data } = useQuery(GET_RECIPES)

  const recipes = !loading && !error ? data.allRecipes.data : null

  const handleSubmit = async newRecipe => {
    try {
      await axios.post("/.netlify/functions/add-new-recipe", newRecipe)
      setAddRecipe(false)
    } catch (er) {
      console.log(er.message)
    }
  }

  return (
    <Layout>
      <Seo title="Recipes" />
      <h1>These are your recipes</h1>
      <Fab
        color="secondary"
        aria-label="add"
        onClick={() => setAddRecipe(!addRecipe)}
      >
        <Add />
      </Fab>
      <Modal open={addRecipe} onClose={() => setAddRecipe(false)}>
        <RecipeForm handleSubmit={handleSubmit} />
      </Modal>
      <Grid
        container
        spacing={2}
        justifyContent="space-around"
        alignItems="flex-start"
      >
        {loading && <p>loading...</p>}
        {error && <p> Error: {error.message}</p>}
        {recipes &&
          recipes.map(r => (
            <Grid key={nanoid()} item xs={12} sm={6} lg={4}>
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
