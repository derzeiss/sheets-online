# sheets-online

## Notes

- DB migration currently doesn't work automatically, so to update your DB you need to run
  - `fly ssh console`
  - `npx prisma migrate deploy` (inside the deployed container)

————————  
————————  
————————  
————————  
————————  
————————  
————————

### Usage

```bash
npm run dev
npm run build
```

### Docker Deployment

To build and run using Docker:

```bash
# Build the container
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

---

Built with ❤️ using React Router.
