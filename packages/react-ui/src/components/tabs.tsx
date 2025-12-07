'use client';

import React, { forwardRef } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../utils/cn';

const Tabs = TabsPrimitive.Root;

const TabsList = forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      `inline-flex h-10 items-center justify-center rounded-2xl
       bg-[var(--flexi-bg-subtle)] p-1 text-[var(--flexi-fg-muted)]`,
      className
    )}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

const TabsTrigger = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      `inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3 py-1.5
       text-sm font-medium transition-all
       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--flexi-ring)]
       disabled:pointer-events-none disabled:opacity-50
       data-[state=active]:bg-[var(--flexi-bg)] data-[state=active]:text-[var(--flexi-fg)]
       data-[state=active]:shadow-sm`,
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      `mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--flexi-ring)]`,
      className
    )}
    {...props}
  />
));
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
