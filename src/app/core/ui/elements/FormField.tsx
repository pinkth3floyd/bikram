import * as React from "react";
import { Label } from "./Label";
import { cn } from "../elements/ClassnameUtil";

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ 
  label, 
  htmlFor, 
  error, 
  children, 
  className,
  ...props 
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}
    </div>
  );
} 