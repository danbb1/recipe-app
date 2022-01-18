import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { MockedProvider } from "@apollo/client/testing"
import RecipeCard from "../recipe-card"
import {
  UPDATE_RECIPE,
  DELETE_RECIPE,
  UPDATE_USER,
  GET_USER_DETAILS,
} from "../../apollo/queries"

jest.mock("../../utils/auth.js", () => ({
  isAuthenticated: jest.fn(),
  getProfile: jest.fn(),
}))

const dummyRecipe = {
  title: "Dummy Recipe",
  description: "I am the description of the dummy recipe.",
  date: "01/01/2000",
  ingredients: [
    {
      item: "Flour",
      amount: 500,
      unit: "g",
      key: "abc",
    },
    {
      item: "Butter",
      amount: 250,
      unit: "kg",
      key: "def",
    },
  ],
  method: [
    {
      text: "Method 1",
      key: "ghi",
    },
    {
      text: "Method 2",
      key: "jkl",
    },
  ],
  user: {
    avatar: "T",
  },
}

const apolloMocks = [
  {
    request: {
      query: UPDATE_RECIPE,
      variables: {},
    },
    result: {
      data: {},
    },
  },
  {
    request: {
      query: DELETE_RECIPE,
      variables: {},
    },
    result: {
      data: {},
    },
  },
  {
    request: {
      query: UPDATE_USER,
      variables: {},
    },
    result: {
      data: {},
    },
  },
  {
    request: {
      query: GET_USER_DETAILS,
      variables: {},
    },
    result: {
      data: {},
    },
  },
]

describe("Recipe Card", () => {
  it("Renders information correctly", () => {
    render(
      <MockedProvider addTypename={false} mocks={apolloMocks}>
        <RecipeCard recipe={dummyRecipe} />
      </MockedProvider>
    )
    const showIngredients = screen.getByRole("button", { name: /show more/i })
    userEvent.click(showIngredients)

    Object.keys(dummyRecipe).forEach(key => {
      if (Array.isArray(dummyRecipe[key])) {
        if (key === "ingredients") {
          dummyRecipe[key].forEach((ingredient, index) => {
            screen.getByText(dummyRecipe[key][index].item)
            screen.getByText(
              `${dummyRecipe[key][index].amount} ${dummyRecipe[key][index].unit}`
            )
          })
        } else {
          dummyRecipe[key].forEach((item, index) => {
            Object.keys(item).forEach(itemKey => {
              if (itemKey === "key") return
              screen.getByText(dummyRecipe[key][index][itemKey])
            })
          })
        }
      } else if (typeof dummyRecipe[key] === "object") {
        Object.keys(dummyRecipe[key]).forEach(item =>
          screen.getByText(dummyRecipe[key][item])
        )
      } else {
        screen.getByText(dummyRecipe[key])
      }
    })
  })
})
