import { gql } from "@apollo/client"

export const GET_RECIPES = gql`
  query {
    allRecipes {
      data {
        _id
        title
        favorite
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

export const ADD_RECIPE = gql`
  mutation ($data: RecipeInput!) {
    createRecipe(data: $data) {
      title
    }
  }
`

export const UPDATE_RECIPE = gql`
  mutation ($id: ID!, $data: RecipeInput!) {
    updateRecipe(id: $id, data: $data) {
      title
    }
  }
`

export const DELETE_RECIPE = gql`
  mutation ($id: ID!) {
    deleteRecipe(id: $id) {
      title
    }
  }
`
