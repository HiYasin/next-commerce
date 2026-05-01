"use client";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { apiClient } from "@/lib/apiClient";
import { useActionState } from "react";

export type RegisterState = {
  error?: string;
  success?: boolean;
}
export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {

  const [state, registerAction, isPending] = useActionState(
    async (prevState: RegisterState, formDate: FormData): Promise<RegisterState> => {
      const email = formDate.get('email') as string;
      const password = formDate.get('password') as string;
      // const confirmPassword = formDate.get('confirmPassword') as string;
      const firstName = formDate.get('firstName') as string;
      const lastName = formDate.get('lastName') as string;
      // if (password !== confirmPassword) {
      //   return {
      //     ...prevState,
      //     error: "Passwords do not match"
      //   }
      // }
      console.log(email);
      try {
        await apiClient.register({ email, password, firstName, lastName });
        window.location.href = '/dashboard';
        return { success: true };

      } catch (error) {
        return {
          ...prevState,
          error: error instanceof Error ? error.message : "Failed to register"
        };
      }
    },
    {
      error: undefined,
      success: false
    }
  );

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={registerAction}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="firstName">First Name</FieldLabel>
              <Input id="firstName" name="firstName" type="text" placeholder="John Doe" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
              <Input id="lastName" name="lastName" type="text" placeholder="Doe" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" name="password" type="password" required />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Input id="confirmPassword" name="confirmPassword" type="password" required />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating Account..." : "Create Account"}
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        {state.error && (
          <Alert>
            {/* <InfoIcon/> */}
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>
              {state.error}
            </AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  )
}
