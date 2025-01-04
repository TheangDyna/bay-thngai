import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CuisineInput } from "@/types/cuisine.types";
import { CuisineSchema } from "@/validators/cuisine.validators";
import { useCreateCuisineMutation } from "@/api/cuisine.api";

const defaultValues: Partial<CuisineInput> = {
  name: "",
  description: ""
};

const CuisineCreate: React.FC = () => {
  const form = useForm<CuisineInput>({
    resolver: zodResolver(CuisineSchema),
    defaultValues
  });

  const createCuisineMutation = useCreateCuisineMutation();

  function onSubmit(data: CuisineInput) {
    createCuisineMutation.mutate(data, {
      onSuccess: () => {
        toast({
          description: "Cuisine created successfully!"
        });
        form.reset();
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.message ||
          "Something went wrong. Please try again.";
        toast({
          description: errorMessage,
          variant: "destructive"
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 lg:gap-6">
          <div className="lg:col-span-3 space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cuisine Name</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="cuisine-name"
                      placeholder="Cuisine Name"
                      {...field}
                    />
                  </FormControl>
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
                      autoComplete="off"
                      placeholder="Description"
                      className="resize-none"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
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

export default CuisineCreate;
