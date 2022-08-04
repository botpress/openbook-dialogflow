const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");
const axios = require("axios");

process.env.DEBUG = "dialogflow:debug"; // enables lib debugging statements

exports.dialogflowOpenBookFulfillment = functions
  .runWith({
    minInstances: 1,
  })
  .https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });

    console.log("Req headers: " + JSON.stringify(request.headers));
    console.log("Req body: " + JSON.stringify(request.body));
    // grab credentials from request headers
    const { openbook_api_key, openbook_book_artifact_id } = request.headers;
    // or write inject them directly
    // const openbook_api_key = "REPLACE_WITH_YOUR_API_KEY";
    // const openbook_book_artifact_id = "REPLACE_WITH_YOUR_BOOKS_ARTIFACT_ID";

    async function fallback(agent) {
      if (!openbook_api_key || !openbook_book_artifact_id) {
        return agent.add(
          `You need to include "openbook_api_key" and "openbook_book_artifact_id" in your headers in your webhook configuration.`
        );
      }

      const endpoint = `https://api.openbook.botpress.cloud/v1/artifacts/${openbook_book_artifact_id}/query`;

      const { queryText } = request.body.queryResult;
      const response = await axios.post(
        endpoint,
        {
          query: queryText,
          history: [],
          answer_level: "strict",
        },
        {
          headers: { Authorization: `bearer ${openbook_api_key}` },
        }
      );
      if (response?.data?.result?.answer) {
        return agent.add(response.data.result.answer);
      }
      agent.add(`I didn't understand`);
      agent.add(`I'm sorry, can you try again?`);
    }

    let intentMap = new Map();
    intentMap.set("Default Fallback Intent", fallback);
    agent.handleRequest(intentMap);
  });
