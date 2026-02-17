"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Section } from "./section";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormErrors {
  fullName?: string;
  email?: string;
  school?: string;
  undergraduateYear?: string;
  message?: string;
  form?: string;
}

interface University {
  id: number;
  name: string;
  country: string;
  state: string | null;
}

// Throttle key and duration
const THROTTLE_KEY = "qf_contact_last_submit";
const THROTTLE_DURATION_MS = 5000; // 5 seconds between submissions

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Form load timestamp for anti-spam
  const [formLoadedAt] = useState(() => Date.now());

  // University autocomplete state
  const [schoolOpen, setSchoolOpen] = useState(false);
  const [schoolValue, setSchoolValue] = useState("");
  const [schoolSearch, setSchoolSearch] = useState("");
  const [universities, setUniversities] = useState<University[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSchoolMatched, setIsSchoolMatched] = useState(false);
  
  // Pagination state for university list
  const [uniOffset, setUniOffset] = useState(0);
  const [uniTotal, setUniTotal] = useState(0);
  const PAGE_SIZE = 10;
  const MIN_CHARS = 2;

  // Year dropdown options (2020-2032)
  const yearOptions = Array.from({ length: 13 }, (_, i) => 2020 + i);

  // Debounce timer for university search
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Search universities as user types
  const searchUniversities = useCallback(async (query: string, offset: number = 0) => {
    if (query.length < MIN_CHARS) {
      setUniversities([]);
      setUniTotal(0);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(
        `/api/universities?q=${encodeURIComponent(query)}&offset=${offset}&limit=${PAGE_SIZE}`,
      );
      if (res.ok) {
        const data = await res.json();
        setUniversities(data.universities || []);
        setUniTotal(data.total || 0);
        setUniOffset(offset);
      }
    } catch (error) {
      console.error("University search failed:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search - fast real-time matching
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (schoolSearch.length >= MIN_CHARS) {
      // Reset pagination when search query changes
      setUniOffset(0);
      searchTimeoutRef.current = setTimeout(() => {
        searchUniversities(schoolSearch, 0);
      }, 150); // Fast 150ms debounce for real-time feel
    } else {
      setUniversities([]);
      setUniTotal(0);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [schoolSearch, searchUniversities]);

  // Pagination handlers
  const handlePrevPage = () => {
    if (uniOffset > 0) {
      searchUniversities(schoolSearch, Math.max(0, uniOffset - PAGE_SIZE));
    }
  };

  const handleNextPage = () => {
    if (uniOffset + PAGE_SIZE < uniTotal) {
      searchUniversities(schoolSearch, uniOffset + PAGE_SIZE);
    }
  };

  // Check client-side throttle
  function isThrottled(): boolean {
    try {
      const lastSubmit = localStorage.getItem(THROTTLE_KEY);
      if (lastSubmit) {
        const elapsed = Date.now() - parseInt(lastSubmit, 10);
        return elapsed < THROTTLE_DURATION_MS;
      }
    } catch {
      // localStorage not available
    }
    return false;
  }

  // Set throttle timestamp
  function setThrottle() {
    try {
      localStorage.setItem(THROTTLE_KEY, Date.now().toString());
    } catch {
      // localStorage not available
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Client-side throttle check
    if (isThrottled()) {
      setErrors({ form: "Please wait a few seconds before submitting again." });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

    // Client-side validation
    const newErrors: FormErrors = {};
    const fullName = (formData.get("fullName") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const school = schoolValue.trim();

    if (!fullName || fullName.length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!school || school.length < 2) {
      newErrors.school = "Please select or enter your school";
    }
    const yearValue = formData.get("undergraduateYear") as string;
    const year = parseInt(yearValue);
    if (!yearValue || isNaN(year) || year < 2020 || year > 2032) {
      newErrors.undergraduateYear = "Please select your undergraduate year";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          school,
          undergraduateYear: year,
          message: (formData.get("message") as string)?.trim() || undefined,
          // Anti-spam fields
          hp_website: (formData.get("hp_website") as string) || "",
          _ts: formLoadedAt,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setErrors({
            form: "Too many submissions. Please try again in a few minutes.",
          });
        } else if (data.code === "too_fast") {
          setErrors({
            form: "Please take a moment to fill out the form completely.",
          });
        } else if (data.code === "disposable_email") {
          setErrors({
            email: "Please use a permanent email address.",
          });
        } else if (data.details?.fieldErrors) {
          const fieldErrors = data.details.fieldErrors;
          setErrors({
            fullName: fieldErrors.fullName?.[0],
            email: fieldErrors.email?.[0],
            school: fieldErrors.school?.[0],
            undergraduateYear: fieldErrors.undergraduateYear?.[0],
            message: fieldErrors.message?.[0],
          });
        } else {
          setErrors({
            form: data.error || "Something went wrong. Please try again.",
          });
        }
        return;
      }

      // Set throttle on successful submission
      setThrottle();
      setIsSuccess(true);
    } catch {
      setErrors({
        form: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <Section>
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-2">
              Thank you for reaching out!
            </h3>
            <p className="text-muted-foreground">
              We&apos;ll get back to you within 24-48 hours.
            </p>
          </CardContent>
        </Card>
      </Section>
    );
  }

  return (
    <Section>
      <Card>
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl md:text-3xl font-serif">
            Contact Us
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Have questions about our mentorship program? We&apos;d love to hear
            from you.
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot field - hidden from users, bots will fill it */}
            <input
              type="text"
              name="hp_website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-9999px",
                width: "1px",
                height: "1px",
                overflow: "hidden",
              }}
            />

            {/* Row 1: Full Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  aria-invalid={!!errors.fullName}
                  aria-describedby={
                    errors.fullName ? "fullName-error" : undefined
                  }
                />
                {errors.fullName && (
                  <p id="fullName-error" className="text-sm text-destructive">
                    {errors.fullName}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-destructive">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: School (Autocomplete) + Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="school">
                  School <span className="text-destructive">*</span>
                </Label>
                <Popover open={schoolOpen} onOpenChange={setSchoolOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={schoolOpen}
                      aria-invalid={!!errors.school}
                      className={`w-full justify-between font-normal ${isSchoolMatched ? "border-green-500 ring-1 ring-green-500" : ""}`}
                    >
                      <span className="flex items-center gap-2">
                        {schoolValue || "Search for your school..."}
                        {isSchoolMatched && (
                          <svg
                            className="h-4 w-4 text-green-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                        )}
                      </span>
                      <svg
                        className="ml-2 h-4 w-4 shrink-0 opacity-50"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m7 15 5 5 5-5" />
                        <path d="m7 9 5-5 5 5" />
                      </svg>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[320px] p-0" align="start">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Type to search schools..."
                        value={schoolSearch}
                        onValueChange={setSchoolSearch}
                      />
                      <CommandList>
                        {isSearching && (
                          <div className="py-6 text-center text-sm text-muted-foreground">
                            Searching...
                          </div>
                        )}
                        {!isSearching &&
                          schoolSearch.length >= MIN_CHARS &&
                          universities.length === 0 && (
                            <CommandEmpty>
                              No schools found. You can type your school name
                              and press Enter.
                            </CommandEmpty>
                          )}
                        {!isSearching && universities.length > 0 && (
                          <>
                            {/* Pagination: Previous button */}
                            {uniOffset > 0 && (
                              <button
                                type="button"
                                onClick={handlePrevPage}
                                className="w-full py-2 px-3 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground border-b"
                              >
                                <svg
                                  className="h-4 w-4"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="m18 15-6-6-6 6"/>
                                </svg>
                                Previous {PAGE_SIZE}
                              </button>
                            )}
                            <CommandGroup>
                              {universities.map((uni) => (
                                <CommandItem
                                  key={uni.id}
                                  value={uni.name}
                                  onSelect={() => {
                                    setSchoolValue(uni.name);
                                    setIsSchoolMatched(true);
                                    setSchoolOpen(false);
                                    setSchoolSearch("");
                                  }}
                                >
                                  <span>{uni.name}</span>
                                  {uni.state && (
                                    <span className="ml-2 text-xs text-muted-foreground">
                                      {uni.state}
                                    </span>
                                  )}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                            {/* Pagination: Next button */}
                            {uniOffset + PAGE_SIZE < uniTotal && (
                              <button
                                type="button"
                                onClick={handleNextPage}
                                className="w-full py-2 px-3 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground border-t"
                              >
                                Next {PAGE_SIZE}
                                <svg
                                  className="h-4 w-4"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="m6 9 6 6 6-6"/>
                                </svg>
                              </button>
                            )}
                            {/* Show result count */}
                            <div className="px-3 py-1.5 text-xs text-muted-foreground text-center border-t">
                              Showing {uniOffset + 1}-{Math.min(uniOffset + universities.length, uniTotal)} of {uniTotal}
                            </div>
                          </>
                        )}
                        {/* Allow custom entry */}
                        {schoolSearch.length >= MIN_CHARS &&
                          !universities.find(
                            (u) =>
                              u.name.toLowerCase() ===
                              schoolSearch.toLowerCase(),
                          ) && (
                            <CommandGroup>
                              <CommandItem
                                value={schoolSearch}
                                onSelect={() => {
                                  setSchoolValue(schoolSearch);
                                  setIsSchoolMatched(false);
                                  setSchoolOpen(false);
                                  setSchoolSearch("");
                                }}
                              >
                                <span className="text-muted-foreground">
                                  Use:{" "}
                                </span>
                                <span className="font-medium">
                                  {schoolSearch}
                                </span>
                              </CommandItem>
                            </CommandGroup>
                          )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.school && (
                  <p id="school-error" className="text-sm text-destructive">
                    {errors.school}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="undergraduateYear">
                  Undergraduate Year <span className="text-destructive">*</span>
                </Label>
                <Select name="undergraduateYear">
                  <SelectTrigger
                    id="undergraduateYear"
                    aria-invalid={!!errors.undergraduateYear}
                    aria-describedby={
                      errors.undergraduateYear ? "year-error" : undefined
                    }
                  >
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.undergraduateYear && (
                  <p id="year-error" className="text-sm text-destructive">
                    {errors.undergraduateYear}
                  </p>
                )}
              </div>
            </div>

            {/* Comments/Questions - Full Width */}
            <div className="space-y-2">
              <Label htmlFor="message">
                Comments or Questions{" "}
                <span className="text-muted-foreground text-xs">
                  (Optional)
                </span>
              </Label>
              <Textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Tell us about your interest in quantitative finance, any specific questions you have, or how we can help you..."
                className="resize-y min-h-[120px]"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && (
                <p id="message-error" className="text-sm text-destructive">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Form-level error */}
            {errors.form && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{errors.form}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Section>
  );
}
