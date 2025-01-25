"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { validateSarif } from "@/utils/validateSarif";
import { z } from "zod";

/**
 * Zod schema for validating SARIF input through react-hook-form.
 * - Requires a non-empty SARIF string.
 * - Validates the string as JSON and matches the SARIF schema.
 */
const FormSchema = z.object({
  sarif: z
    .string()
    .min(1, { message: "SARIF content is required." }) // Ensure input is not empty.
    .refine((value) => validateSarif(value), {
      message:
        "Invalid SARIF format. Ensure it’s valid JSON and matches SARIF schema.",
    }),
});

/**
 * Hero Component
 * - Allows users to upload a SARIF file or paste SARIF JSON content.
 * - Validates SARIF data and navigates to /dashboard with the data in the URL hash.
 */
export default function Hero() {
  const router = useRouter();

  // State to track if a file was successfully uploaded.
  const [fileUploaded, setFileUploaded] = useState(false);

  // Set up react-hook-form for form state management and validation.
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange", // Validate on every change.
  });

  /**
   * Handles file upload logic:
   * - Reads the file as text using FileReader.
   * - Validates the JSON immediately and updates the form state if valid.
   */
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();

      // When the file is successfully read.
      reader.onload = (e) => {
        if (e.target?.result) {
          const content = e.target.result.toString().trim();

          try {
            // Attempt to validate SARIF JSON.
            if (!validateSarif(content)) {
              throw new Error("Invalid SARIF JSON");
            }

            // If valid, update form state and UI feedback.
            form.setValue("sarif", content);
            form.clearErrors("sarif"); // Clear any lingering validation errors.
            setFileUploaded(true);
            toast({
              title: "File uploaded",
              description: `Successfully loaded "${file.name}"`,
            });
          } catch (error) {
            // Handle invalid SARIF errors.
            toast({
              title: "Invalid SARIF file",
              description: "The uploaded file is not valid SARIF JSON.",
              variant: "destructive",
            });
            setFileUploaded(false);
          }
        }
      };

      // Handle file reading errors.
      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Could not read the file. Please try again.",
          variant: "destructive",
        });
      };

      reader.readAsText(file);
    },
    [form]
  );

  /**
   * Final form submission handler:
   * - Base64 encodes the valid SARIF content.
   * - Navigates to /dashboard with the encoded content in the URL hash.
   */
  const onSubmit = useCallback(
    (data: z.infer<typeof FormSchema>) => {
      const base64Content = btoa(data.sarif);
      router.push(`/dashboard#${base64Content}`);
    },
    [router]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center px-4 text-white">
      <div className="max-w-2xl w-full bg-white/5 backdrop-blur-sm rounded-xl shadow-lg p-8">
        <h1 className="text-5xl font-extrabold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          SARIF Dashboard
        </h1>
        <p className="text-center text-gray-200 mb-8">
          Provide your SARIF data by uploading a file <em>OR</em> pasting JSON
          content.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
            noValidate
          >
            {/* Option A: File Upload */}
            <div className="flex flex-col space-y-4">
              <h2 className="font-semibold text-lg text-gray-200">
                Option 1: Upload a SARIF file
              </h2>
              <FormLabel htmlFor="sarifFile">Choose SARIF file:</FormLabel>
              <Input
                id="sarifFile"
                type="file"
                accept=".json,.sarif"
                onChange={handleFileUpload}
              />
              {fileUploaded && (
                <p className="text-sm text-green-400">File content loaded.</p>
              )}
            </div>

            {/* OR Divider */}
            <div className="flex items-center justify-center text-gray-400 mt-4">
              <hr className="flex-grow border-gray-500/50 mr-2" />
              <span className="text-sm uppercase">or</span>
              <hr className="flex-grow border-gray-500/50 ml-2" />
            </div>

            {/* Option B: Textarea for SARIF Content */}
            <FormField
              control={form.control}
              name="sarif"
              render={({ field }) => (
                <FormItem>
                  <h2 className="font-semibold text-lg text-gray-200 mt-4 mb-2">
                    Option 2: Paste SARIF JSON
                  </h2>
                  <FormLabel htmlFor="sarifContent" className="mt-2">
                    SARIF Content:
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="sarifContent"
                      placeholder="Paste SARIF JSON content here..."
                      className="h-72 resize-y text-sm text-black"
                      {...field}
                      // Clear errors if the user deletes input or fixes it.
                      onChange={(e) => {
                        field.onChange(e);
                        if (!e.target.value.trim()) {
                          form.clearErrors("sarif");
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Make sure the JSON matches the required SARIF schema.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                variant="secondary"
                type="submit"
                className="px-8 py-3 text-lg font-semibold shadow-sm hover:shadow-md"
                disabled={!form.formState.isValid}
              >
                View Dashboard
              </Button>
            </div>
          </form>
        </Form>

        <p className="text-sm text-gray-400 text-center mt-14">
          <strong>Privacy Notice:</strong> All SARIF data is processed locally
          in your browser.
          <br />
          No data is sent to the server or stored externally.
        </p>
      </div>
    </div>
  );
}
