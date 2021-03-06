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
  isBrowser && Boolean(localStorage.getItem("recipeAppIsLoggedIn"))

export const login = () => {
  if (!isBrowser) {
    return
  }
  sessionStorage.setItem("recipeAppLoginPath", window.location.pathname)
  auth.authorize()
}

const getFaunaToken = async () => {
  const faunaTokenResp = await axios.post(
    "/.netlify/functions/get-access-token"
  )

  if (faunaTokenResp.data.access_token)
    sessionStorage.setItem("recipe_app_token", faunaTokenResp.data.access_token)
}

const setSession =
  (cb = () => {}) =>
  async (err, authResult) => {
    if (err) {
      navigate("/")
      localStorage.removeItem("recipeAppIsLoggedIn")
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
              nickname: user.nickname,
            }
          )
          if (faunaUserId) {
            user.fauna_id = faunaUserId.data.id
          }
          getFaunaToken()
        } catch (e) {
          console.log(e)
        }
      }
      localStorage.setItem("recipeAppIsLoggedIn", true)
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

// eslint-disable-next-line consistent-return
export const silentAuth = callback => {
  if (!isAuthenticated()) return callback()
  sessionStorage.setItem(
    "recipeAppLoginPath",
    window.location.pathname !== "/callback" ? window.location.pathname : "/"
  )
  try {
    auth.checkSession({}, setSession(callback))
  } catch (error) {
    localStorage.setItem("recipeAppIsLoggedIn", false)
  }
}

export const logout = () => {
  localStorage.removeItem("recipeAppIsLoggedIn")
  sessionStorage.removeItem("recipe_app_token")
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
