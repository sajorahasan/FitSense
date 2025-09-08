# Convexpo Backend

This is the Convex backend for the ConvexPo project, featuring authentication with Better Auth and email functionality with Resend.

## Setup

### Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Convex
CONVEX_DEPLOYMENT=your-deployment-name

# Better Auth
BETTER_AUTH_SECRET=your-secret-key

# Resend
RESEND_API_KEY=your-resend-api-key
```

### Resend Email Configuration

**⚠️ IMPORTANT: Domain Requirements**

To use Resend for authentication emails in production, you **MUST** have a verified domain:

1. **Domain Verification Required**: Resend requires you to verify a domain in your account before you can send authentication emails. You cannot use just an API key with test mode for authentication flows.

2. **Sender Email Must Match Domain**: The `from` email address in your email configuration must use the same domain that you've verified in your Resend account.

#### Steps to Configure Resend:

1. **Add a Domain in Resend**:
   - Go to your [Resend Dashboard](https://resend.com/domains)
   - Click "Add Domain"
   - Add your domain (e.g., `yourdomain.com`)
   - Follow the DNS verification steps

2. **Update Sender Configuration**:
   - Open `convex/lib/resend/sendEmails.ts`
   - Update the `from` field to use your verified domain:
   ```ts
   from: "noreply@yourdomain.com", // Must match your verified domain
   ```

3. **Test Mode Limitations**:
   - Test mode (`testMode: true`) only works for development
   - You cannot send to arbitrary email addresses in test mode
   - For authentication emails, you must use production mode with a verified domain

#### Example Configuration:

```ts
// convex/lib/resend/sendEmails.ts
export const resendHandler = new Resend(components.resend, {
  testMode: false, // Must be false for authentication emails
});

export const sendEmail = async (ctx, { to, subject, html, text }) => {
  await resendHandler.sendEmail(ctx, {
    from: "auth@yourdomain.com", // Must use your verified domain
    to,
    subject,
    html,
    text,
  });
};
```

## Authentication

This project uses Better Auth for authentication with the following features:

- Email/password authentication
- Email verification
- Password reset functionality
- OTP verification

## Email Templates

The project includes email templates for:

- Email verification (`convex/lib/resend/emails/verifyEmail.tsx`)
- Password reset (`convex/lib/resend/emails/resetPassword.tsx`)
- OTP verification (`convex/lib/resend/emails/verifyOTP.tsx`)

## Development

To run the development server:

```bash
npx convex dev
```

## Deployment

Deploy your functions:

```bash
npx convex deploy
```

## Functions

Write your Convex functions here. See https://docs.convex.dev/functions for more.

### Example Query Function

```ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const myQueryFunction = query({
  args: {
    first: v.number(),
    second: v.string(),
  },
  handler: async (ctx, args) => {
    const documents = await ctx.db.query("tablename").collect();
    console.log(args.first, args.second);
    return documents;
  },
});
```

### Example Mutation Function

```ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const myMutationFunction = mutation({
  args: {
    first: v.string(),
    second: v.string(),
  },
  handler: async (ctx, args) => {
    const message = { body: args.first, author: args.second };
    const id = await ctx.db.insert("messages", message);
    return await ctx.db.get(id);
  },
});
```
