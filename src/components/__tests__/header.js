import React from "react"
import { render, screen } from "@testing-library/react"

import Header from "../header"

jest.mock("auth0-js")

describe("Header", () => {
  it("renders correctly without a user", () => {
    render(<Header siteTitle="Recipe App" isAuthenticated={false} user={{}} />)
    screen.getByText("Recipe App")
    screen.getByText("Login")
  })
  it("render correctly with a user", () => {
    render(
      <Header
        siteTitle="Recipe App"
        isAuthenticated
        user={{ nickname: "Test User" }}
      />
    )
    screen.getByText("Logout")
    screen.getByText("T")
  })
})
