# Twitter Clone

This repository contains the backend APIs developed in Node/Express for a Twitter clone.

## Pre-requisites

- Node.js 18.0

## Setting Up the Repository Locally

Follow these step-by-step instructions to set up the repository locally for your Node.js server backend.

1. **Clone the repository for the Twitter Clone backend.**

   ```shell
   git clone <repository_url>
   ```

2. **Fetch the main branch.**

   ```shell
   git fetch origin main
   ```

3. **Open the repository in a code editor of your choice.**

4. **Create a file for development keys:**

   - Navigate to the following path: `config/environments/`
   - Check if the `config/environments/` directory exists. If not, create it:

     ```shell
     mkdir -p config/environments
     ```

   - Navigate into the `config/environments/` directory:

     ```shell
     cd config/environments
     ```

   - Check if the `development.json` file exists. If not, create it:

     ```shell
     touch development.json
     ```

   - Open the `development.json` file in a text editor of your choice and add your development-specific configuration keys. For example:

     ```json
     {
       "port": 4000,
       "db": {
         "host": "127.0.0.1",
         "port": "5432",
         "name": "twitter_clone",
         "username": "postgres",
         "password": ""
       }
     }
     ```

5. **Install Node.js if not already installed.**

6. **Install PostgreSQL using Homebrew (assuming you're using macOS):**

   - Install PostgreSQL:

     ```shell
     brew install postgresql@15
     ```

   - Set up the PostgreSQL path and create a user:

     - Add PostgreSQL binaries to the system's PATH by adding the following line to your shell profile (e.g., `~/.bash_profile` or `~/.zshrc`):

       ```shell
       export PATH="/usr/local/opt/postgresql@15/bin:$PATH"
       ```

     - Create a new PostgreSQL user with a username and password of your choice:

       ```shell
       createuser -s postgres
       ```

7. **Create a database in PostgreSQL using `psql`:**

   - Open a terminal or command prompt and run the following command:

     ```shell
     createdb -U postgres -w -O postgres twitter_clone
     ```

8. **Install Node.js modules:**

   - Navigate to the project root directory.

   - Run the following command to install the required dependencies:

     ```shell
     npm install
     ```

9. **Run database migrations:**

   - Navigate to the project root directory.

   - Run the following command to apply the database migrations:

     ```shell
     npm run db:migrate
     ```

10. **Start the server:**

    - Run the following command to start the server:

      ```shell
      npm start
      ```

    Or, if you want to use Bunyan for better log formatting:

    ```shell
    node server | bunyan
    ```

## Usage

- Once the server is running, you can use the provided backend APIs for your Twitter clone project.

## Linting

- You can lint the code using the following commands:

  ```shell
  npm run lint
  npm run prettier
  ```

## Contributing

- When contributing, ensure that every database table has a corresponding Model file in the `models` folder.

- The project uses `Sequelize` as its ORM.

- Use `npx sequelize` CLI for managing migrations.

- The `controllers` and `routes` folder structure should match, with all routers in the `routes` folder having corresponding `controllers` files or folders.

- All logging should be done using `req.log`, which is a Bunyan logger. For model-level logging, pass `req.log` to underlying layers.

Feel free to contribute to this project and help us improve our Twitter clone!

You can copy and paste this Markdown into your `README.md` file.
