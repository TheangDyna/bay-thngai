// src/pages/ProfilePage.tsx
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
import AddressSettingsPage from "@/pages/profile/address/AddressSettingsPage";
import ContactSettingsPage from "@/pages/profile/contact/ContactSettingsPage";
import {
  BellIcon,
  EyeIcon,
  HeartIcon,
  LogOutIcon,
  MapIcon,
  PhoneIcon,
  ShoppingBagIcon,
  UserIcon
} from "lucide-react";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

// ─── IMPORT PREBUILT COMPONENTS ───────────────────────────────────────────

//
// ─── FORM VALUE TYPES ────────────────────────────────────────────────────────
//
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

type Tab =
  | "account"
  | "addresses"
  | "contacts"
  | "orders"
  | "wishlist"
  | "notifications";

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("account");

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
  const { control: profileControl, handleSubmit: handleProfileSubmit } =
    profileForm;
  const onProfileSubmit: SubmitHandler<ProfileFormValues> = (values) => {
    console.log("Profile Values:", values);
  };

  const renderAccountSettings = () => (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="px-6 pt-6 pb-0">
        <CardTitle className="text-xl">Account Settings</CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-8">
        <Form {...profileForm}>
          <form
            onSubmit={handleProfileSubmit(onProfileSubmit)}
            className="space-y-8"
          >
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Personal Information
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={profileControl}
                  name="firstName"
                  rules={{ required: "First name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        First Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} className="mt-1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileControl}
                  name="lastName"
                  rules={{ required: "Last name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Last Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} className="mt-1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-6">
                <FormField
                  control={profileControl}
                  name="phone"
                  rules={{ required: "Phone number is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Phone/Mobile <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+1 555-1234"
                          {...field}
                          className="mt-1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <div className="border-t border-gray-200"></div>

            {/* Account Information */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Account Information
                </h2>
              </div>
              <div>
                <FormField
                  control={profileControl}
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
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                          className="mt-1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                <FormField
                  control={profileControl}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative mt-1">
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
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
                <FormField
                  control={profileControl}
                  name="confirmPassword"
                  rules={{
                    validate: (value) =>
                      value === profileForm.getValues("password") ||
                      "Passwords do not match"
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <div className="relative mt-1">
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
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
              </div>
            </section>

            <div className="border-t border-gray-200"></div>

            {/* Toggles */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Share Profile Data
                  </h3>
                  <p className="text-xs text-gray-500">
                    Share your profile information to collect product search
                    results
                  </p>
                </div>
                <FormField
                  control={profileControl}
                  name="shareProfileData"
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
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Ads Performance
                  </h3>
                  <p className="text-xs text-gray-500">
                    To improve your ads search results we need to collect your
                    behavior cookies
                  </p>
                </div>
                <FormField
                  control={profileControl}
                  name="adsPerformance"
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
            </section>

            <div className="pt-6 border-t border-gray-200">
              <Button type="submit" className="w-full">
                Update Profile
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white border-r border-gray-200">
        <nav className="mt-8">
          <ul className="space-y-1">
            <li>
              <button
                className={`flex items-center w-full px-4 py-3 rounded-r-lg ${
                  activeTab === "account"
                    ? "bg-green-50 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("account")}
              >
                <UserIcon className="h-5 w-5 mr-3" />
                <span>Account Settings</span>
              </button>
            </li>
            <li>
              <button
                className={`flex items-center w-full px-4 py-3 rounded-r-lg ${
                  activeTab === "orders"
                    ? "bg-green-50 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
                // placeholder for other pages
              >
                <ShoppingBagIcon className="h-5 w-5 mr-3" />
                <span>Orders</span>
              </button>
            </li>
            <li>
              <button
                className={`flex items-center w-full px-4 py-3 rounded-r-lg ${
                  activeTab === "wishlist"
                    ? "bg-green-50 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <HeartIcon className="h-5 w-5 mr-3" />
                <span>Wishlist</span>
              </button>
            </li>
            <li>
              <button
                className={`flex items-center w-full px-4 py-3 rounded-r-lg ${
                  activeTab === "addresses"
                    ? "bg-green-50 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("addresses")}
              >
                <MapIcon className="h-5 w-5 mr-3" />
                <span>Address</span>
              </button>
            </li>
            <li>
              <button
                className={`flex items-center w-full px-4 py-3 rounded-r-lg ${
                  activeTab === "contacts"
                    ? "bg-green-50 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("contacts")}
              >
                <PhoneIcon className="h-5 w-5 mr-3" />
                <span>Contacts</span>
              </button>
            </li>
            <li>
              <button
                className={`flex items-center w-full px-4 py-3 rounded-r-lg ${
                  activeTab === "notifications"
                    ? "bg-green-50 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <BellIcon className="h-5 w-5 mr-3" />
                <span>Notifications</span>
              </button>
            </li>
            <li>
              <button className="flex items-center w-full px-4 py-3 rounded-r-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                <LogOutIcon className="h-5 w-5 mr-3" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        {activeTab === "account" && renderAccountSettings()}
        {activeTab === "addresses" && <AddressSettingsPage />}
        {activeTab === "contacts" && <ContactSettingsPage />}
      </main>
    </div>
  );
};

export default ProfilePage;
