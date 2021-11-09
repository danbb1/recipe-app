const axios = require("axios")

exports.handler = async ({ httpMethod }) => {
  if (httpMethod !== "POST") {
    return { statusCode: 405 }
  }

  const options = {
    client_id: process.env.AUTH0_ACCESS_CLIENT_ID,
    client_secret: process.env.AUTH0_ACCESS_CLIENT_SECRET,
    audience: process.env.FAUNA_AUDIENCE,
    grant_type: "client_credentials",
  }

  try {
    const response = await axios.post(process.env.AUTH0_URI, options, {
      "content-type": "application/json",
    })

    console.log(response)

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    }
  } catch (err) {
    console.log(err.message)

    return {
      statusCode: 500,
      body: err.message,
    }
  }
}
