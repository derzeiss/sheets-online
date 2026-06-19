# sheets-online

## Notes

DB migration must happen when container runs, so it can't be done in Dockerfile -> Run this after DB changes:

```sh
# connect to deployed fly.io container
`fly ssh console`
# apply migrations inside the deployed container
`npx prisma migrate deploy`
```

## Installation

#### Create `.env` at project root

```txt
DATABASE_URL="file:./dev.db"
```

#### Migrate local dev db

```sh
npm i
npx prisma migrate dev
npx prisma generate
npm run dev
```

#### Create initial admin user

1. Create user via register route
1. `npx prisma studio` -> open `http://localhost:5555/`
1. `User`: set `role: admin` & `isActive:true`

## Usage

```sh
npm run dev
npm run build
```

## Docker Deployment

To build and run using Docker:

```sh
# Build the container
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

---

Built with ❤️ using React Router.
