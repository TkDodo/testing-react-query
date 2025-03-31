import "@testing-library/jest-dom/vitest";
import { http, HttpResponse } from "msw";
import { describe, expect, test } from "vitest";
import { server } from "../../vitest-setup";
import { Example } from "../Example";
import { renderWithClient } from "./utils";

describe("query component", () => {
  test("successful query component", async () => {
    const result = renderWithClient(<Example />);

    expect(await result.findByText(/mocked-react-query/i)).toBeInTheDocument();
  });

  test("failure query component", async () => {
    server.use(
      http.get("*", () => {
        return HttpResponse.error();
      })
    );

    const result = renderWithClient(<Example />);

    expect(
      await result.findByText(/an error has occurred/i)
    ).toBeInTheDocument();
  });
});
