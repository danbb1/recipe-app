import { gql } from "@apollo/client"

export const READ_TOKEN = gql`
  query {
    token
  }
`

export const GET_RECIPES = gql`
  query {
    allRecipes {
      data {
        _id
        title
        user {
          authId
          nickname
          avatar
        }
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

export const FIND_USER_BY_ID = gql`
  query ($authId: String!) {
    getUserByAuthId(authId: $authId) {
      authId
      _id
    }
  }
`

export const GET_USER_DETAILS = gql`
  query ($authId: String!) {
    getUserByAuthId(authId: $authId) {
      favorites
      nickname
      recipes {
        data {
          _id
          title
          user {
            authId
            avatar
            nickname
          }
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
  }
`

export const ADD_USER = gql`
  mutation ($data: UserInput!) {
    createUser(data: $data) {
      id
    }
  }
`

export const UPDATE_USER = gql`
  mutation ($id: ID!, $data: UserInput!) {
    updateUser(id: $id, data: $data) {
      favorites
    }
  }
`
