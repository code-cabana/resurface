import { captureException } from "@sentry/nextjs";

const logger = {
  error: (error) => {
    captureException(error);
  },
};

export default logger;
