const axios = require("axios")

exports.faunaFetch = async ({ query, variables }) => {
  const config = {
    headers: {
      Authorization: `Bearer ${process.env.FAUNA_LOCAL_KEY}`,
    },
  }

  const response = await axios
    .post("http://localhost:8084/graphql", { query, variables }, config)
    .catch(err => console.error(err))

  console.log(response.data)

  return response.data
}
