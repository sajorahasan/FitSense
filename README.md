# Convexpo

## Convex + Better Auth + Expo (React Native) + Hero UI Native

This project was bootstrapped with **[Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack)**, a modern TypeScript stack combining Convex, Expo/React Native, Tailwind (NativeWind), Turborepo, and more. For architecture and deeper patterns, refer to the Better-T-Stack repo and docs.

> To reproduce a similar starter, run:
>
> ```bash
> pnpm create better-t-stack@latest my-better-t-app \
>  --frontend native-nativewind \
>  --backend convex \
>  --runtime none --api none --auth none --database none --orm none --db-setup none \
>  --package-manager pnpm --no-git \
>  --web-deploy none --server-deploy none \
>  --install \
>  --addons turborepo \
>  --examples todo
> ```

---

## Tech Stack

* **TypeScript** — static typing for safety and DX
* **[React Native (Expo)](https://expo.dev/)** — SDK 54 cross-platform development 🚧 *Beta*
* **[Tailwind (NativeWind)](https://www.nativewind.dev/)** — Tailwind for React Native
* **[Hero UI Native](https://github.com/heroui-inc/heroui-native)** — modern React Native UI library 🚧 *Alpha*
* **[Convex](https://docs.convex.dev/)** — reactive backend-as-a-service
* **[Better Auth](https://convex-better-auth.netlify.app/)** — auth primitives on Convex 🚧 *Alpha — community testing welcome*
* **[Biome](https://biomejs.dev/)** — fast formatting and linting
* **[Turborepo](https://turbo.build/repo/docs)** — monorepo build system

---

## Project Structure

```text
convexpo/
├─ apps/
│  └─ native/          # React Native (Expo) app
└─ packages/
   └─ backend/         # Convex backend (functions, schema, auth routes)
```

* The **backend** exposes Better Auth HTTP routes and emails via Resend.
* The **native** app uses Expo Router and consumes Better Auth’s client APIs.

---

## Prerequisites

* A **Resend** account & API key (for transactional emails)
* A **verified domain** in Resend (required for authentication emails)
* A **Convex** account (created by the CLI wizard below)
* **Expo Go** installed on your phone (for instant runs) — TestFlight for SDK 54: [EXPO GO 54](https://testflight.apple.com/join/GZJxxfUU)

> **⚠️ IMPORTANT:** Authentication emails require a verified domain in Resend. You cannot use test mode with just an API key for auth flows. The sender email must match your verified domain.

---

## Running the Example Project

1. **Clone or fork** this repo.

2. **Install root dependencies**:

   ```bash
   pnpm install
   ```

3. **Start dev** (Turborepo scripts will spawn native + backend):

   ```bash
   pnpm run dev
   ```

4. In the **Native#dev** terminal pane you should see your **Expo Go mobile URL scheme** — **save this**, you’ll need it for deep links:

   ```
   Metro waiting on exp://xxx.xxx.x.xx:xxxx
   ```

5. In the **@my-better-t-app/backend** terminal pane, the Convex wizard will prompt:

   ```
   What would you like to configure (use arrow keys)
   > create a new project
     choose an existing project
   ```

6. Choose **create a new project**.

7. **Name** it (anything).

8. Select **cloud development**.

9. A temporary error may appear while routes initialize. Check `packages/backend/.env.local` — you should now see **`CONVEX_DEPLOYMENT`** and **`CONVEX_URL`** set.

10. **Stop the dev servers** (Ctrl + C) now that Convex credentials exist.

11. `cd` into **`packages/backend`**.

12. **Convex env setup**

**a) Resend Setup (Domain + API Key)**

**First, verify your domain in Resend:**

1. Go to [Resend Dashboard → Domains](https://resend.com/domains)
2. Click **Add Domain** and add your domain (e.g., `yourdomain.com`)
3. Add the required DNS records
4. Wait for verification (usually a few minutes)

**Then, create an API key:**

* Go to **Dashboard → API Keys → Create**

  * Name: any
  * Permissions: **Full access**
  * Domain: select your verified domain
* Set it in Convex:

  ```bash
  npx convex env set RESEND_API_KEY=...
  ```

**Finally, update the sender email:**

```bash
npx convex env set RESEND_AUTH_EMAIL=auth@yourdomain.com
```

**b) Better Auth secret**

```bash
npx convex env set BETTER_AUTH_SECRET=$(openssl rand -base64 32)
```

**c) Expo mobile URL (for deep links)** — use your **Expo Go** URL

```bash
npx convex env set EXPO_MOBILE_URL=exp://xxx.xxx.x.xx:xxxx
```

13. **Expo env setup**

In `packages/backend/.env.local`, locate **`CONVEX_URL`**. It should look like:

```ini
CONVEX_URL=https://xxxx-xxx-xxx.convex.cloud
```


Create `apps/native/.env.development`:

> **Env setup: `.cloud` and `.site`**
> - Where to find it in the Convex dashboard: Project → Settings → URL & deployment keys → Show development credentials → Deployment URL
> - The Deployment URL will look like `https://xxxx-xxx-xxx.convex.cloud`
> - For HTTP Actions, use the same prefix with a `.site` TLD: `https://xxxx-xxx-xxx.convex.site`

```ini
EXPO_PUBLIC_CONVEX_URL=https://xxxx-xxx-xxx.convex.cloud   # deployment URL
EXPO_PUBLIC_SITE_URL=https://xxxx-xxx-xxx.convex.site      # HTTP Actions URL

# NOTE: The "/--" suffix is only needed for **Expo Go**.
# For dev/prod builds with a custom scheme (e.g., myapp://), do NOT include /--
# Remember this may change based on location
EXPO_PUBLIC_MOBILE_URL=exp://xxx.xxx.x.xx:xxxx/--
```

---

## Running (after setup): Email + Password

```bash
pnpm run dev
```

> **⚠️ IMPORTANT:** The Convex server may take a short time to warm up on first run (index creation).

* Scan the QR in **Expo Go** to open the app.
* Use **Sign Up** to create an account.
* Use **Forgot Password** to trigger a reset email → tap the link → you’ll land on the **Reset Password** screen inside the app.

---

## Apple Login

If you want Apple Sign-In with Better Auth, see: [Better Auth Apple Docs](https://www.better-auth.com/docs/authentication/apple)

**Status:** prototype; functions will be cleaned up soon.

Uncomment Apple in `packages/backend/convex/lib/auth/index.ts`:

```ts
// socialProviders: {
//   apple: {
//     clientId: requireEnv("APPLE_CLIENT_ID"),
//     clientSecret: requireEnv("APPLE_CLIENT_SECRET"),
//     appBundleIdentifier: requireEnv("APPLE_APP_BUNDLE_IDENTIFIER"),
//   },
// },
```

Expo usage lives in:

```
apps/native/lib/better-auth/oauth/applehandler.ts
```

If you want a step-by-step, please open an **Issue** and I’ll add a guide.

---

## Google Login

Docs: [Better Auth Google Docs](https://www.better-auth.com/docs/authentication/google)

**Status:** prototype; functions will be cleaned up soon.

Uncomment Google in `packages/backend/convex/lib/auth/index.ts`:

```ts
// socialProviders: {
//   google: {
//     clientId: requireEnv("GOOGLE_CLIENT_ID"),
//     clientSecret: requireEnv("GOOGLE_CLIENT_SECRET"),
//   },
// },
```

Expo usage lives in:

```
apps/native/lib/better-auth/oauth/googlehandler.ts
```

If you want a step-by-step, please open an **Issue** and I’ll add a guide.

---

## License

MIT
