# Recipe App

Built with Gatsby, Material UI, Apollo Client, Auth0 and Fauna DB.

Live demo at [https://modest-curie-b92a14.netlify.app/](https://modest-curie-b92a14.netlify.app/)

Login with the following credentials:

User: test@mail.com
Password: Password1!

# To start development server:

OPTIONAL: To persist data between shutdowns, set up a volume with:
```console
docker volume create your-volume-name
```
Add the following flag to the run command:
```console
-v your-volume-name:/var/lib/faunadb
```

1. Run the docker image(assumes docker image is pulled): 
```console
docker run --name faunadb -p 8443:8443 -p 8084:8084 fauna/faunadb
```
2. With fauna-shell installed, add endpoint with alias localhost and key as secret:
```console
fauna add-endpoint http://localhost:8443/ --alias localhost --key secret
```
3. Create database:
```console
fauna create-database recipe_app_dev --endpoint=localhost
```
4. Create database key:
```console
fauna create-key recipe_app_dev --endpoint=localhost
``` 
This command returns a key for interacting with the database and will need to be recorded in .env files and in the headers of any request.

5. Upload the graphql schema from the REST client.

6. Start development server:
```console
netlify dev
```

