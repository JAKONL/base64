# 👷 `Base64` Encode/Decode API

Generates an Cloudflare Worker API endpoint that can be used to encode and decode data in base64.

[index.js](index.js) is the interesting file with all of the Javascript to make the worker run.

[wrangler.toml.example](wrangler.toml.example)is a template configuration file for the worker. 

wrangler.toml configuration instructions may be found on the [Cloudflare Developer Portal](https://developers.cloudflare.com/workers/cli-wrangler/configuration).

#### Wrangler

To get this code running on your own free Cloudflare account I recommend following their [worker quickstart guide](https://developers.cloudflare.com/workers/get-started/guide).

##### A quick summary of the steps are as follows:

1. Install Wrangler: `npm install -g @cloudflare/wrangler`
2. Login to your account: `wrangler login`
3. Clone this repo: `git clone https://github.com/JAKONL/base64 /Path/To/Your/Worker/Directory`
4. `cd` into the directory: `cd /Path/To/Your/Worker/Directory`
5. Run `wrangler init` to create a new wrangler.toml file.
6. Run `wrangler dev` to start the development server. 


#### Further Wrangler Documentation

Cloudflare worker documentation for Wrangler can be found [here](https://developers.cloudflare.com/workers/tooling/wrangler).
