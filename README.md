# Dialogflow OpenBook integration

You can run this yourself and include the api key and book artifact_id yourself, or add them to the headers in webhook. 
This doesn't pass on the webhook if you need to use another webhook. You'll have to handle that logic yourself. 

This also doesn't handle any kind of history.

## Prerequisites
A firebase account and firebase-tools installed (`npm i -g firebase-tools`).

## Instructions
1. `firebase login && firebase init`
2. `cd functions`
3. `nvm install`
4. `npm i`
5. `npm run deploy`, get the link to your webhook
6. Create a [Dialogflow Agent](https://console.dialogflow.com/).
7. Go to fulfilment and enable a webhook
8. For the url, add the link from step 4.
9. Add a header called `openbook_api_key` and set it to your OpenBook api key. 
10. Add a header called `openbook_book_artifact_id` and set it to your OpenBook artifact_id found in the book's debugger url. 
11. !important! Hit save below.
12. Go to intents 
13. Select "Default Fallback Intent"
14. Scroll to "Fulfilment", then toggle "Enable webhook call for this intent"
15. !important! Hit save above.
16. (optional) back in intents, select "Default Welcome Intent", press the three dots next to save, and delete it. This will let OpenBook handle greetings as well.
