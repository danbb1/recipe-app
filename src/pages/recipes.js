import React, { useState } from "react"
import { Container, Grid, Fab, TextField } from "@material-ui/core"
import { Add } from "@material-ui/icons"

import Layout from "../components/layout"
import Seo from "../components/seo"
import RecipeCard from "../components/recipe-card"

const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus, eveniet perspiciatis? Ullam adipisci voluptatibus magnam eaque excepturi facere, ducimus consequuntur modi, accusamus corrupti repellendus tenetur vitae sequi dolorem ab dicta."

const dummyIngredient = {
  item: "lorem ipsum",
  amount: 500,
  unit: "g",
}

const recipes = [
  {
    title: "A Recipe",
    description: lorem,
    ingredients: [dummyIngredient, dummyIngredient],
    method: [lorem, lorem, lorem],
  },
  {
    title: "A Recipe",
    description: lorem,
    ingredients: [dummyIngredient, dummyIngredient],
    method: [lorem, lorem, lorem],
  },
  {
    title: "A Recipe",
    description: lorem,
    ingredients: [dummyIngredient, dummyIngredient],
    method: [lorem, lorem, lorem],
  },
]

const Recipes = () => {
  const [addRecipe, setAddRecipe] = useState(false)

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
      {addRecipe && (
        <form>
          <TextField label="Title" />
          <TextField label="Description" multiline rows={5} />
        </form>
      )}
      <Grid
        container
        spacing={2}
        justifyContent="space-around"
        alignItems="start"
      >
        {recipes.map(r => (
          <Grid item xs={12} md={6} lg={4}>
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
