// src/pages/ProfilePage.jsx
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
import {
  BellIcon,
  DockIcon,
  EyeIcon,
  FileQuestionIcon,
  HeartIcon,
  KeyIcon,
  LogOutIcon,
  MapIcon,
  ShoppingBagIcon,
  UserIcon
} from "lucide-react";
import { useForm } from "react-hook-form";

const ProfilePage = () => {
  // React Hook Form setup
  const form = useForm({
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

  const onSubmit = (values: any) => {
    // For now, just log form values to the console
    console.log("Form Values:", values);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* ───────────────────────────────────────────────────────────────────────
          SIDEBAR
      ─────────────────────────────────────────────────────────────────────── */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <nav className="mt-8">
          <ul className="space-y-1">
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-3 bg-green-50 text-green-700 font-medium rounded-r-lg"
              >
                <UserIcon className="h-5 w-5 mr-3" />
                <span>Account Settings</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-r-lg"
              >
                <ShoppingBagIcon className="h-5 w-5 mr-3" />
                <span>Orders</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-r-lg"
              >
                <HeartIcon className="h-5 w-5 mr-3" />
                <span>Wishlist</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-r-lg"
              >
                <MapIcon className="h-5 w-5 mr-3" />
                <span>Address</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-r-lg"
              >
                <BellIcon className="h-5 w-5 mr-3" />
                <span>Notifications</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-r-lg"
              >
                <DockIcon className="h-5 w-5 mr-3" />
                <span>Legal Notice</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-r-lg"
              >
                <FileQuestionIcon className="h-5 w-5 mr-3" />
                <span>Help Center</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-r-lg"
              >
                <KeyIcon className="h-5 w-5 mr-3" />
                <span>Change Password</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-r-lg"
              >
                <LogOutIcon className="h-5 w-5 mr-3" />
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* ───────────────────────────────────────────────────────────────────────
          MAIN CONTENT
      ─────────────────────────────────────────────────────────────────────── */}
      <main className="flex-1 p-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="px-6 pt-6 pb-0">
            <CardTitle className="text-xl">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* ─── Personal Information ─────────────────────────────── */}
                <section>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-gray-900">
                      Personal Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* First Name */}
                    <FormField
                      control={form.control}
                      name="firstName"
                      rules={{ required: "First name is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            First Name <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John"
                              {...field}
                              className="mt-1"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Last Name */}
                    <FormField
                      control={form.control}
                      name="lastName"
                      rules={{ required: "Last name is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Last Name <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Doe"
                              {...field}
                              className="mt-1"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Phone / Mobile */}
                  <div className="mt-6">
                    <FormField
                      control={form.control}
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

                {/* ─── Account Information ─────────────────────────────── */}
                <section>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-gray-900">
                      Account Information
                    </h2>
                  </div>

                  {/* Email */}
                  <div>
                    <FormField
                      control={form.control}
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

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                    {/* Password */}
                    <FormField
                      control={form.control}
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

                    {/* Confirm Password */}
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      rules={{
                        validate: (value: string) =>
                          value === form.getValues("password") ||
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

                {/* ─── Toggles Section ─────────────────────────────────── */}
                <section className="space-y-6">
                  {/* Share Profile Data */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Share Profile Data
                      </h3>
                      <p className="text-xs text-gray-500">
                        Share your profile information to collect the product
                        search result
                      </p>
                    </div>
                    <FormField
                      control={form.control}
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

                  {/* Ads Performance */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Ads Performance
                      </h3>
                      <p className="text-xs text-gray-500">
                        To improve your ads search result we need to collect
                        your cookies behavior
                      </p>
                    </div>
                    <FormField
                      control={form.control}
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

                {/* ─── Submit Button ─────────────────────────────────── */}
                <div className="pt-6 border-t border-gray-200">
                  <Button type="submit" className="w-full">
                    Update Profile
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProfilePage;
