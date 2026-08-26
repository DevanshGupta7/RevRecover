"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  FailureReason,
  RecoveryEligibility,
} from "@/types/payment";

interface PaymentFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  failureReason: FailureReason | "all";
  onFailureReasonChange: (
    value: FailureReason | "all"
  ) => void;

  eligibility: RecoveryEligibility | "all";
  onEligibilityChange: (
    value: RecoveryEligibility | "all"
  ) => void;
}

export function PaymentFilters({
  search,
  onSearchChange,
  failureReason,
  onFailureReasonChange,
  eligibility,
  onEligibilityChange,
}: PaymentFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative min-w-0 flex-1 lg:max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

        <Input
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search payment or customer..."
          className="border-zinc-800 bg-zinc-950 pl-9 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-zinc-700"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Select
          value={failureReason}
          onValueChange={(value) =>
            onFailureReasonChange(
              value as FailureReason | "all"
            )
          }
        >
          <SelectTrigger className="w-full border-zinc-800 bg-zinc-950 text-zinc-300 sm:w-[190px]">
            <SlidersHorizontal className="mr-2 h-3.5 w-3.5 text-zinc-500" />

            <SelectValue placeholder="Failure reason" />
          </SelectTrigger>

          <SelectContent className="border-zinc-800 bg-zinc-950 text-zinc-200">
            <SelectItem value="all">
              All failure reasons
            </SelectItem>

            <SelectItem value="insufficient_funds">
              Insufficient Funds
            </SelectItem>

            <SelectItem value="expired_card">
              Expired Card
            </SelectItem>

            <SelectItem value="bank_decline">
              Bank Decline
            </SelectItem>

            <SelectItem value="technical_error">
              Technical Error
            </SelectItem>

            <SelectItem value="other">
              Other
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={eligibility}
          onValueChange={(value) =>
            onEligibilityChange(
              value as RecoveryEligibility | "all"
            )
          }
        >
          <SelectTrigger className="w-full border-zinc-800 bg-zinc-950 text-zinc-300 sm:w-[170px]">
            <SelectValue placeholder="Recoverability" />
          </SelectTrigger>

          <SelectContent className="border-zinc-800 bg-zinc-950 text-zinc-200">
            <SelectItem value="all">
              All eligibility
            </SelectItem>

            <SelectItem value="high">
              High
            </SelectItem>

            <SelectItem value="medium">
              Medium
            </SelectItem>

            <SelectItem value="low">
              Low
            </SelectItem>

            <SelectItem value="not_eligible">
              Not Eligible
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
