# Language Learning Adventure

## App Summary
Language Learning Adventure is a gamified language learning platform designed to make vocabulary acquisition and reading practice engaging and interactive. The application targets language learners who want to supplement their studies with daily challenges, reading comprehension exercises, and an immersive text-based adventure game. Users can track their progress through daily streaks, learn new words with flashcards, and practice reading with level-appropriate passages. The product uniquely combines traditional learning tools with AI-driven voice interaction in its Adventure mode to simulate real-world language usage.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Shadcn UI, Framer Motion, React Query, Wouter
- **Backend**: Node.js, Express, Passport.js (Authentication)
- **Database**: PostgreSQL, Drizzle ORM
- **External Services**: OpenAI API (Content Generation), Replit Audio (Voice/Audio Processing)

## Architecture Diagram
```mermaid
graph TD
    User[User] -->|Interacts via Browser| Client[Frontend (React/Vite)]
    Client -->|HTTP Requests/WebSocket| Server[Backend (Express/Node.js)]
    Server -->|SQL Queries| DB[(PostgreSQL Database)]
    Server -->|API Calls| OpenAI[OpenAI API]
    Server -->|Audio processing| Audio[Replit Audio Service]
```

## Prerequisites
Before you begin, ensure you have the following software installed on your system:
- **Node.js**: (v18 or higher) - [Download & Install Node.js](https://nodejs.org/)
- **PostgreSQL**: (v14 or higher) - [Download & Install PostgreSQL](https://www.postgresql.org/download/)
- **psql**: Command-line interface for PostgreSQL (usually installed with PostgreSQL).

Verify your installation by running the following commands in your terminal:
```bash
node -v
psql --version
```

## Installation and Setup

1.  **Install Application Dependencies**:
    Navigate to the project directory and install the required Node.js packages:
    ```bash
    npm install
    ```

2.  **Set Up the Database**:
    Create a new PostgreSQL database for the application. You can do this using the `createdb` command or through the `psql` shell:
    ```bash
    createdb language_app
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the root directory and add your database connection string and any other required keys (e.g., OpenAI API Key).
    ```env
    DATABASE_URL=postgresql://username:password@localhost:5432/language_app
    OPENAI_API_KEY=your_openai_api_key_here
    ```

4.  **Initialize the Database**:
    Push the database schema using Drizzle Kit:
    ```bash
    npm run db:push
    ```
    *Note: The application will automatically seed initial data (words and reading passages) on the first startup.*

## Running the Application

1.  **Start the Development Server**:
    Run the following command to start both the backend server and frontend client:
    ```bash
    npm run dev
    ```

2.  **Access the Application**:
    Open your web browser and navigate to:
    [http://localhost:5000](http://localhost:5000)

## Verifying the Vertical Slice

To verify that the application and database are connected and functioning correctly (the Vertical Slice), follow these steps:

1.  **Launch the App**: Open the application in your browser at [http://localhost:5000](http://localhost:5000).
2.  **Check Initial Data**: Navigate to the "Daily Vocab" section. You should see a list of words (e.g., "application", "work", "employee") that were populated automatically on startup.
3.  **Trigger a Database Action**:
    *   Navigate to the **Adventure** page (via the "Continue Journey" or sidebar link).
    *   Start a new adventure or interact with the storyline.
    *   Alternatively, simple navigation to the **Daily Vocab** page triggers a `GET` request to `/api/words` which queries the `words` table in the database.
4.  **Verify Persistence**:
    *   Reload the page.
    *   Confirm that the vocabulary words are still displayed, proving that data is being successfully retrieved from the PostgreSQL database and not just held in memory.
5.  **Database Inspection (Optional)**:
    *   Open your terminal and connect to the database: `psql -d language_app`
    *   Run `SELECT * FROM words;` to verify the data exists directly in the database.

