# NodeGraph Insights API

NodeGraph Insights API is a Node.js and Express-based backend project created for the SRM full stack coding challenge. The application is structured to expose API endpoints, process incoming request data, and return responses in JSON format.[1][2]

## Tech Stack

- Node.js for the runtime environment.[2]
- Express.js for server and routing setup.[2]
- JavaScript (ES6+) for implementation.[2]
- Git and GitHub for version control and repository hosting.[1]

## Project Structure

```bash
.
├── backend/
│   ├── server.js
│   ├── routes/
│   │   └── bfhl.js
│   ├── controllers/
│   ├── services/
│   └── utils/
├── frontend/
├── .gitignore
├── README.md
└── package-lock.json
```

- `backend/server.js` contains the main Express server setup.
- `backend/routes/bfhl.js` contains the route logic for the challenge endpoint.
- `frontend/` is reserved for the client-side part of the project if needed.

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/nandinisnair/NodeGraph-Insights-API.git
cd NodeGraph-Insights-API
```

2. Install dependencies:

```bash
npm install
```

3. Run the backend server:

```bash
node backend/server.js
```

If the project uses npm scripts, you can also run:

```bash
npm start
```

## API Endpoint

### POST `/bfhl`

This endpoint accepts structured input data and returns processed output in JSON format. A typical implementation classifies values such as numbers and alphabets, then returns derived fields like the highest alphabet and user details in the response.[1]

Example request:

```json
{
  "data": ["M", "1", "334", "4", "A"]
}
```

Example response:

```json
{
  "is_success": true,
  "user_id": "your_name_ddmmyyyy",
  "email": "your_email@example.com",
  "roll_number": "RA2311026010520",
  "numbers": ["1", "334", "4"],
  "alphabets": ["M", "A"],
  "highest_alphabet": ["M"]
}
```

## Git Workflow

Use the following commands after making changes:

```bash
git add .
git commit -m "Describe your changes"
git push
```

For the first push to GitHub, a typical flow is to initialize Git, add the remote repository URL, commit changes, rename the branch to `main`, and push with upstream tracking enabled.[1]

## Notes

- Keep commit messages short and meaningful.
- Store backend logic inside `routes`, `controllers`, and `services` for cleaner organization.
- Update the endpoint examples if your implementation changes.

## License

This project is intended for educational and assessment use.