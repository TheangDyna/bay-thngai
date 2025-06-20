// src/components/profile/AccountSettings.tsx
import { useUpdateUserInfoMutation } from "@/api/userInfo";
import { PushNotification } from "@/components/commons/PushNotification";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/auth.context";
import { toast } from "@/hooks/use-toast";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

// your enums
const GENDERS = ["male", "female"] as const;
const ACTIVITY_LEVELS = [
  "sedentary",
  "lightly active",
  "moderately active",
  "very active",
  "extra active"
] as const;
const DIETARY_PREFERENCES = [
  "vegetarian",
  "vegan",
  "gluten-free",
  "low-carb",
  "high-protein",
  "halal",
  "kosher"
] as const;
const HEALTH_GOALS = [
  "weight loss",
  "weight gain",
  "maintenance",
  "muscle gain",
  "improved health"
] as const;

type UserInfoValues = {
  firstName: string;
  lastName: string;
  age: number | string;
  gender: (typeof GENDERS)[number] | "";
  height: number | string;
  weight: number | string;
  activityLevel: (typeof ACTIVITY_LEVELS)[number] | "";
  dietaryPreferences: (typeof DIETARY_PREFERENCES)[number][];
  healthGoals: (typeof HEALTH_GOALS)[number] | "";
  allergies: string[];
  dailyCalorieTarget: number | string;
};

type AccountValues = {
  password: string;
  confirmPassword: string;
  notificationsEnabled: boolean;
};

