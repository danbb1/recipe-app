const { faunaFetch } = require("./utils/fauna-fetch")

exports.handler = async event => {
  const recipe = JSON.parse(event.body)

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

  console.log(variables)

  const result = await faunaFetch({ query, variables })

  return {
    statusCode: 200,
    body: "Success",
  }
}
