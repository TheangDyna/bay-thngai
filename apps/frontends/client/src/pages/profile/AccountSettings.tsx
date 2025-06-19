// src/components/profile/AccountSettings.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { EyeIcon } from "lucide-react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  shareProfileData: boolean;
  adsPerformance: boolean;
};

export const AccountSettings: React.FC = () => {
  const profileForm = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      shareProfileData: true,
      adsPerformance: true
    }
  });
  const { control, handleSubmit, getValues } = profileForm;
  const onSubmit: SubmitHandler<ProfileFormValues> = (vals) =>
    console.log("Profile Values:", vals);

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="px-6 pt-6 pb-0">
        <CardTitle className="text-xl">Account Settings</CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-8">
        <Form {...profileForm}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Info */}
            <section>
              <h2 className="text-lg mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {(
                  [
                    ["firstName", "First Name"],
                    ["lastName", "Last Name"]
                  ] as const
                ).map(([name, label]) => (
                  <FormField
                    key={name}
                    control={control}
                    name={name}
                    rules={{ required: `${label} is required` }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {label} <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="mt-1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormField
                control={control}
                name="phone"
                rules={{ required: "Phone number is required" }}
                render={({ field }) => (
                  <FormItem className="mt-6">
                    <FormLabel>
                      Phone/Mobile <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} className="mt-1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            <hr />

            {/* Account Info */}
            <section>
              <h2 className="text-lg mb-4">Account Information</h2>
              <FormField
                control={control}
                name="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid email address"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="email" {...field} className="mt-1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                {(
                  [
                    ["password", "Password"],
                    ["confirmPassword", "Confirm Password"]
                  ] as const
                ).map(([name, label]) => (
                  <FormField
                    key={name}
                    control={control}
                    name={name}
                    rules={
                      name === "confirmPassword"
                        ? {
                            validate: (v) =>
                              v === getValues("password") ||
                              "Passwords do not match"
                          }
                        : undefined
                    }
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <div className="relative mt-1">
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                              className="pr-10"
                            />
                          </FormControl>
                          <div className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                            <EyeIcon className="h-5 w-5" />
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </section>

            <hr />

            {/* Toggles */}
            <section className="space-y-6">
              {(
                [
                  [
                    "shareProfileData",
                    "Share Profile Data",
                    "Share your profile information to collect product search results"
                  ],
                  [
                    "adsPerformance",
                    "Ads Performance",
                    "To improve your ads search results we need to collect your behavior cookies"
                  ]
                ] as const
              ).map(([name, title, desc]) => (
                <div className="flex items-center justify-between" key={name}>
                  <div>
                    <h3 className="text-sm">{title}</h3>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                  <FormField
                    control={control}
                    name={name as any}
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </section>

            <Button type="submit" className="w-full">
              Update Profile
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