export const AccountSettings: React.FC = () => {
  const { user, isLoading } = useAuth();
  const updateUser = useUpdateUserInfoMutation();

  // default to empty strings so Select shows placeholder
  const userForm = useForm<UserInfoValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      age: "",
      gender: "",
      height: "",
      weight: "",
      activityLevel: "",
      dietaryPreferences: [],
      healthGoals: "",
      allergies: [],
      dailyCalorieTarget: ""
    }
  });

  const accountForm = useForm<AccountValues>({
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  const {
    control: uc,
    handleSubmit: onUserSubmit,
    reset: resetUser
  } = userForm;

  const { control: ac, handleSubmit: onAcctSubmit, getValues } = accountForm;

  useEffect(() => {
    if (!user) return;
    resetUser({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      age: user.age || "",
      gender: (user.gender as any) || "",
      height: user.height || "",
      weight: user.weight || "",
      activityLevel: (user.activityLevel as any) || "",
      dietaryPreferences: Array.isArray(user.dietaryPreferences)
        ? user.dietaryPreferences.filter(
            (d: any): d is (typeof DIETARY_PREFERENCES)[number] =>
              DIETARY_PREFERENCES.includes(
                d as (typeof DIETARY_PREFERENCES)[number]
              )
          )
        : [],
      healthGoals: (user.healthGoals as any) || "",
      allergies: user.allergies || [],
      dailyCalorieTarget: user.dailyCalorieTarget || ""
    });
  }, [user, resetUser]);

  const submitUser: SubmitHandler<UserInfoValues> = async (vals) => {
    try {
      // Ensure age is a number or undefined
      const payload = {
        ...vals,
        age:
          typeof vals.age === "string"
            ? vals.age === ""
              ? undefined
              : Number(vals.age)
            : vals.age,
        height:
          typeof vals.height === "string"
            ? vals.height === ""
              ? undefined
              : Number(vals.height)
            : vals.height,
        weight:
          typeof vals.weight === "string"
            ? vals.weight === ""
              ? undefined
              : Number(vals.weight)
            : vals.weight,
        dailyCalorieTarget:
          typeof vals.dailyCalorieTarget === "string"
            ? vals.dailyCalorieTarget === ""
              ? undefined
              : Number(vals.dailyCalorieTarget)
            : vals.dailyCalorieTarget
      };
      await updateUser.mutateAsync(payload);
      toast({ title: "Profile updated." });
    } catch {
      toast({ title: "Failed to update profile.", variant: "destructive" });
    }
  };

  const submitAcct: SubmitHandler<AccountValues> = async () => {
    toast({
      title: "Could not save account settings.",
      variant: "destructive"
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-10 space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-64" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-48" />
      </div>
    );
  }
  if (!user) {
    return (
      <p className="text-center py-10">Please log in to update your profile.</p>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── User Information ───────────────────── */}
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="px-6 pt-6 pb-0">
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-8">
          <Form {...userForm}>
            <form onSubmit={onUserSubmit(submitUser)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Text inputs */}
                {(
                  [
                    "firstName",
                    "lastName",
                    "age",
                    "height",
                    "weight",
                    "allergies",
                    "dailyCalorieTarget"
                  ] as const
                ).map((f) => {
                  const labels: Record<string, string> = {
                    firstName: "First Name",
                    lastName: "Last Name",
                    age: "Age",
                    height: "Height (cm)",
                    weight: "Weight (kg)",
                    allergies: "Allergies",
                    dailyCalorieTarget: "Daily Calorie Target"
                  };
                  const isNum = [
                    "age",
                    "height",
                    "weight",
                    "dailyCalorieTarget"
                  ].includes(f);
                  return (
                    <FormField
                      key={f}
                      control={uc}
                      name={f as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{labels[f]}</FormLabel>
                          <FormControl>
                            <Input
                              type={isNum ? "number" : "text"}
                              {...field}
                              onChange={(e) =>
                                isNum
                                  ? field.onChange(+e.currentTarget.value)
                                  : f === "allergies"
                                    ? field.onChange(
                                        e.currentTarget.value
                                          .split(",")
                                          .map((s) => s.trim())
                                      )
                                    : field.onChange(e.currentTarget.value)
                              }
                              placeholder={
                                f === "allergies"
                                  ? "comma-separated"
                                  : undefined
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );
                })}

                {/* Gender */}
                <FormField
                  control={uc}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            {GENDERS.map((g) => (
                              <SelectItem key={g} value={g}>
                                {g[0].toUpperCase() + g.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Activity Level */}
                <FormField
                  control={uc}
                  name="activityLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity Level</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select activity" />
                          </SelectTrigger>
                          <SelectContent>
                            {ACTIVITY_LEVELS.map((lvl) => (
                              <SelectItem key={lvl} value={lvl}>
                                {lvl}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Health Goals */}
                <FormField
                  control={uc}
                  name="healthGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Health Goals</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select goal" />
                          </SelectTrigger>
                          <SelectContent>
                            {HEALTH_GOALS.map((g) => (
                              <SelectItem key={g} value={g}>
                                {g}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Dietary Preferences (multi) */}
                <FormField
                  control={uc}
                  name="dietaryPreferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dietary Preferences</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-2">
                          {DIETARY_PREFERENCES.map((opt) => (
                            <label
                              key={opt}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                checked={field.value.includes(opt)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, opt]);
                                  } else {
                                    field.onChange(
                                      field.value.filter(
                                        (v: string) => v !== opt
                                      )
                                    );
                                  }
                                }}
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={updateUser.isPending}>
                  {updateUser.isPending ? "Saving…" : "Save User Info"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* ── Account & Notifications ────────────── */}
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="px-6 pt-6 pb-0">
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-8">
          <Form {...accountForm}>
            <form onSubmit={onAcctSubmit(submitAcct)} className="space-y-6">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input value={user.email} disabled className="bg-gray-100" />
                </FormControl>
              </FormItem>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {(["password", "confirmPassword"] as const).map((f) => (
                  <FormField
                    key={f}
                    control={ac}
                    name={f}
                    rules={
                      f === "confirmPassword"
                        ? {
                            validate: (v) =>
                              v === getValues("password") ||
                              "Passwords must match"
                          }
                        : undefined
                    }
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {f === "password"
                            ? "New Password"
                            : "Confirm Password"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={updateUser.isPending}>
                  {updateUser.isPending ? "Saving…" : "Save Account Settings"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="max-w-3xl mx-auto">
        <CardContent className="px-6 py-8">
          <div className="space-y-6">
            <PushNotification />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm">Share Profile Data</h3>
                <p className="text-xs text-gray-500">
                  Collect your preferences to improve search results
                </p>
              </div>
              <Switch checked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm">Ads Performance</h3>
                <p className="text-xs text-gray-500">
                  Help us tailor ads by collecting usage data
                </p>
              </div>
              <Switch checked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
