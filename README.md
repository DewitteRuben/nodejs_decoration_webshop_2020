# NodeJS backend of Decoration Webshop 2020

View the Frontend of this project [here](https://github.com/DewitteRuben/reactjs_decoration_webshop_2020).


## Setup

### MongoDb

Create a .env file that includes the following:

```
NODE_ENV=development
PORT=3000
MONGO_URL=mongodb://localhost:27017/shopItems
```

Replace the MongoDb database name (__shopItems__) with the one you wish to use. The docker container is setup to run MongoDb on port 27017.


### Firebase

Include the `serviceAccountKey.json` provided by Firebase in the `src` folder of this project.

## Build

Run the following:

```sh
npm install
npm run dev
```

The dev .sh script will take care of the Docker build setup.