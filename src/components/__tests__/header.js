import React from "react"
import { render, screen } from "@testing-library/react"

import Header from "../header"
import { isAuthenticated, getProfile } from "../../utils/auth"

jest.mock("../../utils/auth.js", () => ({
  isAuthenticated: jest.fn(),
  getProfile: jest.fn(),
}))

describe("Header", () => {
  it("renders correctly without a user", () => {
    isAuthenticated.mockImplementation(() => false)

    render(<Header drawerWidth={0} siteTitle="Recipe App" />)
    screen.getByText("Recipe App")
    screen.getByText("Login")
  })
  it("render correctly with a user", () => {
    isAuthenticated.mockImplementation(() => true)
    getProfile.mockImplementation(() => ({
      nickname: "Test User",
    }))
    render(<Header drawerWidth={0} siteTitle="Recipe App" />)
    screen.getByText("Logout")
    screen.getByText("T")
  })
})
