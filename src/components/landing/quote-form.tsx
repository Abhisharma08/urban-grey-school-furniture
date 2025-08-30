
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { hubspotUpsert, HubspotUpsertInput } from "@/ai/flows/hubspot-upsert-flow";
import { useToast } from "@/hooks/use-toast";

const stepOneSchema = z.object({
  fullName: z.string().min(2, "Please enter a valid name."),
  email: z.string().email("Please enter a valid email address."),
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number."),
});


const stepTwoSchema = z.object({
  city: z.string().min(2, "Please enter a city."),
  requirement: z.enum([
    "Boardroom Elegance",
    "Collaborative Meeting Zones",
    "Compact Conference Settings",
    "Integrated Tech & Storage"
  ], {
    errorMap: () => ({ message: "Please select a requirement." }),
  }),
  quantity: z.enum(["3+", "6+", "8+", "12+", "15+", "20+"], {
    errorMap: () => ({ message: "Please select a quantity." }),
  }),
});

const formSchema = stepOneSchema.merge(stepTwoSchema);

type FormData = z.infer<typeof formSchema>;

export function QuoteForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(step === 1 ? stepOneSchema : formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      city: "",
    },
  });

  const handleNext = async () => {
    const isValid = await form.trigger(["fullName", "email", "phoneNumber"]);
    if (isValid) {
      setIsSubmitting(true);
      try {
        const stepOneData: HubspotUpsertInput = {
          fullName: form.getValues("fullName"),
          email: form.getValues("email"),
          phoneNumber: form.getValues("phoneNumber"),
        };
        await hubspotUpsert(stepOneData);
        setStep(2);
      } catch (error) {
        console.error("HubSpot API Error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save your information. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await hubspotUpsert(data);
      router.push("/thank-you?success=true");
    } catch (error) {
      console.error("HubSpot API Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your information. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl bg-card/60 text-card-foreground backdrop-blur-sm" id="get-a-quote">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-card-foreground">Request a Free Quote</CardTitle>
        <CardDescription className="text-card-foreground">
          {step === 1 ? "Step 1 of 2: Your Details" : "Step 2 of 2: Your Requirements"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {step === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. example@domain.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" onClick={handleNext} className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Saving...' : 'Next'}
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. New Delhi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="requirement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What is your requirement?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a requirement" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Boardroom Elegance">Boardroom Elegance</SelectItem>
                          <SelectItem value="Collaborative Meeting Zones">Collaborative Meeting Zones</SelectItem>
                          <SelectItem value="Compact Conference Settings">Compact Conference Settings</SelectItem>
                          <SelectItem value="Integrated Tech & Storage">Integrated Tech & Storage</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Required quantity?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a quantity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="3+">3+</SelectItem>
                          <SelectItem value="6+">6+</SelectItem>
                          <SelectItem value="8+">8+</SelectItem>
                          <SelectItem value="12+">12+</SelectItem>
                          <SelectItem value="15+">15+</SelectItem>
                          <SelectItem value="20+">20+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-full">
                        Back
                    </Button>
                    <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? 'Submitting...' : 'Get a Quote'}
                    </Button>
                </div>
              </>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
