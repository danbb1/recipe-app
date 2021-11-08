const { faunaFetch } = require("./utils/fauna-fetch")

exports.handler = async ({ body, httpMethod }) => {
  if (httpMethod !== "POST") {
    return { statusCode: 405 }
  }

  const recipe = JSON.parse(body)

  try {
    const query = `
  mutation ($id: ID! $data: RecipeInput!) {
    updateRecipe(id: $id data: $data) {
      title
    }
  }
  `

    const variables = {
      data: recipe,
    }

    await faunaFetch({ query, variables })

    return {
      statusCode: 200,
      body: "Success",
    }
  } catch (err) {
    console.err(err.message)

    return {
      statusCode: 500,
      body: "There was an error.",
    }
  }
}
