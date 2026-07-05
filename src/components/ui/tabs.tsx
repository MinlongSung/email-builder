import { createContext, useContext, useState, useCallback } from "react";
import { cn } from "@/components/utils/cn";

interface TabsContextValue {
  value: string;
  setValue(value: string): void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("Tabs components must be used inside <Tabs>.");
  }

  return context;
}

interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

function Tabs({ value, defaultValue, onValueChange, children }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");

  const currentValue = value ?? internalValue;

  const setValue = useCallback(
    (next: string) => {
      if (value === undefined) {
        setInternalValue(next);
      }

      onValueChange?.(next);
    },
    [value, onValueChange],
  );

  return (
    <TabsContext.Provider
      value={{
        value: currentValue,
        setValue,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
}

interface TabsListProps extends React.ComponentProps<"div"> {}

function TabsList({ className, ...props }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-muted p-1",
        className,
      )}
      {...props}
    />
  );
}

interface TabsTriggerProps extends Omit<
  React.ComponentProps<"button">,
  "value"
> {
  value: string;
}

function TabsTrigger({
  value,
  className,
  children,
  ...props
}: TabsTriggerProps) {
  const tabs = useTabs();

  const selected = tabs.value === value;

  return (
    <button
      role="tab"
      type="button"
      aria-selected={selected}
      data-state={selected ? "active" : "inactive"}
      className={cn(
        "rounded px-3 py-1.5 text-sm transition-colors",
        selected && "bg-background shadow",
        className,
      )}
      onClick={() => tabs.setValue(value)}
      {...props}
    >
      {children}
    </button>
  );
}

interface TabsContentProps extends React.ComponentProps<"div"> {
  value: string;
  forceMount?: boolean;
}

function TabsContent({
  value,
  forceMount,
  children,
  ...props
}: TabsContentProps) {
  const tabs = useTabs();

  const selected = tabs.value === value;

  if (!forceMount && !selected) {
    return null;
  }

  return (
    <div role="tabpanel" hidden={!selected} {...props}>
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
