# Welcome to Think Note

:notebook: This is a note-taking app built with Expo, powered by Supabase and Gemini. It provides a hierarchical folder structure, note-summarization by AI, a rich-text editor, filtering by tags, and much more!

# Overview

## Home screen

## Notes screen

## Ideas screen

## User profile

# Main features

- Notes
  - Rich text editor
  - Custom tags
  - Word counter
  - Marking notes
  - Sorting by created at, updated at, number of words, number of words, and number of visits.
  - Home page with note lists and uncategorized notes without a folder.
  - Move a note/folder to another folder (long-press an item and select a new parent folder).
- AI
  - Generate an AI summary from the note content, using a custom prompt.
  - Categorization of the summary by AI.
  - View your summaries in category-summary structure.
- User profile
  - Sign up with email and password.
  - Update your user name, email, or password.
  - Add a profile picture.
  - View your statistics.

# Tech stack

## Frontend

- Core technologies
  - TypeScript
  - React Native
  - Expo
  - 10play/tentap-editor
- UI
  - React Native Paper
  - React Native Reanimated
  - Universal Gradient Text
  - React Native Render HTML
- State
  - Zustand
- Forms
  - React Hook Forms
  - Zod

## Backend

- Supabase (PostgreSQL)
- Google AI Studio (Gemini)

# Database schema

![Supabase schema](github-images/database-schema.png)

# Installation

1. Clone the repo

```bash
git clone https://github.com/yourname/think-note.git
```

2. Install the dependencies

```bash
npm install
```

3. Set env variables

```
EXPO_PUBLIC_SUPABASE_SERVICE_KEY=
EXPO_PUBLIC_GEMINI_API_KEY=
```

4. Run the project

```bash
npm run start
```

# Key consideration

If you were to develop your own Supabase backend, you would have to create some PostgreSQL functions and triggers. These functions should cover:

- Automatic creation of the user's row in the profiles table.
  -Automatic updation of the updated_at column in the notes and the ideas tables.
  -Automatic calculation of the total number of words and the number of visits in a folder.

# License
