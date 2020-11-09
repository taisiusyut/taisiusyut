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
If you are heroku user, you may enable [Cloudinary Add-ons](https://elements.heroku.com/addons/cloudinary). <br />
create a `.env.local` file under `packages/server` and add

```
CLOUDINARY_URL = cloudinary://<api_key>:<api_secret>@<cloud_name>
```
