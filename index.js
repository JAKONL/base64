/**
 * rawHtmlResponse returns HTML inputted directly
 * into the worker script
 * @param {string} html
 */
 function rawHtmlResponse(html) {
  const init = {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  }
  return new Response(html, init)
}

 // Global variable to track which action to perform
var codingdecision = ""

/**
 * readRequestBody reads in the incoming request body
 * Use await readRequestBody(..) in an async function to get the string
 * @param {Request} request the incoming request to read from
 */
async function readRequestBody(request) {
  const { headers } = request
  const contentType = headers.get("content-type") || ""
  const action = headers.get("action") || ""

 // Log some necessary request parameters so we can see what's going on

 // console.log(request.method, request.url, contentType, action)
  console.log("Vistior IP: " + request.headers.get('Cf-Connecting-Ip'))
 // This section evaluates the request and decides whether encode or decode was requested

  if (request.url.includes("decode") || action === "decode") {
    codingdecision = "decode"
    console.log("Decode was true")
    function b64action(somevar) {
      try {
        return atob(somevar)
      } catch (err) {
        return "Error: " + err
      }
    } 
  } else {
    codingdecision = "encode"
    console.log("Default to encode")
    function b64action(somevar) {
      console.log(somevar)
      try {
        return btoa(somevar)
      } catch (err) {
        console.log(err)
        return "Error: " + err
      }
    } 
  }

 // If the content type is application/json, read the body as JSON, and encode or decode. 
 // Note, we validate valid JSON before performing encoding or decoding. 
 // If it doesn't validate we just treat it as a string and perform the action anyway.

  if (contentType.includes("application/json")) {
      try {
        JSON.parse(await request.json);
        let jsonString = JSON.stringify(await request.json())
        console.log("The JSON was validated")
        return b64action(jsonString)
      } catch (e) {
        console.log("The JSON was not validated. Treating input as string.")
        let jsonString = await request.text()
        return b64action(jsonString);
      }
  }

  // If the content type is text/plain, read the body as text, and encode/decode.

  else if (contentType.includes("application/text")) {
    return b64action(request.text())
  }

  // If the contentType is text/html, encode/decode the raw text.

  else if (contentType.includes("text/html")) {
    return b64action(request.text())
  }

  // This handles the form submission. May be removed...

  else if (contentType.includes("form")) {
    const formData = await request.formData()
    const body = {}
    for (const entry of formData.entries()) {
      body[entry[0]] = entry[1]
    }
    if (codingdecision === "encode") {
      return JSON.stringify(body.text) + '\n\n' + "was base64 encoded to " + '\n\n' + b64action(body.text)
    } else {
      return JSON.stringify(body.text) + '\n\n' + "was base64 decoded to " + '\n\n' + b64action(body.text)
    }
  }
  else {
    // Perhaps some other type of data was submitted in the form
    // like an image, or some other binary data. 
    return 'a file';
  }
}

// This is raw HTML to display an error if a user browses to the API URL or sends a standard GET request

const getRequestResponse = `
<!DOCTYPE html>
<html>
<body>
  <head>
    <title>Base64 Encoder/Decoder API</title>
    <style>body{padding:6em; font-family: sans-serif;} h1{color:#f6821f}</style>
  </head>
  <h1>Base64 Encode/Decode API</h1>
	<h3>API Instructions</h3>
	<div>
	<p>The HTTP request received by this HTTP server was an HTTP GET request. This API expects an HTTP POST request to perform the base64 operations. </p>
  <p>The default action is to encode and no special parameters are required. You may include the additional path '/encode' to ensure encoding. (Ex. /api/base64/encode)</p>
  <p>To decode, add '/decode' to the URL path (Ex. '/api/base64/decode') or include the header key 'action' with the value 'decode'.</p>
  <p>If you prefer a text box to paste into, the form below will encode/decode base64.</p>
	</div>

  <h3>Base64 Encode/Decode Form</h3>

  <form action="/api/base64/encode" method="post" id="userDataForm">
	<div class="field">
		<textarea name="text" placeholder="Enter Text Here" rows="15" cols="50"></textarea>
		<small></small>
	</div>
  <button type="submit" class="btn btn-primary" action="/api/base64/encode">Encode</button>
  <button type="submit" class="btn btn-success" formaction="/api/base64/decode" formmethod="POST">Decode</button>
  </form>
</body>
</html>
`
// This function handles the request and returns the response.
async function handleRequest(request) {
  const reqBody = await readRequestBody(request)
  const retBody = `${reqBody}`
  return new Response(retBody)
}

// This listens for requests on the API URL and returns the relevant response based on the request.

addEventListener("fetch", event => {
  const { request } = event
  const { url } = request

  if (request.method === "POST") {
    return event.respondWith(handleRequest(request))
  }
  else if (request.method === "GET") {
    return event.respondWith(rawHtmlResponse(getRequestResponse))
  }
})