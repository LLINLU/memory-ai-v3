# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/85db946c-fbd6-485c-a4f9-d305d23262a3

## How can I edit this code?

There are several ways of editing your application

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/85db946c-fbd6-485c-a4f9-d305d23262a3) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Backend & Authentication)

## Supabase Database Schema Management

This project uses Supabase as the backend database. Database type definitions are automatically generated and stored in `src/integrations/supabase/types/database.types.ts`.

### Generating Database Types

To regenerate the database types after making schema changes in Supabase:

```sh
# Method 1: Using npm script (recommended)
npm run generate-types

# Method 2: Direct command
npx supabase gen types typescript --project-id=mnnvcyrohovytovydaig > src/integrations/supabase/types/database.types.ts
```

### Prerequisites for Type Generation

Before running type generation commands, ensure you have:

1. **Supabase CLI installed**: The commands use `npx supabase`
2. **Proper authentication**: If you encounter permission errors, you may need to authenticate:
   ```sh
   npx supabase login
   ```
3. **Project access**: Ensure you have appropriate access to the Supabase project

### Database Schema Structure

The current database includes the following main tables:
- `teams` - Team management
- `technology_trees` - Main tree structures
- `tree_nodes` - Individual nodes within trees
- `user_profiles` - User profile information

### Type Usage in Code

Import and use the generated types:

```typescript
import type { Database } from '@/integrations/supabase/types/database.types';

// Use specific table types
type TechnologyTree = Database['public']['Tables']['technology_trees']['Row'];
type TreeNode = Database['public']['Tables']['tree_nodes']['Row'];
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/adbcce6b-d44d-4bbb-8daa-fb16c1b5fd61) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
