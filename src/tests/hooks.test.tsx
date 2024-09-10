import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, test } from "vitest";
import { server } from "../../vitest-setup";
import { useRepoData } from "../hooks";
import { createWrapper } from "./utils";

describe("query hook", () => {
  test("successful query hook", async () => {
    const { result } = renderHook(() => useRepoData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.name).toBe("mocked-react-query");
  });

  test("failure query hook", async () => {
    server.use(
      http.get("*", () => {
        return HttpResponse.error();
      })
    );

    const { result } = renderHook(() => useRepoData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});
