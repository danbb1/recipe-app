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
  isBrowser && Boolean(localStorage.getItem("isLoggedIn"))

export const login = () => {
  if (!isBrowser) {
    return
  }
  sessionStorage.setItem("recipeAppLoginPath", window.location.pathname)
  auth.authorize()
}

const getFaunaToken = async () =>
  axios.post("/.netlify/functions/get-access-token")

const setSession =
  (cb = () => {}) =>
  async (err, authResult) => {
    if (err) {
      console.log("Removing local storage", err)
      navigate("/")
      localStorage.removeItem("isLoggedIn")
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
          const faunaTokenResp = await getFaunaToken()

          if (faunaTokenResp.data.access_token)
            sessionStorage.setItem(
              "recipe_app_token",
              faunaTokenResp.data.access_token
            )

          const faunaUserId = await axios.post(
            "/.netlify/functions/validate-fauna-user",
            {
              id: user.sub,
              avatar: user.picture
                ? user.picture
                : user.nickname.slice(0, 1).toUpperCase(),
              nickname: user.nickname,
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
  sessionStorage.setItem(
    "recipeAppLoginPath",
    window.location.pathname !== "/callback" ? window.location.pathname : "/"
  )
  try {
    auth.checkSession({}, setSession(callback))
  } catch (error) {
    localStorage.setItem("isLoggedIn", false)
  }
}

export const logout = () => {
  localStorage.removeItem("isLoggedIn")
  auth.logout()
}

export const resetPassword = cb => {
  auth.changePassword(
    {
      email: user.email,
      connection: "Username-Password-Authentication",
    },
    res => cb(res)
  )
}
