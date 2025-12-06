import httpStatus from "http-status-codes";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handlerCastError = (err: any) => {
  const match = err.message.match(
    /Cast to (\w+) failed for value "?([^"\s]+)"? \(type \w+\) at path "([^"]+)"(?: for model "([^"]+)")?/
  );
  const [, expectedType, value, field, model] = match;
  const readable = `The value "${value}" is not a valid "${expectedType}" for the field "${field}" ${model ? `in the "${model}" model ` : ""
    }.`;
  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: readable,
  };
};
