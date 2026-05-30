import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { MemoryRouter, type MemoryRouterProps } from "react-router-dom";
import { beforeEach } from "vitest";

type TestProvidersProps = {
  children: ReactNode;
  routerProps?: MemoryRouterProps;
  queryClient?: QueryClient;
};

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

export function TestProviders({
  children,
  routerProps,
  queryClient = createTestQueryClient(),
}: TestProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter {...routerProps}>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

type CustomRenderOptions = Omit<RenderOptions, "wrapper"> & {
  routerProps?: MemoryRouterProps;
  queryClient?: QueryClient;
};

export function renderWithProviders(
  ui: ReactElement,
  { routerProps, queryClient, ...options }: CustomRenderOptions = {},
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <TestProviders routerProps={routerProps} queryClient={queryClient}>
        {children}
      </TestProviders>
    ),
    ...options,
  });
}

export function setupPageRender(
  ui: ReactElement,
  options?: CustomRenderOptions,
) {
  beforeEach(() => {
    renderWithProviders(ui, options);
  });
}

export { createTestQueryClient };
