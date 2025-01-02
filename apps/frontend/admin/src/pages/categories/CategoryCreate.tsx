import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utils/cn";
import { MultiSelect } from "@/components/MultiSelect";
import { Cat, Dog, Fish, Rabbit, Turtle } from "lucide-react";

const frameworksList = [
  { value: "react", label: "React", icon: Turtle },
  { value: "angular", label: "Angular", icon: Cat },
  { value: "vue", label: "Vue", icon: Dog },
  { value: "svelte", label: "Svelte", icon: Rabbit },
  { value: "ember", label: "Ember", icon: Fish }
];

const profileFormSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters."
    })
    .max(30, {
      message: "Username must not be longer than 30 characters."
    })
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  bio: "I own a computer."
};

const CategoryCreate: React.FC = () => {
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange"
  });

  const { fields, append } = useFieldArray({
    name: "images",
    control: form.control
  });

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      )
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 lg:gap-6">
          <div className="lg:col-span-3 space-y-3">
            <FormField
              control={form.control}
              name="categoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category Name" {...field} />
                  </FormControl>
                  {/* <FormDescription>Name</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description"
                      className="resize-none"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>
                    You can <span>@mention</span> other users and organizations
                    to link to them.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              {fields.map((field, index) => (
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`images.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && "sr-only")}>
                        Images
                      </FormLabel>
                      {/* <FormDescription className={cn(index !== 0 && "sr-only")}>
                        Add links to your website, blog, or social media
                        profiles.
                      </FormDescription> */}
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ value: "" })}
              >
                Add Image
              </Button>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={frameworksList}
                      onValueChange={setSelectedFrameworks}
                      defaultValue={selectedFrameworks}
                      placeholder="Parent Category"
                      variant="default"
                      maxCount={3}
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>Name</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
};

export default CategoryCreate;
