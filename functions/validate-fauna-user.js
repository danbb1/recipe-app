const { faunaFetch } = require("./utils/fauna-fetch")

exports.handler = async ({ body, httpMethod }) => {
  if (httpMethod !== "POST") {
    return { statusCode: 405 }
  }

  try {
    const { id: userId, avatar, nickname } = JSON.parse(body)

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

    if (!queryResult?.data.getUserByAuthId) {
      const userMutation = `
      mutation ($data: UserInput!) {
        createUser(data: $data) {
          authId
          _id
          avatar
          nickname
        }
      }
    `

      const variables = { authId: userId, avatar, nickname }

      const mutationResult = await faunaFetch({
        query: userMutation,
        variables: { data: variables },
      })

      return {
        statusCode: 200,
        body: JSON.stringify({
          status: "User created",
          // eslint-disable-next-line no-underscore-dangle
          id: mutationResult.data.createUser._id,
        }),
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "User found",
        // eslint-disable-next-line no-underscore-dangle
        id: queryResult.data.getUserByAuthId._id,
      }),
    }
  } catch (err) {
    console.log(err.message)

    return {
      statusCode: 500,
      body: "Error",
    }
  }
}
