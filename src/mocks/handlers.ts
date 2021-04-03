import { rest } from "msw";

export const handlers = [
    rest.get(
        "https://api.github.com/repos/tannerlinsley/react-query",
        (req, res, ctx) => {
            return res(
                ctx.status(200),
                ctx.json({
                    name: "mocked-react-query"
                })
            );
        }
    )
];
