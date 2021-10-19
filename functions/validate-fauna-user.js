const { faunaFetch } = require("./utils/fauna-fetch")

exports.handler = async event => {
  const { id: userId, avatar } = JSON.parse(event.body)

  const userQuery = `
    query ($authId: String!) {
      getUserByAuthId(authId: $authId) {
        authId
        _id
        avatar
      }
    }
  `

  const queryResult = await faunaFetch({
    query: userQuery,
    variables: { authId: userId },
  })

  if (!queryResult.data.getUserByAuthId) {
    console.log("No user found, creating user...")

    const userMutation = `
      mutation ($data: UserInput!) {
        createUser(data: $data) {
          authId
          _id
          avatar
        }
      }
    `

    const variables = { authId: userId, avatar }

    const mutationResult = await faunaFetch({
      query: userMutation,
      variables: { data: variables },
    })

    console.log("user created", mutationResult)

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "User created",
        // eslint-disable-next-line no-underscore-dangle
        id: mutationResult.data.createUser._id,
      }),
    }
  }

  if (queryResult.data.getUserByAuthId) {
    console.log("user found", queryResult)

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "User found",
        // eslint-disable-next-line no-underscore-dangle
        id: queryResult.data.getUserByAuthId._id,
      }),
    }
  }

  return {
    statusCode: 500,
    body: "Error",
  }
}
