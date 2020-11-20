## Fullstack

A project for learning full-stack development

## Goal

- **Server:** NestJS + Fastify + MongoDB **[WIP]**
- **Admin Panel**: NextJS
- **Web**: NextJS
- **Apps**: React Native

## Development

Start local mongodb `mongodb://localhost:27017/` <br />
or create a `.env` / `.env.local` file under `packages/server` and add

```
MONGODB_URI=mongodb://YOUR_MONGODB_URL
```

then

```
yarn dev
```

### image upload

Currently, images are upload to [Cloudinary](https://cloudinary.com/), <br />
If you are Heroku user, you could enable [Cloudinary Add-ons](https://elements.heroku.com/addons/cloudinary). <br />

1. create a `.env.local` file under `packages/server` and add your `<cloudinary_url>`

```
CLOUDINARY_URL = cloudinary://<api_key>:<api_secret>@<cloud_name>
```

2. create a `.env.local` file under `packages/web` and add your `api_key` and `cloud_name`

```
NEXT_PUBLIC_CLOUDINARY_API_KEY = <api_key>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = <cloud_name>
```
