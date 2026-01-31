# Roadtrix Frontend

React frontend for creating and managing nodes in Roadtrix.

## Features

- Create nodes with rounded rectangle UI cards
- Three node types: Question, Rule, Action
- Real-time node creation and display
- Clean, modern design with color-coded node types

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

1. Make sure the backend is running on `http://localhost:3000`
2. Start the frontend dev server
3. Open `http://localhost:5173` in your browser
4. Select a node type (Question, Rule, or Action)
5. Enter your node content
6. Click "Create Node"

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── NodeCreator.tsx      # Node creation form component
│   │   └── NodeCreator.css      # Styles for the form
│   ├── App.tsx                  # Main app component
│   ├── App.css                  # App-level styles
│   └── main.tsx                 # Entry point
└── package.json
```

## API Integration

The frontend communicates with the backend API at `http://localhost:3000/api/node/create` to create new nodes.
