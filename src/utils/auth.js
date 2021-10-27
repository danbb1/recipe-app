import auth0 from "auth0-js"
import { navigate } from "gatsby"
import axios from "axios"

const isBrowser = typeof window !== "undefined"

const auth = isBrowser
  ? new auth0.WebAuth({
      domain: process.env.GATSBY_AUTH0_DOMAIN || null,
      clientID: process.env.GATSBY_AUTH0_CLIENTID,
      redirectUri: process.env.GATSBY_AUTH0_CALLBACK || null,
      responseType: "token id_token",
      scope: "openid profile email",
    })
  : {}

const tokens = {
  accessToken: false,
  idToken: false,
  expiresAt: false,
}

let user = {}

export const isAuthenticated = () =>
  isBrowser ? Boolean(localStorage.getItem("isLoggedIn")) : false

export const login = () => {
  if (!isBrowser) {
    return
  }
  sessionStorage.setItem("recipeAppLoginPath", window.location.pathname)
  auth.authorize()
}

const setSession =
  (cb = () => {}) =>
  async (err, authResult) => {
    if (err) {
      navigate("/")
      cb()
      return
    }

    if (authResult && authResult.accessToken && authResult.idToken) {
      const expiresAt = authResult.expiresIn * 1000 + new Date().getTime()
      tokens.accessToken = authResult.accessToken
      tokens.idToken = authResult.idToken
      tokens.expiresAt = expiresAt
      user = authResult.idTokenPayload
      if (user) {
        try {
          const faunaUserId = await axios.post(
            "/.netlify/functions/validate-fauna-user",
            {
              id: user.sub,
              avatar: user.picture
                ? user.picture
                : user.nickname.slice(0, 1).toUpperCase(),
            }
          )
          if (faunaUserId) {
            user.fauna_id = faunaUserId.data.id
          }
        } catch (e) {
          console.log(e)
        }
      }
      localStorage.setItem("isLoggedIn", true)
      const loginRedirectRoute = sessionStorage.getItem("recipeAppLoginPath")
      navigate(loginRedirectRoute || "/")
      cb()
    }
  }

export const handleAuthentication = () => {
  if (!isBrowser) {
    return
  }

  auth.parseHash(setSession())
}

export const getProfile = () => user

export const silentAuth = callback => {
  if (!isAuthenticated()) return callback()
  sessionStorage.setItem("recipeAppLoginPath", window.location.pathname)
  try {
    auth.checkSession({}, setSession(callback))
  } catch (error) {
    console.log("there was an error", error)
  }
}

export const logout = () => {
  localStorage.setItem("isLoggedIn", false)
  auth.logout()
}
